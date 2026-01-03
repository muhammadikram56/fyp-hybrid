from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from backend.app.core.state import state
from pydantic import BaseModel
import pandas as pd

router = APIRouter(prefix="/discover", tags=["discover"])

class DiscoverResponse(BaseModel):
    name: str
    artist: str
    spotify_preview_url: Optional[str] = None
    # Add other display fields if needed

# Define Mood mappings
# Format: { MoodName: { feature: (min, max), ... } }
MOOD_DEFINITIONS = {
    "happy": {"valence": (0.6, 1.0), "energy": (0.6, 1.0)},
    "sad": {"valence": (0.0, 0.4), "energy": (0.0, 0.4)},
    "chill": {"energy": (0.0, 0.5), "acousticness": (0.5, 1.0)},
    "party": {"danceability": (0.7, 1.0), "energy": (0.7, 1.0)},
    "focus": {"instrumentalness": (0.5, 1.0), "energy": (0.0, 0.6)}
}

@router.get("/moods")
def get_moods():
    """Return available moods"""
    return list(MOOD_DEFINITIONS.keys())

@router.get("/by-mood", response_model=List[DiscoverResponse])
def get_songs_by_mood(mood: str, limit: int = 20):
    if state.songs_data is None:
        raise HTTPException(status_code=503, detail="Server is still loading data")
    
    mood = mood.lower()
    if mood not in MOOD_DEFINITIONS:
        raise HTTPException(status_code=400, detail="Invalid mood")
    
    criteria = MOOD_DEFINITIONS[mood]
    df = state.songs_data
    
    # Build query string for efficiency
    # "feature >= min and feature <= max"
    queries = []
    for feature, (min_val, max_val) in criteria.items():
        if feature in df.columns:
             queries.append(f"{min_val} <= {feature} <= {max_val}")
    
    if not queries:
        return []
        
    query_str = " and ".join(queries)
    
    try:
        filtered_df = df.query(query_str)
        
        if filtered_df.empty:
            return []
        
        # Sample directly
        sample_size = min(limit, len(filtered_df))
        result = filtered_df.sample(n=sample_size)
        
        return result.to_dict(orient="records")
    except Exception as e:
        print(f"Error filtering mood: {e}")
        raise HTTPException(status_code=500, detail="Error filtering songs")

@router.get("/by-genre", response_model=List[DiscoverResponse])
def get_songs_by_genre(genre: str, limit: int = 20):
    if state.songs_data is None:
        raise HTTPException(status_code=503, detail="Server loading")
    
    # Fuzzy match tag
    # tags column is string "tag1, tag2"
    df = state.songs_data
    # Use str.contains, ensure case insensitive
    mask = df["tags"].astype(str).str.contains(genre, case=False, na=False)
    
    filtered_df = df[mask]
    
    if filtered_df.empty:
        return []
    
    sample_size = min(limit, len(filtered_df))
    result = filtered_df.sample(n=sample_size)
    
    return result.to_dict(orient="records")
