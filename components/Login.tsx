import React, { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import type { ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';

interface LoginProps {
    onLoginSuccess: (token: string, uid: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [verificationResult, setVerificationResult] = useState<ConfirmationResult | null>(null);

    /*
    useEffect(() => {
        const container = document.getElementById('recaptcha-container');
        if (container && !window.recaptchaVerifier) {
            try {
                window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    'size': 'invisible',
                    'callback': () => { }
                });
            } catch (error) {
                console.error("Recaptcha init error:", error);
            }
        }
        return () => {
            if (window.recaptchaVerifier) {
                try { window.recaptchaVerifier.clear(); } catch (e) { }
                window.recaptchaVerifier = null;
            }
        };
    }, []);
    */

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulate login delay
        setTimeout(() => {
            setLoading(false);
            // Bypass Firebase Auth for now
            // Generate a mock token and UID using the phone number
            const mockToken = "mock-token-" + phoneNumber;
            const mockUid = "user-" + phoneNumber.replace(/\D/g, '');
            onLoginSuccess(mockToken, mockUid);
        }, 1000);
    };

    // Recaptcha and verify logic removed for now
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Verify OTP called unexpectedly");
    };
    /*
    const handleVerifyOtp = async (e: React.FormEvent) => {
        // ... (commenting out verification logic)
    };
    */

    const isPhoneStep = step === 'PHONE';

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-[#192126]">

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-sm"
            >
                {/* Header with Icon */}
                <div className="mb-10 text-center">
                    <div className="w-20 h-20 bg-[#BBF246] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-lime-200">
                        <ShieldCheck className="w-10 h-10 text-[#192126]" />
                    </div>
                    <h1 className="text-3xl font-black text-[#192126] mb-2 tracking-tight">
                        {isPhoneStep ? 'Welcome Back' : 'Verify Code'}
                    </h1>
                    <p className="text-[#5E6468] font-medium">
                        {isPhoneStep ? 'Enter your number to start your journey.' : `We sent a code to ${phoneNumber}`}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {isPhoneStep ? (
                        <motion.form
                            key="phone-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleSendOtp}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#192126] ml-1">Mobile Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#192126] transition-colors" />
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="+91 98765 43210"
                                        className="input-clean pl-12 font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <div id="recaptcha-container"></div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                    <>Login <ArrowRight className="w-5 h-5" /></>
                                )}
                            </button>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="otp-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleVerifyOtp}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-[#192126] block text-center uppercase tracking-widest">Enter Verification Code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="0 0 0 0 0 0"
                                    maxLength={6}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-3xl py-6 text-center text-3xl font-black tracking-[0.5em] text-[#192126] focus:outline-none focus:border-[#BBF246] focus:ring-2 focus:ring-[#BBF246]/20 transition-all font-mono"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                    <>Verify & Login <CheckCircle className="w-5 h-5" /></>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep('PHONE')}
                                className="w-full text-sm font-bold text-[#5E6468] hover:text-[#192126] transition-colors"
                            >
                                Change Phone Number
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-medium text-sm text-center"
                    >
                        {error}
                    </motion.div>
                )}

            </motion.div>
        </div>
    );
};

export default Login;

declare global {
    interface Window {
        recaptchaVerifier: any;
    }
}
