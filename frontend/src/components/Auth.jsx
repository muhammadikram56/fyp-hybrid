import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Auth = ({ onClose }) => {
    const { signIn, signUp, resetPassword } = useAuth();
    const [view, setView] = useState('login'); // 'login', 'signup', 'reset'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        try {
            if (view === 'login') {
                const { error } = await signIn({ email, password });
                if (error) throw error;
                onClose();
            } else if (view === 'signup') {
                const { data, error } = await signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            username: username,
                            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`
                        }
                    }
                });
                if (error) throw error;
                if (data.user) setMessage("Check your email for the confirmation link!");
            } else if (view === 'reset') {
                const { error } = await resetPassword(email);
                if (error) throw error;
                setMessage("Password reset email sent! Check your inbox.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getTitle = () => {
        if (view === 'login') return 'Welcome Back';
        if (view === 'signup') return 'Create Account';
        if (view === 'reset') return 'Reset Password';
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl w-full max-w-md p-8 shadow-2xl relative transition-colors duration-300">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-foreground">✕</button>

                <h2 className="text-2xl font-bold mb-6 text-center text-primary">
                    {getTitle()}
                </h2>

                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 dark:text-red-200 p-3 rounded mb-4 text-sm">{error}</div>}
                {message && <div className="bg-green-500/10 border border-green-500/50 text-green-600 dark:text-green-200 p-3 rounded mb-4 text-sm">{message}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {view === 'signup' && (
                        <>
                            <div>
                                <label className="block text-gray-500 text-sm mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:border-primary focus:outline-none transition-colors"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-500 text-sm mb-1">Username</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:border-primary focus:outline-none transition-colors"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="johndoe123"
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-gray-500 text-sm mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:border-primary focus:outline-none transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {view !== 'reset' && (
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-gray-500 text-sm">Password</label>
                                {view === 'login' && (
                                    <button
                                        type="button"
                                        onClick={() => setView('reset')}
                                        className="text-xs text-primary hover:underline"
                                    >
                                        Forgot Password?
                                    </button>
                                )}
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:border-primary focus:outline-none transition-colors"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 flex justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (
                            view === 'login' ? 'Login' : view === 'signup' ? 'Sign Up' : 'Send Reset Link'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-500 text-sm space-y-2">
                    {view === 'login' && (
                        <p>
                            Don't have an account?{' '}
                            <button onClick={() => setView('signup')} className="text-primary hover:underline">
                                Sign Up
                            </button>
                        </p>
                    )}
                    {view === 'signup' && (
                        <p>
                            Already have an account?{' '}
                            <button onClick={() => setView('login')} className="text-primary hover:underline">
                                Login
                            </button>
                        </p>
                    )}
                    {view === 'reset' && (
                        <p>
                            Remember your password?{' '}
                            <button onClick={() => setView('login')} className="text-primary hover:underline">
                                Back to Login
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;
