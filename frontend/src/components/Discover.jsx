import React, { useState } from 'react';
import { getSongsByMood, getSongsByGenre } from '../api';
import RecommendationList from './RecommendationList';
import { Loader2, Smile, CloudRain, Coffee, PartyPopper, Zap } from 'lucide-react';

const MOODS = [
    { id: 'happy', label: 'Happy', icon: Smile, color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' },
    { id: 'sad', label: 'Melancholic', icon: CloudRain, color: 'bg-blue-500/20 text-blue-500 border-blue-500/50' },
    { id: 'chill', label: 'Chill', icon: Coffee, color: 'bg-green-500/20 text-green-500 border-green-500/50' },
    { id: 'party', label: 'Party', icon: PartyPopper, color: 'bg-purple-500/20 text-purple-500 border-purple-500/50' },
    { id: 'focus', label: 'Focus', icon: Zap, color: 'bg-cyan-500/20 text-cyan-500 border-cyan-500/50' },
];

const GENRES = [
    'pop', 'rock', 'hip hop', 'indie', 'alternative',
    'electronic', 'jazz', 'classical', 'metal', 'folk'
];

const Discover = () => {
    const [activeTab, setActiveTab] = useState('mood'); // 'mood' or 'genre'
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleMoodClick = async (mood) => {
        setLoading(true);
        setSelected(mood);
        setResults([]);
        try {
            const data = await getSongsByMood(mood);
            setResults(data);
        } catch (error) {
            console.error("Failed to fetch mood songs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenreClick = async (genre) => {
        setLoading(true);
        setSelected(genre);
        setResults([]);
        try {
            const data = await getSongsByGenre(genre);
            setResults(data);
        } catch (error) {
            console.error("Failed to fetch genre songs", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Discover New Music</h2>

            {/* Tabs */}
            <div className="flex justify-center gap-4 mb-10">
                <button
                    onClick={() => { setActiveTab('mood'); setResults([]); setSelected(null); }}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'mood' ? 'bg-primary text-black' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                >
                    By Mood
                </button>
                <button
                    onClick={() => { setActiveTab('genre'); setResults([]); setSelected(null); }}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'genre' ? 'bg-primary text-black' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                >
                    By Genre
                </button>
            </div>

            {/* Mood Selection */}
            {activeTab === 'mood' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
                    {MOODS.map((mood) => {
                        const Icon = mood.icon;
                        const isSelected = selected === mood.id;
                        return (
                            <button
                                key={mood.id}
                                onClick={() => handleMoodClick(mood.id)}
                                className={`p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all hover:scale-105 ${isSelected ? mood.color + ' ring-2 ring-primary' : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'}`}
                            >
                                <Icon className="w-8 h-8" />
                                <span className="font-semibold">{mood.label}</span>
                            </button>
                        )
                    })}
                </div>
            )}

            {/* Genre Selection */}
            {activeTab === 'genre' && (
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {GENRES.map((genre) => (
                        <button
                            key={genre}
                            onClick={() => handleGenreClick(genre)}
                            className={`px-4 py-2 rounded-lg border capitalize transition-all ${selected === genre ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-gray-300 hover:border-primary hover:text-primary'}`}
                        >
                            {genre}
                        </button>
                    ))}
                </div>
            )}

            {/* Results */}
            {loading && (
                <div className="flex flex-col items-center text-primary animate-pulse my-20">
                    <Loader2 className="w-10 h-10 animate-spin mb-2" />
                    <span>Curating your playlist...</span>
                </div>
            )}

            {!loading && selected && results.length === 0 && (
                <div className="text-center text-gray-400 my-20">
                    <p className="text-xl">No songs found for this {activeTab}.</p>
                    <p className="text-sm mt-2">Try selecting a different one.</p>
                </div>
            )}

            {!loading && results.length > 0 && (
                <div className="animate-fade-in-up">
                    <RecommendationList recommendations={results} />
                </div>
            )}
        </div>
    );
};

export default Discover;
