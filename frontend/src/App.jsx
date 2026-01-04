import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import DiversitySlider from './components/DiversitySlider';
import RecommendationList from './components/RecommendationList';
import Header from './components/Header';
import Hero from './components/Hero';
import Discover from './components/Discover';
import ArtistList from './components/ArtistList';
import Library from './components/Library';
import Dashboard from './components/Dashboard';
import ProfileSettings from './components/ProfileSettings';
import Footer from './components/Footer';
import { getContentRecommendations, getHybridRecommendations } from './api';
import { Loader2, AlertCircle } from 'lucide-react';

function App() {
  const [view, setView] = useState('home'); // 'home', 'discover', 'library', 'artists', 'settings'
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [diversity, setDiversity] = useState(5);
  const [searchParams, setSearchParams] = useState(null); // { song, artist }

  const handleSearch = async (song, artist) => {
    setLoading(true);
    setError(null);
    setSearchParams({ song, artist });
    setRecommendations([]);

    try {
      let data;
      // Logic: Try Hybrid if diversity is involved, or adhere to legacy flow?
      // Legacy flow: "If in filtered_data -> Hybrid, else Content".
      // Our API endpoint /hybrid checks filtering availability.
      // Let's try Hybrid first, if it fails with 400 (not found/content-only), we fallback to Content.
      // But /hybrid endpoint might error.

      // Actually, backend logic for /hybrid throws 400 if song not in filtered_data.
      // So we can catch that and fallback.

      try {
        data = await getHybridRecommendations(song, artist, 10, diversity);
      } catch (err) {
        if (err.response && err.response.status === 400) {
          // Fallback to content based
          console.log("Hybrid not available, falling back to content-based");
          data = await getContentRecommendations(song, artist, 10);
        } else {
          throw err;
        }
      }

      setRecommendations(data);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to fetch recommendations. Song might not be in database.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when diversity changes if we have a search
  const handleDiversityChange = async (newDiversity) => {
    setDiversity(newDiversity);
    if (searchParams) {
      // Debounce or just trigger?
      // For simplicity, trigger search again with new diversity
      // But only if we are in hybrid mode (which we implicitly are if we show slider)
      // We can just re-run handleSearch logic but optimized.
      await handleSearch(searchParams.song, searchParams.artist);
    }
  };

  return (
    <div className="bg-background min-h-screen text-foreground font-sans selection:bg-primary selection:text-black pb-20 transition-colors duration-300">
      <Header currentView={view} setView={setView} />

      {view === 'library' ? (
        <Library />
      ) : view === 'discover' ? (
        <Discover />
      ) : view === 'artists' ? (
        <ArtistList />
      ) : view === 'dashboard' ? (
        <Dashboard />
      ) : view === 'settings' ? (
        <ProfileSettings />
      ) : (
        <main className="container mx-auto px-4 pt-10 flex flex-col items-center">
          <Hero />

          <SearchBar onSearch={handleSearch} />

          <div className="mt-8 w-full max-w-2xl">
            <DiversitySlider value={diversity} onChange={handleDiversityChange} />
          </div>

          {loading && (
            <div className="mt-12 flex flex-col items-center text-primary animate-pulse">
              <Loader2 className="w-10 h-10 animate-spin mb-2" />
              <span>Digging through the crates...</span>
            </div>
          )}

          {error && (
            <div className="mt-12 p-4 bg-red-900/20 border border-red-500/50 text-red-100 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && recommendations.length > 0 && (
            <RecommendationList recommendations={recommendations} />
          )}

        </main>
      )}
      <Footer />
    </div>
  );
}

export default App;
