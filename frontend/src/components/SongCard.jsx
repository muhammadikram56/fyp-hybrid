import React, { useState, useEffect } from 'react';
import { Play, ExternalLink, Heart } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

const SongCard = ({ song, index }) => {
    const { handlePlay } = useAudio();
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);

    const spotifySearchUrl = `https://open.spotify.com/search/${encodeURIComponent(song.name + ' ' + song.artist)}`;

    useEffect(() => {
        let mounted = true;

        const fetchMetadata = async () => {
            // 1. Check Cache
            const cacheKey = `hrs_album_${song.artist}_${song.name}`.replace(/[^a-z0-9_]/gi, '_').toLowerCase();
            const cachedUrl = localStorage.getItem(cacheKey);

            if (cachedUrl) {
                setImageUrl(cachedUrl);
                return;
            }

            // Stagger requests to avoid 429
            await new Promise(resolve => setTimeout(resolve, index * 200));

            if (!mounted) return;

            try {
                // 2. Try iTunes
                const query = `${song.name} ${song.artist}`;
                const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=1`);

                if (res.ok) {
                    const data = await res.json();
                    if (mounted && data.results.length > 0) {
                        const url = data.results[0].artworkUrl100.replace('100x100', '600x600');
                        setImageUrl(url);
                        localStorage.setItem(cacheKey, url);
                        return;
                    }
                }

                // 3. Fallback to Deezer (via CORS proxy if needed, or direct)
                // Note: Direct Deezer calls from browser may fail CROS. We rely mostly on iTunes + Cache.
                // Using a 'no-cors' mode opaque request won't verify the image, so we skip complex proxy setup for now
                // and just try a second attempt or leaving it blank if iTunes fails is better than broken images.

                // For now, if iTunes fails, we stop. The caching will prevent repeated failures.

            } catch (e) {
                console.warn("Image fetch failed", e);
            }
        };
        fetchMetadata();

        if (!user) return;
        // Check if liked
        const checkLike = async () => {
            const { data } = await supabase
                .from('favorites')
                .select('id')
                .eq('user_id', user.id)
                .eq('song_name', song.name)
                .eq('artist_name', song.artist)
                .single();
            if (mounted && data) setIsLiked(true);
        };
        checkLike();

        return () => { mounted = false; };
    }, [user, song.name, song.artist, index]);

    const toggleLike = async (e) => {
        e.stopPropagation();
        if (!user) {
            alert("Please login to save songs!");
            return;
        }

        if (isLiked) {
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('song_name', song.name)
                .eq('artist_name', song.artist);
            if (!error) setIsLiked(false);
        } else {
            const { error } = await supabase
                .from('favorites')
                .insert([{
                    user_id: user.id,
                    song_name: song.name,
                    artist_name: song.artist,
                    preview_url: song.spotify_preview_url,
                    spotify_url: spotifySearchUrl
                }]);
            if (!error) setIsLiked(true);
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors group relative">
            <div className="relative aspect-square mb-4 bg-gray-800 rounded-lg overflow-hidden grid place-items-center">
                {imageUrl ? (
                    <img src={imageUrl} alt={song.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                ) : (
                    <span className="text-4xl select-none opacity-50">🎵</span>
                )}

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="fill-white text-white w-12 h-12" />
                </div>
            </div>

            <div className="mb-2 pr-6">
                <h3 className="font-bold text-lg truncate" title={song.name}>
                    {song.name}
                </h3>
                <p className="text-gray-400 text-sm truncate">{song.artist}</p>
            </div>

            <div className="absolute top-4 right-4 flex gap-2">
                {/* Like Button */}
                <button
                    onClick={toggleLike}
                    className={`p-1 transition-transform hover:scale-110 ${isLiked ? 'text-green-500 fill-green-500' : 'text-gray-400 hover:text-white'}`}
                    title={isLiked ? "Remove from Library" : "Add to Library"}
                >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>

                {/* External Link Icon */}
                <a
                    href={spotifySearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary transition-colors p-1"
                    title="Open in Spotify"
                >
                    <ExternalLink className="w-4 h-4" />
                </a>
            </div>

            {song.spotify_preview_url ? (
                <audio
                    controls
                    className="w-full h-8 mt-2 opacity-60 hover:opacity-100 transition-opacity"
                    src={song.spotify_preview_url}
                    onPlay={(e) => handlePlay(e.currentTarget)}
                >
                    Your browser does not support the audio element.
                </audio>
            ) : (
                <p className="text-xs text-red-400 mt-2">No preview available</p>
            )}
        </div>
    );
};

export default SongCard;
