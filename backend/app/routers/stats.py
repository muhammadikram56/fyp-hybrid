from fastapi import APIRouter, HTTPException
from backend.app.core.state import state
import pandas as pd

router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("/genres")
async def get_genre_distribution():
    if state.songs_data is None:
        raise HTTPException(status_code=503, detail="Data not loaded yet")
    
    # Assuming 'genre' column exists. If it's a list string "['Pop', 'Rock']", we need to parse it.
    # Based on common dataset formats, let's check first.
    # Usually it's in 'playlist_genre' or 'genre' column for simple datasets, 
    # or AST literal eval if it's a list.
    
    # Let's inspect columns briefly (conceptually), but for implementation:
    # If 'playlist_genre' exists, use it.
    
    df = state.songs_data
    
    target_col = 'playlist_genre' if 'playlist_genre' in df.columns else 'genre'
    
    if target_col not in df.columns:
        # Fallback or empty
        return []
        
    counts = df[target_col].value_counts().reset_index()
    counts.columns = ['name', 'value']
    
    # Return top 10 genres + Others
    top_n = 10
    if len(counts) > top_n:
        top = counts.head(top_n)
        others_count = counts.iloc[top_n:]['value'].sum()
        others = pd.DataFrame([{'name': 'Others', 'value': others_count}])
        final = pd.concat([top, others], ignore_index=True)
    else:
        final = counts
        

from pydantic import BaseModel
from typing import List

class SongItem(BaseModel):
    name: str

@router.post("/personal")
async def get_personal_stats(songs: List[SongItem]):
    if state.songs_data is None:
        raise HTTPException(status_code=503, detail="Data not loaded yet")
    
    if not songs:
        return []

    df = state.songs_data
    # Determine genre column
    target_col = 'playlist_genre' if 'playlist_genre' in df.columns else 'genre'
    if target_col not in df.columns:
        return []

    # Get list of song names from request
    song_names = [s.name for s in songs]
    
    # Filter global DataFrame to finding matching songs
    # Using 'track_name' column which usually matches 'song_name'
    # Check if 'track_name' exists, otherwise 'name'
    name_col = 'track_name' if 'track_name' in df.columns else 'name'
    
    # Filter
    personal_df = df[df[name_col].isin(song_names)]
    
    if personal_df.empty:
        return []

    counts = personal_df[target_col].value_counts().reset_index()
    counts.columns = ['name', 'value']
    
    # Return all genres found in personal list (usually small enough)
    return counts.to_dict(orient="records")
