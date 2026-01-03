import React from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

const SongCard = ({ song, index }) => {
    const { handlePlay } = useAudio();
    const spotifySearchUrl = `https://open.spotify.com/search/${encodeURIComponent(song.name + ' ' + song.artist)}`;

    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors group relative">
            <div className="relative aspect-square mb-4 bg-gray-800 rounded-lg overflow-hidden grid place-items-center">
                {/* Fallback image or icon */}
                <span className="text-4xl select-none opacity-50">🎵</span>

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

            {/* External Link Icon */}
            <a
                href={spotifySearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-4 right-4 text-gray-400 hover:text-primary transition-colors p-1"
                title="Open in Spotify"
            >
                <ExternalLink className="w-4 h-4" />
            </a>

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
