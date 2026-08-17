import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .database.mongodb import db_manager
from .ml.inference import inference_engine
from .api.routes import health, prediction, assessment, model_performance, assistant, report

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("heartguard.app")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup sequence
    logger.info("Initializing HeartGuard AI Backend...")
    db_manager.connect(uri=settings.MONGODB_URI, db_name=settings.MONGODB_DB_NAME)
    
    # Check if models are loaded
    models_loaded = inference_engine.load_artifacts()
    if models_loaded:
        logger.info("ML Models (DNN, MLP, TabNet) and Preprocessor loaded successfully.")
    else:
        logger.warning("ML Model artifacts not yet found. Ready to train or load artifacts.")

    yield
    # Shutdown
    logger.info("Shutting down HeartGuard AI Backend.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production AI-Powered Heart Disease Risk Assessment & Lifestyle Intelligence API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(prediction.router, prefix=settings.API_V1_STR)
app.include_router(assessment.router, prefix=settings.API_V1_STR)
app.include_router(model_performance.router, prefix=settings.API_V1_STR)
app.include_router(assistant.router, prefix=settings.API_V1_STR)
app.include_router(report.router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "service": settings.PROJECT_NAME,
        "tagline": settings.PROJECT_TAGLINE,
        "documentation": "/docs",
        "api_v1": settings.API_V1_STR,
        "disclaimer": "Educational risk assessment only. Not a medical diagnosis."
    }
