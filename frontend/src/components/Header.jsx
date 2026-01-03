import React from 'react';

const Header = () => {
    return (
        <header className="p-6 border-b border-white/10 flex items-center justify-center backdrop-blur-md bg-black/20 sticky top-0 z-50">
            <h1 className="text-3xl font-bold tracking-tighter flex items-center gap-2">
                <span className="text-primary">Spotify</span> Recommender
            </h1>
        </header>
    );
};

export default Header;
