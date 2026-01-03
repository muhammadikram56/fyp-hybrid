from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict
from backend.app.core.state import state
import pandas as pd
from backend.app.services.content_based_filtering import content_recommendation

router = APIRouter(prefix="/recommend", tags=["personal"])

# Helper to reuse content filtering on a list of songs
def recommend_from_history(history_songs: List[Dict], k=10):
    # This is a simplified approach:
    # 1. Take the last 3-5 songs from history
    # 2. Get recommendations for each
    # 3. Aggreate and shuffle/sort
    
    # Better approach: Create a "User Profile" vector by averaging vectors of liked songs
    # But for now, let's keep it simple: recommend based on the most recent favorite.
    
    if not history_songs:
        return []

    # Use the most recent favorite (first in list usually if sorted desc)
    target = history_songs[0]
    
    try:
        recs = content_recommendation(
            song_name=target['name'],
            artist_name=target['artist'],
            songs_data=state.songs_data,
            transformed_data=state.transformed_data,
            k=k
        )
        return recs.to_dict(orient="records")
    except Exception as e:
        print(f"Error recommending for {target}: {e}")
        return []

@router.post("/favorites")
async def get_personal_recommendations(
    payload: Dict = Body(...) 
):
    # Payload: { favorites: [ {name: "x", artist: "y"}, ... ] }
    favorites = payload.get("favorites", [])
    
    if not favorites:
        return []
        
    if state.songs_data is None:
         raise HTTPException(status_code=503, detail="Server loading")

    # Recommendation Logic
    # Let's pick 3 random songs from favorites to get a mix
    import random
    seeds = random.sample(favorites, min(3, len(favorites)))
    
    results = []
    seen = set()
    
    # Mark favorites as seen so we don't recommend them back
    for f in favorites:
        seen.add(f['name'].lower())

    for seed in seeds:
         try:
            recs = content_recommendation(
                song_name=seed['name'],
                artist_name=seed['artist'],
                songs_data=state.songs_data,
                transformed_data=state.transformed_data,
                k=5
            )
            for _, row in recs.iterrows():
                if row['name'].lower() not in seen:
                    results.append(row.to_dict())
                    seen.add(row['name'].lower())
         except:
             pass
    
    # Shuffle results
    random.shuffle(results)
    return results[:20]
