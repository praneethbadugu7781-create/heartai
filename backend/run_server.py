import os
import sys
import uvicorn

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app

if __name__ == "__main__":
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting HeartGuard AI FastAPI Server on http://{host}:{port} ...")
    uvicorn.run(app, host=host, port=port, log_level="info")
