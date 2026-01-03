from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from scipy.sparse import load_npz
from numpy import load
from backend.app.core.config import (
    CLEANED_DATA_PATH,
    TRANSFORMED_DATA_PATH,
    TRACK_IDS_PATH,
    FILTERED_DATA_PATH,
    INTERACTION_MATRIX_PATH,
    TRANSFORMED_HYBRID_DATA_PATH
)
from backend.app.services.hybrid_recommendations import HybridRecommenderSystem
from backend.app.core.state import state

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load data on startup
    print("Loading data...")
    state.songs_data = pd.read_csv(CLEANED_DATA_PATH)
    state.transformed_data = load_npz(TRANSFORMED_DATA_PATH)
    state.track_ids = load(TRACK_IDS_PATH, allow_pickle=True)
    state.filtered_data = pd.read_csv(FILTERED_DATA_PATH)
    state.interaction_matrix = load_npz(INTERACTION_MATRIX_PATH)
    state.transformed_hybrid_data = load_npz(TRANSFORMED_HYBRID_DATA_PATH)
    
    # Initialize services if needed (HybridRecommenderSystem is a class, we might instantiate it per request or global)
    # The class takes K and weight in init, so it's request-dependent.
    
    print("Data loaded successfully.")
    yield
    # Clean up on shutdown

app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5179"],  # Allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the HRS API"}

# Import routers here to avoid circular imports if they use 'app' (better to use APIRouter)
from backend.app.routers import recommendations, discover, personal, artists
app.include_router(recommendations.router)
app.include_router(discover.router)
app.include_router(personal.router)
app.include_router(artists.router)
