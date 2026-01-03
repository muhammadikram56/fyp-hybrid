from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from backend.app.core.state import state
from backend.app.services.content_based_filtering import content_recommendation
from backend.app.services.hybrid_recommendations import HybridRecommenderSystem

router = APIRouter(prefix="/recommend", tags=["recommendations"])

class RecommendationResponse(BaseModel):
    name: str
    artist: str
    spotify_preview_url: Optional[str] = None
    # Add score if available? content_recommendation returns df with these cols.

@router.get("/content", response_model=List[RecommendationResponse])
async def get_content_recommendations(
    song_name: str,
    artist_name: str,
    k: int = 10
):
    if state.songs_data is None:
        raise HTTPException(status_code=503, detail="Server is still loading data")

    try:
        # Check if song exists (logic from apps.py)
        if not ((state.songs_data["name"] == song_name.lower()) & (state.songs_data["artist"] == artist_name.lower())).any():
             raise HTTPException(status_code=404, detail="Song not found")

        recommendations = content_recommendation(
            song_name=song_name,
            artist_name=artist_name,
            songs_data=state.songs_data,
            transformed_data=state.transformed_data,
            k=k
        )
        
        # Convert DataFrame to list of dicts
        return recommendations.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/hybrid", response_model=List[RecommendationResponse])
async def get_hybrid_recommendations(
    song_name: str,
    artist_name: str,
    k: int = 10,
    diversity: int = Query(5, ge=1, le=9)
):
    if state.filtered_data is None:
        raise HTTPException(status_code=503, detail="Server is still loading data")

    try:
        # Hybrid logic from apps.py
        # Check if compatible for hybrid
        if not ((state.filtered_data["name"] == song_name.lower()) & (state.filtered_data["artist"] == artist_name.lower())).any():
             # Fallback to content based or 404? apps.py switches logic based on this.
             # API client should probably check availability or we transparently fallback.
             # apps.py: if not in filtered_data, it falls back to content-based UI.
             # Here, let's explicitly return 404 or a specific error code "USE_CONTENT_BASED"
             # Or just handle it. The user explicitly called /hybrid. 
             # Let's try to return content based if hybrid data missing for this song?
             # But the endpoint implies "Hybrid".
             raise HTTPException(status_code=400, detail="Song not available for hybrid filtering (not in collaborative dataset). Use content-based.")
        
        content_based_weight = 1 - (diversity / 10)
        recommender = HybridRecommenderSystem(
            number_of_recommendations=k,
            weight_content_based=content_based_weight
        )
        
        recommendations = recommender.give_recommendations(
            song_name=song_name,
            artist_name=artist_name,
            songs_data=state.filtered_data,
            transformed_matrix=state.transformed_hybrid_data,
            track_ids=state.track_ids,
            interaction_matrix=state.interaction_matrix
        )
        
        return recommendations.to_dict(orient="records")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
