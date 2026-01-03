import React, { useState, useEffect } from 'react';
import { User, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

const ArtistCard = ({ artist, index, onClick }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        let mounted = true;
        const fetchImage = async () => {
            await new Promise(resolve => setTimeout(resolve, index * 100));
            if (!mounted) return;

            try {
                const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artist.name)}&entity=album&limit=1`);
                if (res.status === 403 || res.status === 429) return;
                const data = await res.json();
                if (mounted && data.results.length > 0) {
                    setImageUrl(data.results[0].artworkUrl100.replace('100x100', '600x600'));
                }
            } catch (error) { }
        };
        fetchImage();

        const checkLike = async () => {
            if (!user) return;
            const { data } = await supabase
                .from('favorite_artists')
                .select('id')
                .eq('user_id', user.id)
                .eq('artist_name', artist.name)
                .single();
            if (mounted && data) setIsLiked(true);
        };
        checkLike();

        return () => { mounted = false; };
    }, [artist.name, index, user]);

    const toggleLike = async (e) => {
        e.stopPropagation();
        if (!user) {
            alert("Please login to save artists!");
            return;
        }

        if (isLiked) {
            const { error } = await supabase
                .from('favorite_artists')
                .delete()
                .eq('user_id', user.id)
                .eq('artist_name', artist.name);
            if (!error) setIsLiked(false);
        } else {
            const { error } = await supabase
                .from('favorite_artists')
                .insert([{
                    user_id: user.id,
                    artist_name: artist.name
                }]);
            if (!error) setIsLiked(true);
        }
    };

    return (
        <div
            onClick={() => onClick(artist.name)}
            className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group relative"
        >
            <button
                onClick={toggleLike}
                className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                title={isLiked ? "Remove from Favorites" : "Add to Favorites"}
            >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>

            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300 ring-2 ring-transparent group-hover:ring-primary shadow-lg">
                {imageUrl ? (
                    <img src={imageUrl} alt={artist.name} className="w-full h-full object-cover" />
                ) : (
                    <User className="w-10 h-10 text-gray-500" />
                )}
            </div>
            <div className="text-center w-full">
                <h3 className="font-bold text-white mb-1 line-clamp-1 capitalize" title={artist.name}>
                    {artist.name}
                </h3>
                <span className="text-xs text-primary px-2 py-1 bg-primary/10 rounded-full">
                    {artist.song_count} songs
                </span>
            </div>
        </div>
    );
};

export default ArtistCard;
