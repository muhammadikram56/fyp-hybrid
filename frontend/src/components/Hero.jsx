import React from 'react';

const Hero = () => {
    return (
        <div className="text-center mb-10 space-y-2 animate-fade-in-down">
            <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                Discover Your Next Favorite Song
            </h2>
            <p className="text-gray-400">Enter a song you love and we'll handle the rest.</p>
        </div>
    );
};

export default Hero;
