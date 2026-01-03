import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Auth = ({ onClose }) => {
    const { signIn, signUp } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null); // For signup success

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        try {
            const { data, error } = isLogin
                ? await signIn({ email, password })
                : await signUp({
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

            if (!isLogin && data.user) {
                setMessage("Check your email for the confirmation link!");
            } else if (isLogin) {
                onClose(); // Close modal on success
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-darker border border-white/10 rounded-2xl w-full max-w-md p-8 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>

                <h2 className="text-2xl font-bold mb-6 text-center text-primary">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>

                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded mb-4 text-sm">{error}</div>}
                {message && <div className="bg-green-500/10 border border-green-500/50 text-green-200 p-3 rounded mb-4 text-sm">{message}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required={!isLogin}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Username</label>
                                <input
                                    type="text"
                                    required={!isLogin}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="johndoe123"
                                />
                            </div>
                        </>
                    )}
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 flex justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-400 text-sm">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-primary ml-1 hover:underline"
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;
