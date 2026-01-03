import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
    const [song, setSong] = useState('');
    const [artist, setArtist] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (song && artist) {
            onSearch(song, artist);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-card rounded-lg p-2 space-x-2">
                    <Search className="text-gray-400 ml-2" />
                    <input
                        type="text"
                        placeholder="Song Name"
                        className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-1/2 p-2 focus:ring-0"
                        value={song}
                        onChange={(e) => setSong(e.target.value)}
                    />
                    <div className="w-px h-8 bg-gray-700"></div>
                    <input
                        type="text"
                        placeholder="Artist Name"
                        className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-1/2 p-2 focus:ring-0"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-primary hover:bg-green-500 text-black font-bold py-2 px-6 rounded-md transition-all transform hover:scale-105"
                    >
                        Search
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SearchBar;
