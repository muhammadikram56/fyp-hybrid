
import os
from pathlib import Path

# Base directory for the backend
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Data directory
DATA_DIR = os.path.join(BASE_DIR, "data")

# File paths
CLEANED_DATA_PATH = os.path.join(DATA_DIR, "cleaned_data.csv")
TRANSFORMED_DATA_PATH = os.path.join(DATA_DIR, "transformed_data.npz")
TRACK_IDS_PATH = os.path.join(DATA_DIR, "track_ids.npy")
FILTERED_DATA_PATH = os.path.join(DATA_DIR, "collab_filtered_data.csv")
INTERACTION_MATRIX_PATH = os.path.join(DATA_DIR, "interaction_matrix.npz")
TRANSFORMED_HYBRID_DATA_PATH = os.path.join(DATA_DIR, "transformed_hybrid_data.npz")
USER_LISTENING_HISTORY_PATH = os.path.join(DATA_DIR, "User Listening History.csv") # If needed
MUSIC_INFO_PATH = os.path.join(DATA_DIR, "Music Info.csv") # If needed
TRANSFORMER_MODEL_PATH = os.path.join(DATA_DIR, "transformer.joblib")

# Check if model exists in data, if not it might be in root (we need to find it)
