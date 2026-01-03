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
    favorite_artists = payload.get("favorite_artists", [])
    
    if not favorites and not favorite_artists:
        return []
        
    if state.songs_data is None:
         raise HTTPException(status_code=503, detail="Server loading")

    # Recommendation Logic
    import random
    seeds = []
    
    # 1. Sample from favorite songs
    if favorites:
        seeds.extend(random.sample(favorites, min(3, len(favorites))))
        
    # 2. Sample from favorite artists
    # For each artist, pick a random song from state.songs_data
    if favorite_artists:
        sampled_artists = random.sample(favorite_artists, min(3, len(favorite_artists)))
        for artist in sampled_artists:
            artist_songs = state.songs_data[state.songs_data['artist'] == artist.lower()]
            if not artist_songs.empty:
                # Pick a random song by this artist
                song = artist_songs.sample(1).iloc[0]
                seeds.append({'name': song['name'], 'artist': song['artist']})
    
    if not seeds:
        return []

    results = []
    seen = set()
    
    # Mark favorites as seen
    for f in favorites:
        seen.add(f['name'].lower())
    # Mark artist songs as seen? Maybe not all of them.

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
