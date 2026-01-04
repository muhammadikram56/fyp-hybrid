import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Music, Heart, BarChart3, PieChart as PieIcon, ListMusic } from 'lucide-react';

const COLORS = ['#1DB954', '#191414', '#535353', '#1ed760', '#2ebd59', '#1aa34a', '#15873d', '#116d31'];
const API_URL = 'http://localhost:8000';

const Dashboard = () => {
    const { user } = useAuth();
    const [genreData, setGenreData] = useState([]);
    const [topArtists, setTopArtists] = useState([]);
    const [totalFavorites, setTotalFavorites] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            try {
                // 1. Fetch User's Favorites
                const { data: favorites, error } = await supabase
                    .from('favorites')
                    .select('song_name, artist_name')
                    .eq('user_id', user.id);

                if (error) throw error;

                setTotalFavorites(favorites.length);

                if (favorites.length > 0) {
                    // 2. Fetch Personal Genre Distribution
                    // Send list of song names to backend to get genre stats
                    const payload = favorites.map(f => ({ name: f.song_name }));
                    const genreRes = await axios.post(`${API_URL}/stats/personal`, payload);
                    setGenreData(genreRes.data);

                    // 3. Calculate Top Artists (Client-side)
                    const artistCounts = {};
                    favorites.forEach(f => {
                        artistCounts[f.artist_name] = (artistCounts[f.artist_name] || 0) + 1;
                    });

                    const sortedArtists = Object.entries(artistCounts)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([name, count]) => ({ name: name.length > 20 ? name.substring(0, 20) + '...' : name, count }));

                    setTopArtists(sortedArtists);
                }

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading) return <div className="p-10 text-center text-primary animate-pulse">Loading dashboard...</div>;

    if (!user) return <div className="p-10 text-center text-gray-400">Please log in to view your dashboard.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-foreground">
                <BarChart3 className="text-primary" /> My Music Analytics
            </h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-card p-6 rounded-xl border border-border flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4 bg-primary/20 rounded-full text-primary">
                        <Heart size={32} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Favorites</p>
                        <p className="text-3xl font-bold text-foreground">{totalFavorites}</p>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4 bg-purple-500/20 rounded-full text-purple-400">
                        <PieIcon size={32} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Top Genre</p>
                        <p className="text-3xl font-bold text-foreground truncate max-w-[150px]" title={genreData.length > 0 ? genreData[0].name : 'N/A'}>
                            {genreData.length > 0 ? genreData[0].name : 'N/A'}
                        </p>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4 bg-blue-500/20 rounded-full text-blue-400">
                        <ListMusic size={32} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Top Artist</p>
                        <p className="text-3xl font-bold text-foreground truncate max-w-[150px]" title={topArtists.length > 0 ? topArtists[0].name : 'N/A'}>
                            {topArtists.length > 0 ? topArtists[0].name : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Genre Distribution */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
                        <Music className="text-primary w-5 h-5" /> My Top Genres
                    </h3>
                    <div className="h-[300px]">
                        {genreData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={genreData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {genreData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                No genre data available. Add songs to favorites!
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Artists */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
                        <ListMusic className="text-primary w-5 h-5" /> My Top Artists
                    </h3>
                    <div className="h-[300px]">
                        {topArtists.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topArtists} layout="vertical" margin={{ left: 20 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fill: 'currentColor', fontSize: 12 }} reversed={false} />
                                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.1)' }} contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                                    <Bar dataKey="count" fill="#1DB954" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                No artist data available. Add songs to favorites!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
