'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Award, Trophy, Users, ShieldCheck, Play } from 'lucide-react';

interface LandingPageProps {
    onStart: (name: string) => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
    const [showLogin, setShowLogin] = React.useState(false);
    const [mobileNumber, setMobileNumber] = React.useState('');
    const [name, setName] = React.useState('');

    React.useEffect(() => {
        const storedName = localStorage.getItem('fit_challenge_user');
        if (storedName) {
            onStart(storedName);
        }
    }, [onStart]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (mobileNumber.length >= 10 && name.length > 0) {
            localStorage.setItem('fit_challenge_user', name);
            onStart(name);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1116] text-white font-sans overflow-x-hidden">
            {/* Navbar */}
            <nav className="p-6 flex justify-between items-center z-20 relative">
                <div className="text-2xl font-black text-white tracking-tighter">
                    FIT<span className="text-[var(--color-primary)]">CHALLENGE</span>
                </div>
                {!showLogin && (
                    <button
                        onClick={() => setShowLogin(true)}
                        className="text-sm font-bold text-gray-300 hover:text-white transition-colors"
                    >
                        Login
                    </button>
                )}
            </nav>

            {/* Hero Section */}
            <header className="relative pt-12 pb-24 px-6 flex flex-col items-center text-center z-10 min-h-[600px] justify-center">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[var(--color-primary)]/20 blur-[100px] rounded-full -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-lg"
                >
                    {showLogin ? (
                        <div className="bg-[#151B25] p-8 rounded-3xl border border-gray-800 shadow-2xl">
                            <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
                            <p className="text-gray-400 mb-6 text-sm">Enter your details to continue</p>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Enter Your Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-[#0B1116] border border-gray-700 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-primary)] transition-colors text-lg font-bold tracking-wide mb-4"
                                        autoFocus
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Enter Mobile Number"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                        className="w-full bg-[#0B1116] border border-gray-700 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-primary)] transition-colors text-lg font-bold tracking-wide"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-[var(--color-primary)] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
                                >
                                    Continue
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowLogin(false)}
                                    className="text-sm text-gray-500 hover:text-white transition-colors"
                                >
                                    Go Back
                                </button>
                            </form>
                        </div>
                    ) : (
                        <>
                            <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-[var(--color-primary)] mb-6">
                                #1 Fitness Challenge App
                            </span>
                            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[0.9]">
                                1 Push-Up <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-blue-400">
                                    = ₹5
                                </span>
                            </h1>
                            <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto mb-10 leading-relaxed">
                                Turn your sweat into earnings. Join thousands of challengers and get paid for every rep you complete.
                            </p>

                            <button
                                onClick={() => setShowLogin(true)}
                                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[var(--color-primary)] text-white text-lg font-bold rounded-full overflow-hidden transition-transform active:scale-95 shadow-lg shadow-[var(--color-primary)]/30 hover:shadow-[var(--color-primary)]/50"
                            >
                                <span className="relative z-10">Start Earning Now</span>
                                <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </button>
                        </>
                    )}
                </motion.div>
            </header>

            {/* Stats Section */}
            <section className="py-10 border-y border-white/5 bg-white/5 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <p className="text-3xl md:text-4xl font-black text-white mb-1">₹2,00,000+</p>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Paid Out</p>
                    </div>
                    <div>
                        <p className="text-3xl md:text-4xl font-black text-white mb-1">30,000+</p>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Challengers</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <p className="text-3xl md:text-4xl font-black text-white mb-1">4.9/5</p>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">User Rating</p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                        <p className="text-gray-400">Simple steps to start earning.</p>
                    </div>

                    <div className="space-y-6 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-800 -z-10" />

                        {/* Step 1 */}
                        <div className="flex gap-6 items-start">
                            <div className="w-16 h-16 rounded-2xl bg-[#1A6BFF]/10 border border-[#1A6BFF]/20 flex items-center justify-center shrink-0 text-[#1A6BFF]">
                                <Play className="w-6 h-6 fill-current" />
                            </div>
                            <div className="pt-2">
                                <h3 className="text-xl font-bold mb-2">Record Attempt</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Use your phone's camera to record yourself doing push-ups. We support front and back cameras.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-6 items-start">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 text-purple-500">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div className="pt-2">
                                <h3 className="text-xl font-bold mb-2">Instant Verification</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Our system analyzes your form and counts your reps automatically in seconds.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-6 items-start">
                            <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 text-green-500">
                                <Award className="w-6 h-6" />
                            </div>
                            <div className="pt-2">
                                <h3 className="text-xl font-bold mb-2">Get Paid</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Earn ₹5 for every valid rep directly into your wallet. No limits.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-6 text-center">
                <div className="max-w-sm mx-auto bg-gradient-to-b from-[var(--color-primary)] to-blue-700 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

                    <h2 className="text-3xl font-black mb-6 relative z-10">Ready to Challenge Yourself?</h2>

                    <button
                        onClick={() => {
                            setShowLogin(true);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full bg-white text-[var(--color-primary)] font-bold py-4 rounded-xl shadow-lg relative z-10 hover:bg-gray-50 transition-colors"
                    >
                        Start Your Challenge
                    </button>
                    <p className="text-white/60 text-xs mt-4 relative z-10">
                        Join 30,000+ others starting today
                    </p>
                </div>
            </section>
        </div>
    );
}
