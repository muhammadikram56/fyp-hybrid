import React from 'react';
import SongCard from './SongCard';
import { motion } from 'framer-motion';

const RecommendationList = ({ recommendations }) => {
    if (!recommendations || recommendations.length === 0) return null;

    // Separate "Normally Playing" (first item) and "Next Up"
    // The legacy app treated index 0 as "Currently Playing" and 1 as "Next Up".
    // We can display them all in a nice grid, maybe highlighting the first one.

    return (
        <div className="w-full max-w-6xl mx-auto mt-8 px-4">
            <h2 className="text-2xl font-bold text-white mb-6">Recommended for You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recommendations.map((song, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <SongCard song={song} index={index} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RecommendationList;
