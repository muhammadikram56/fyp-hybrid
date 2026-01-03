import React from 'react';
import { Play, Pause, Music } from 'lucide-react';

const SongCard = ({ song, index }) => {
    return (
        <div className="bg-card hover:bg-hover rounded-xl p-4 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl border border-transparent hover:border-gray-700">
            <div className="relative aspect-square mb-4 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                {/* Placeholder for album art since we might not have it, or use a generic music icon */}
                <Music className="w-12 h-12 text-gray-600 group-hover:text-primary transition-colors" />

                {/* Overlay Play Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-primary rounded-full p-3 shadow-lg transform scale-0 group-hover:scale-100 transition-transform">
                        <Play className="w-6 h-6 text-black fill-black ml-1" />
                    </div>
                </div>
            </div>

            <div className="space-y-1">
                <h3 className="text-white font-bold truncate text-lg" title={song.name}>{song.name}</h3>
                <p className="text-gray-400 text-sm truncate">{song.artist}</p>
            </div>

            {song.spotify_preview_url && (
                <div className="mt-4">
                    <audio controls className="w-full h-8 opacity-70 hover:opacity-100 transition-opacity">
                        <source src={song.spotify_preview_url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}

            <div className="absolute top-2 left-2 bg-black/60 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-white">
                {index + 1}
            </div>
        </div>
    );
};

export default SongCard;
