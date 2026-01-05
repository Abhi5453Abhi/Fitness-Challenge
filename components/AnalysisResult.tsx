'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';

interface AnalysisResultProps {
    isOpen: boolean;
    reps: number | null;
    status?: 'uploading' | 'analyzing' | 'manual_review' | 'complete'; // Added status
    onClose: () => void;
    onComplete: () => void;
}

export function AnalysisResult({ isOpen, reps, status = 'analyzing', onClose, onComplete }: AnalysisResultProps) {
    // If status is not provided, infer from reps (backward compatibility)
    const currentStep = status === 'manual_review' ? 'manual_review' : (reps !== null ? 'result' : 'analyzing');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[var(--color-card)] w-full max-w-sm rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl border border-gray-800"
            >
                {currentStep === 'analyzing' || status === 'uploading' ? (
                    <>
                        <div className="w-20 h-20 relative flex items-center justify-center mb-6">
                            <div className="absolute inset-0 border-4 border-[var(--color-primary)]/30 rounded-full" />
                            <div className="absolute inset-0 border-4 border-[var(--color-primary)] rounded-full border-t-transparent animate-spin" />
                            <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">
                            {status === 'uploading' ? 'Uploading Video...' : 'Submitting for Review...'}
                        </h3>
                        <p className="text-[#8B95A5] text-sm">Sending your workout to the coach for manual verification.</p>
                    </>
                ) : currentStep === 'manual_review' ? (
                    <>
                        <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 text-yellow-500">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--color-text-main)] mb-2">Submitted!</h3>
                        <div className="my-6">
                            <p className="text-[#8B95A5] text-sm mb-1">Your video is queued for manual view.</p>
                            <p className="text-lg font-bold text-[var(--color-primary)]">Check back soon!</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full bg-[var(--color-primary)] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
                        >
                            Done
                        </button>
                    </>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-500">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--color-text-main)] mb-2">Great Job!</h3>
                        <div className="my-6">
                            <p className="text-[#8B95A5] text-sm uppercase tracking-wider mb-1">Total Reps</p>
                            <p className="text-6xl font-black text-[var(--color-primary)]">{reps}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full bg-[var(--color-primary)] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
                        >
                            Done
                        </button>
                    </>
                )}
            </motion.div>
        </div>
    );
}
