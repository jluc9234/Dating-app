import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getRandomGradient } from '../constants';

const LoginScreen: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('demo@user.com');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const { login, signup } = useAuth();

    const [logoGradient] = useState(() => getRandomGradient());
    const [buttonGradient, setButtonGradient] = useState(() => getRandomGradient());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        setButtonGradient(getRandomGradient());

        try {
            if (isLoginView) {
                await login(email, password);
                // Login success is handled by AuthContext (navigates away)
            } else {
                await signup(name, email, password);
                setShowEmailConfirmation(true);
                setIsLoading(false);
                setCountdown(3);
                // Navigate back to login after 3 seconds
                setTimeout(() => {
                    setIsLoginView(true);
                    setShowEmailConfirmation(false);
                    setName('');
                    setEmail('');
                    setPassword('');
                }, 3000);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setIsLoading(false);
        }
    };
    
    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setError('');
        // Reset fields for demo purposes
        if (isLoginView) { // if we are switching TO signup
            setEmail('');
            setPassword('');
        } else { // if we are switching TO login
            setEmail('demo@user.com');
            setPassword('password');
        }
    };

    // Countdown timer for email confirmation
    useEffect(() => {
        if (showEmailConfirmation && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [showEmailConfirmation, countdown]);

    return (
        <div className="bg-gradient-to-br from-slate-900 via-black to-purple-900 min-h-screen flex flex-col justify-center items-center p-4 text-white">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tighter">
                        <span className={`bg-clip-text text-transparent bg-gradient-to-r ${logoGradient}`}>
                            Create-A-Date
                        </span>
                    </h1>
                    <p className="text-slate-400 mt-2">Beyond the swipe.</p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl">
                    {showEmailConfirmation ? (
                        <div className="text-center space-y-4">
                            <div className="text-6xl mb-4">📧</div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white">Check Your Email</h2>
                            <p className="text-slate-300">We've sent a confirmation link to <strong>{email}</strong>.</p>
                            <p className="text-slate-400 text-sm">Click the link to verify your account, then return here to log in.</p>
                            <div className="mt-4 text-xs text-slate-500">
                                Redirecting to login in <span>{countdown}</span> seconds...
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {!isLoginView && (
                                 <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Your Name"
                                        required
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>
                            )}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="user@example.com"
                                    required
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>

                            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                            {isLoginView && <p className="text-xs text-slate-500 text-center">Demo login: demo@user.com / password</p>}

                            {!isLoginView && (
                                <div className="text-xs text-slate-400 text-center p-3 bg-slate-700/30 rounded-lg">
                                    <p className="mb-1">📧 <strong>Email Verification Required</strong></p>
                                    <p>After signing up, check your email and click the verification link before logging in.</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-gradient-to-r ${buttonGradient} text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-orange-500/50 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50`}
                            >
                                {isLoading ? '...' : (isLoginView ? 'Log In' : 'Sign Up')}
                            </button>
                        </form>
                    )}
                </div>
                
                 {!showEmailConfirmation && (
                    <div className="text-center mt-6">
                        <button onClick={toggleView} className="text-slate-400 hover:text-white text-sm">
                            {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                        </button>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default LoginScreen;