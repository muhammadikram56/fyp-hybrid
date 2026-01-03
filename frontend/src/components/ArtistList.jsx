import React, { useEffect, useState } from 'react';
import { getArtists, getArtistSongs } from '../api';
import { Loader2, Music, User } from 'lucide-react';
import RecommendationList from './RecommendationList';
import ArtistCard from './ArtistCard';

const ArtistList = () => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [artistSongs, setArtistSongs] = useState([]);
    const [songsLoading, setSongsLoading] = useState(false);

    useEffect(() => {
        loadArtists();
    }, []);

    const loadArtists = async () => {
        setLoading(true);
        try {
            const data = await getArtists(0, 100); // Fetch top 100 by song count
            setArtists(data);
        } catch (error) {
            console.error("Failed to load artists", error);
        } finally {
            setLoading(false);
        }
    };

    const handleArtistClick = async (artistName) => {
        setSelectedArtist(artistName);
        setSongsLoading(true);
        try {
            const data = await getArtistSongs(artistName);
            setArtistSongs(data);
        } catch (error) {
            console.error("Failed to load artist songs", error);
        } finally {
            setSongsLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (selectedArtist) {
        return (
            <div className="container mx-auto px-4 py-8">
                <button
                    onClick={() => setSelectedArtist(null)}
                    className="mb-6 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
                >
                    ← Back to Artists
                </button>

                <h2 className="text-4xl font-bold text-white mb-2 capitalize">{selectedArtist}</h2>
                <p className="text-gray-400 mb-8 flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    {artistSongs.length} Songs Available
                </p>

                {songsLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <RecommendationList recommendations={artistSongs} />
                )}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-white mb-8">Browse Artists</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {artists.map((artist, index) => (
                    <ArtistCard
                        key={artist.name}
                        artist={artist}
                        index={index}
                        onClick={handleArtistClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default ArtistList;
