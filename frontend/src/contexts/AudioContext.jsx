import React, { createContext, useState, useContext } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const [currentAudio, setCurrentAudio] = useState(null);

    const handlePlay = (audioElement) => {
        if (currentAudio && currentAudio !== audioElement) {
            currentAudio.pause();
        }
        setCurrentAudio(audioElement);
    };

    return (
        <AudioContext.Provider value={{ handlePlay }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => useContext(AudioContext);
