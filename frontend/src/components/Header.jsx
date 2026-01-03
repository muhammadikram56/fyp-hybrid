import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut } from 'lucide-react';
import Auth from './Auth';

const Header = ({ currentView, setView }) => {
    const { user, signOut } = useAuth();
    const [showAuth, setShowAuth] = useState(false);

    return (
        <>
            <header className="p-6 border-b border-white/10 flex items-center justify-between backdrop-blur-md bg-black/20 sticky top-0 z-50">
                <h1 className="text-3xl font-bold tracking-tighter flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
                    <span className="text-primary">Spotify</span> Recommender
                </h1>

                <nav className="flex items-center gap-6">
                    <button
                        onClick={() => setView('home')}
                        className={`font-medium transition-colors ${currentView === 'home' ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
                    >
                        Search
                    </button>
                    <button
                        onClick={() => setView('discover')}
                        className={`font-medium transition-colors ${currentView === 'discover' ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
                    >
                        Discover
                    </button>
                    {user && (
                        <button
                            onClick={() => setView('library')}
                            className={`font-medium transition-colors ${currentView === 'library' ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
                        >
                            Library
                        </button>
                    )}

                    <div className="h-6 w-px bg-white/20 mx-2"></div>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-white">
                                <div className="bg-primary/20 p-1.5 rounded-full">
                                    <User className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-sm font-medium hidden sm:block">{user.email.split('@')[0]}</span>
                            </div>
                            <button
                                onClick={signOut}
                                className="text-gray-400 hover:text-white transition-colors"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAuth(true)}
                            className="bg-white text-black px-5 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors text-sm"
                        >
                            Log In
                        </button>
                    )}
                </nav>
            </header>

            {showAuth && <Auth onClose={() => setShowAuth(false)} />}
        </>
    );
};

export default Header;
