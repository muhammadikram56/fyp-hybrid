import React from 'react';

const DiversitySlider = ({ value, onChange }) => {
    return (
        <div className="w-full max-w-2xl mx-auto my-6 p-4 bg-card rounded-xl">
            <div className="flex justify-between mb-2">
                <span className="text-gray-400 text-sm">More Personalized</span>
                <span className="text-white font-bold">Diversity: {value}</span>
                <span className="text-gray-400 text-sm">More Diverse</span>
            </div>
            <input
                type="range"
                min="1"
                max="9"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-green-400 transition-all"
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>1</span>
                <span>9</span>
            </div>
        </div>
    );
};

export default DiversitySlider;
