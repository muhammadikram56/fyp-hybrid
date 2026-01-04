import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full border-t border-white/10 bg-black/20 backdrop-blur-md py-8 mt-auto">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-white mb-1">
                        <span className="text-primary">Spotify</span> Recommender
                    </h3>
                    <p className="text-gray-400 text-sm">Discover your next obsession.</p>
                </div>

                <div className="flex gap-6 text-sm text-gray-400">
                    <a href="#" className="hover:text-primary transition-colors">Github</a>
                    <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                </div>

                <div className="text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Spotify Recommender. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
