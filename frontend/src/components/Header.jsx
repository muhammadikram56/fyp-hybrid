import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { User, LogOut, Sun, Moon, Settings } from 'lucide-react';
import Auth from './Auth';

const Header = ({ currentView, setView }) => {
    const { user, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [showAuth, setShowAuth] = useState(false);

    return (
        <>
            <header className="p-6 border-b border-white/10 dark:border-white/10 border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tighter flex items-center gap-2 cursor-pointer text-foreground" onClick={() => setView('home')}>
                        <span className="text-primary">Spotify</span> Recommender
                    </h1>

                    <nav className="flex items-center gap-6">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-card-hover transition-colors text-foreground"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <button
                            onClick={() => setView('home')}
                            className={`font-medium transition-colors ${currentView === 'home' ? 'text-primary' : 'text-gray-400 hover:text-foreground'}`}
                        >
                            Search
                        </button>
                        <button
                            onClick={() => setView('artists')}
                            className={`font-medium transition-colors ${currentView === 'artists' ? 'text-primary' : 'text-gray-400 hover:text-foreground'}`}
                        >
                            Artists
                        </button>
                        <button
                            onClick={() => setView('discover')}
                            className={`font-medium transition-colors ${currentView === 'discover' ? 'text-primary' : 'text-gray-400 hover:text-foreground'}`}
                        >
                            Discover
                        </button>
                        <button
                            onClick={() => setView('dashboard')}
                            className={`font-medium transition-colors ${currentView === 'dashboard' ? 'text-primary' : 'text-gray-400 hover:text-foreground'}`}
                        >
                            Dashboard
                        </button>
                        {user && (
                            <button
                                onClick={() => setView('library')}
                                className={`font-medium transition-colors ${currentView === 'library' ? 'text-primary' : 'text-gray-400 hover:text-foreground'}`}
                            >
                                Library
                            </button>
                        )}

                        <div className="h-6 w-px bg-border mx-2"></div>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-foreground cursor-pointer" onClick={() => setView('settings')}>
                                    <div className="bg-primary/20 p-1.5 rounded-full">
                                        <User className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium hidden sm:block">{user.email.split('@')[0]}</span>
                                </div>
                                <button
                                    onClick={() => setView('settings')}
                                    className="text-gray-400 hover:text-foreground transition-colors"
                                    title="Settings"
                                >
                                    <Settings className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={signOut}
                                    className="text-gray-400 hover:text-foreground transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAuth(true)}
                                className="bg-foreground text-background px-5 py-2 rounded-full font-bold hover:opacity-90 transition-colors text-sm"
                            >
                                Log In
                            </button>
                        )}
                    </nav>
                </div>
            </header>
            {showAuth && <Auth onClose={() => setShowAuth(false)} />}
        </>
    );
};

export default Header;
