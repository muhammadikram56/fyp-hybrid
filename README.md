# Hybrid Music Recommendation System (HRS)

A sophisticated music recommendation engine that combines **Content-Based Filtering** and **Collaborative Filtering** to provide personalized song suggestions. Built with a **FastAPI** backend and a modern **React** frontend.

## 🚀 Tech Stack

*   **Backend:** Python, FastAPI, Scikit-learn, Pandas, Numpy.
*   **Frontend:** React (Vite), Tailwind CSS, Lucide React.
*   **Algorithm:** Hybrid (Weighted average of Content-Based and Collaborative Filtering).

## 📂 Project Structure

```
HRS/
├── backend/            # FastAPI Application
│   ├── app/
│   │   ├── main.py     # API Entry point
│   │   ├── routers/    # API Routes
│   │   └── services/   # Recommendation Logic
│   └── data/           # Dataset files (CSVs and NPZs)
├── frontend/           # React Application
│   ├── src/
│   └── public/
└── requirements.txt    # Python Dependencies
```

## 🛠️ Installation & Setup

### 1. Backend Setup

1.  Navigate to the root directory.
2.  Create a virtual environment (optional but recommended):
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # On Windows: .venv\Scripts\activate
    ```
3.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install Node.js dependencies:
    ```bash
    npm install
    ```

## 🏃‍♂️ Running the Application

You need to run the Backend and Frontend in separate terminals.

### Terminal 1: Backend (API)

Running from the **root** directory:

```bash
uvicorn backend.app.main:app --reload
```
*The API will be available at `http://localhost:8000`*

### Terminal 2: Frontend (UI)

Running from the **frontend** directory:

```bash
cd frontend
npm run dev
```
*The App will be available at `http://localhost:5173`*

## ✨ Features

*   **Search**: Find songs by name and artist.
*   **Hybrid Intelligence**: Slider to adjust between personalized (Collaborative) and similar (Content-Based) recommendations.
*   **Audio Previews**: Play Spotify snippets directly from the UI.
*   **Dark Mode**: Professional, sleek interface.
