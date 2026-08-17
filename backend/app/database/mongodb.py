import os
import json
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
import uuid

logger = logging.getLogger("heartguard.database")

# In-memory store fallback with JSON persistence
FALLBACK_FILE = os.path.join(os.path.dirname(__file__), "..", "artifacts", "assessments_store.json")


class DatabaseManager:
    def __init__(self):
        self.client = None
        self.db = None
        self.is_connected = False
        self._memory_store: Dict[str, Dict[str, Any]] = {}
        self._load_fallback_store()

    def _load_fallback_store(self):
        try:
            if os.path.exists(FALLBACK_FILE):
                with open(FALLBACK_FILE, "r", encoding="utf-8") as f:
                    self._memory_store = json.load(f)
                logger.info(f"Loaded {len(self._memory_store)} assessments from local persistent fallback store.")
        except Exception as e:
            logger.warning(f"Could not load local fallback database file: {e}")
            self._memory_store = {}

    def _persist_fallback_store(self):
        try:
            os.makedirs(os.path.dirname(FALLBACK_FILE), exist_ok=True)
            with open(FALLBACK_FILE, "w", encoding="utf-8") as f:
                json.dump(self._memory_store, f, indent=2)
        except Exception as e:
            logger.error(f"Error persisting fallback store: {e}")

    def connect(self, uri: str = "mongodb://localhost:27017", db_name: str = "heartguard_db"):
        try:
            import pymongo
            self.client = pymongo.MongoClient(uri, serverSelectionTimeoutMS=2000)
            # Test connection
            self.client.server_info()
            self.db = self.client[db_name]
            self.is_connected = True
            logger.info(f"Connected to MongoDB database: {db_name}")
        except Exception as e:
            self.is_connected = False
            logger.warning(f"MongoDB not available ({e}). Using resilient local in-memory persistent store.")

    def insert_assessment(self, assessment_dict: Dict[str, Any]) -> str:
        if "id" not in assessment_dict:
            assessment_dict["id"] = str(uuid.uuid4())
        if "created_at" not in assessment_dict:
            assessment_dict["created_at"] = datetime.utcnow().isoformat()

        doc_id = assessment_dict["id"]

        if self.is_connected and self.db is not None:
            try:
                # Store copy without MongoDB _id conflict
                doc = assessment_dict.copy()
                doc["_id"] = doc_id
                self.db.assessments.insert_one(doc)
                logger.info(f"Assessment {doc_id} inserted into MongoDB.")
            except Exception as e:
                logger.error(f"Failed inserting into MongoDB, writing to fallback store: {e}")

        # Always keep in memory / fallback store for instant lookup
        self._memory_store[doc_id] = assessment_dict
        self._persist_fallback_store()
        return doc_id

    def get_assessment(self, assessment_id: str) -> Optional[Dict[str, Any]]:
        if self.is_connected and self.db is not None:
            try:
                doc = self.db.assessments.find_one({"_id": assessment_id})
                if doc:
                    doc.pop("_id", None)
                    return doc
            except Exception as e:
                logger.warning(f"MongoDB read error: {e}")

        return self._memory_store.get(assessment_id)

    def list_assessments(self, limit: int = 50, skip: int = 0) -> List[Dict[str, Any]]:
        if self.is_connected and self.db is not None:
            try:
                cursor = self.db.assessments.find().sort("created_at", -1).skip(skip).limit(limit)
                results = []
                for doc in cursor:
                    doc.pop("_id", None)
                    results.append(doc)
                if results:
                    return results
            except Exception as e:
                logger.warning(f"MongoDB list error: {e}")

        # Fallback in-memory list sorted descending by created_at
        items = list(self._memory_store.values())
        items.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return items[skip : skip + limit]

    def delete_assessment(self, assessment_id: str) -> bool:
        deleted = False
        if self.is_connected and self.db is not None:
            try:
                res = self.db.assessments.delete_one({"_id": assessment_id})
                deleted = res.deleted_count > 0
            except Exception as e:
                logger.error(f"MongoDB delete error: {e}")

        if assessment_id in self._memory_store:
            del self._memory_store[assessment_id]
            self._persist_fallback_store()
            deleted = True

        return deleted

    def count_assessments(self) -> int:
        if self.is_connected and self.db is not None:
            try:
                return self.db.assessments.count_documents({})
            except Exception:
                pass
        return len(self._memory_store)


# Global singleton instance
db_manager = DatabaseManager()
