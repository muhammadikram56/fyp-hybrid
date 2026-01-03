import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import RecommendationList from './RecommendationList';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

const Library = () => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recs, setRecs] = useState([]);
    const [recLoading, setRecLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        fetchFavorites();
    }, [user]);

    const fetchFavorites = async () => {
        try {
            const { data, error } = await supabase
                .from('favorites')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            // Map to SongCard format
            const mapped = data.map(f => ({
                id: f.id,
                name: f.song_name,
                artist: f.artist_name,
                spotify_preview_url: f.preview_url,
                spotify_url: f.spotify_url
            }));
            setFavorites(mapped);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPersonalRecommendations = async () => {
        if (favorites.length === 0) return;
        setRecLoading(true);
        // We'll implemented this backend endpoint next
        // For now, we just fetch random ones or we need to send the favorites list to backend
        try {
            const response = await axios.post('http://localhost:8000/recommend/favorites', {
                favorites: favorites.map(f => ({ name: f.name, artist: f.artist }))
            });
            setRecs(response.data);
        } catch (error) {
            console.error("Failed to get personal recs", error);
        } finally {
            setRecLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-20 text-gray-500">Loading library...</div>;

    if (favorites.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Your Library is Empty</h2>
                <p className="text-gray-400 mb-8">Go explore and "Heart" some songs to save them here!</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-white mb-8">My Library</h2>

            <div className="mb-12">
                <RecommendationList recommendations={favorites} />
            </div>

            <div className="border-t border-white/10 pt-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-primary">Recommended For You</h2>
                    <button
                        onClick={getPersonalRecommendations}
                        disabled={recLoading}
                        className="bg-primary hover:bg-green-400 text-black px-6 py-2 rounded-full font-bold transition-colors disabled:opacity-50"
                    >
                        {recLoading ? 'Analyzing...' : 'Refresh Suggestions'}
                    </button>
                </div>

                {recLoading && (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}

                {!recLoading && recs.length > 0 && (
                    <RecommendationList recommendations={recs} />
                )}
            </div>
        </div>
    );
};

export default Library;
