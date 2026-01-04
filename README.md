# Hybrid Music Recommendation System (HRS)

A sophisticated music recommendation engine that combines **Content-Based Filtering** and **Collaborative Filtering** to provide personalized song suggestions. Built with a **FastAPI** backend and a modern **React** frontend.

## 🚀 Tech Stack

*   **Backend:** Python, FastAPI, Scikit-learn, Pandas, Numpy.
*   **Frontend:** React (Vite), Tailwind CSS, Lucide React.
*   **Database & Auth:** Supabase (PostgreSQL).
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
│   ├── .env            # Environment Variables (create this!)
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
    # Windows
    .venv\Scripts\activate
    # Mac/Linux
    source .venv/bin/activate
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
3.  **Environment Configuration**:
    Create a `.env` file in the `frontend` directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

### 3. Database Setup (Supabase)

Run the following SQL in your Supabase SQL Editor to set up the required tables and triggers:

```sql
-- Profiles Table & Auto-Sync Trigger
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  username text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username, full_name, avatar_url)
  values (
    new.id, new.email, new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Favorites Table
create table if not exists public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  song_name text not null,
  artist_name text not null,
  preview_url text,
  spotify_url text,
  album_art text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.favorites enable row level security;
create policy "Users can view their own favorites" on favorites for select using (auth.uid() = user_id);
create policy "Users can insert their own favorites" on favorites for insert with check (auth.uid() = user_id);
create policy "Users can delete their own favorites" on favorites for delete using (auth.uid() = user_id);
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

*   **Hybrid Intelligence**: Weighted average of Content-Based and Collaborative Filtering.
*   **User Accounts**: Secure Login and Signup with Supabase Auth.
*   **Personal Library**: "Heart" songs to save them to your profile.
*   **Smart Search**: Instant search for songs and artists.
*   **Audio Previews**: Play Spotify snippets directly from the UI.
*   **Data Reporting Dashboard**: Visualizes global user stats, genre distribution, and top favorites.
*   **User Profile Settings**: Manage personal info, change passwords, and set notification preferences.
*   **Theme Customization**: Toggle between Light and Dark modes.
*   **Dark Mode UI**: Professional, responsive interface.
