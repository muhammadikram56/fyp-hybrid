from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from backend.app.core.state import state
import pandas as pd

router = APIRouter(prefix="/artists", tags=["artists"])

class Artist(BaseModel):
    name: str
    song_count: int

class Song(BaseModel):
    name: str
    artist: str
    spotify_preview_url: Optional[str] = None
    spotify_url: Optional[str] = None

@router.get("/", response_model=List[Artist])
async def get_artists(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    if state.songs_data is None:
        raise HTTPException(status_code=503, detail="Server is still loading data")
    
    # Group by artist and count songs
    # songs_data has 'artist' and 'name' columns (cleaned)
    try:
        artist_counts = state.songs_data['artist'].value_counts()
        
        # Paginate
        # unique_artists = artist_counts.index.tolist()
        # We need slicing on the Series
        paged_artists = artist_counts.iloc[skip : skip + limit]
        
        result = [
            Artist(name=name, song_count=count)
            for name, count in paged_artists.items()
        ]
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{artist_name}", response_model=List[Song])
async def get_artist_songs(artist_name: str):
    if state.songs_data is None:
        raise HTTPException(status_code=503, detail="Server is still loading data")
        
    try:
        # Filter by artist name (case insensitive but data is already lower)
        artist_lower = artist_name.lower()
        songs = state.songs_data[state.songs_data['artist'] == artist_lower]
        
        if songs.empty:
            # Try partial match or return 404? 
            # Let's stick to exact match first as we list them from the DB
             raise HTTPException(status_code=404, detail="Artist not found")

        # Convert to list of dicts
        # Ensure regex columns or whatever are handled
        # The DataFrame likely has: name, artist, spotify_preview_url etc.
        # We might need to construct spotify_url if column doesn't exist?
        # Checking earlier file views, it seems we drop some cols in cleaning but main.py loads cleaned_data.
        # cleaned_data has: track_id,name,artist,spotify_preview_url,...
        
        # We'll just return what's available
        return songs[['name', 'artist', 'spotify_preview_url']].to_dict(orient="records")
        
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
