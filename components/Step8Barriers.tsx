import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { ArrowLeft } from 'lucide-react';

interface Step8BarriersProps {
    barriers: string[];
    setBarriers: (b: string[] | ((prev: string[]) => string[])) => void;
    onNext: () => void;
    onBack: () => void;
}

const BARRIERS = [
    "Late Night Snacking", "Sugar Cravings", "Stress Eating",
    "Limited Time", "Cooking Difficulty", "Social Events",
    "Slow Metabolism", "Lack of Sleep", "Motivation Drops"
];

export function Step8Barriers({ barriers, setBarriers, onNext, onBack }: Step8BarriersProps) {
    const [showToast, setShowToast] = useState(false);

    const toggleBarrier = (barrier: string) => {
        if (barriers.includes(barrier)) {
            setBarriers(s => s.filter(b => b !== barrier));
        } else {
            setBarriers(s => [...s, barrier]);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }
    };

    return (
        <div className="flex flex-col h-full p-6 relative bg-white text-[#192126]">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-[#192126]" />
                </button>
                <span className="mx-auto text-lg font-bold">Barriers</span>
                <div className="w-10"></div>
            </div>

            <div className="flex gap-1 mb-6">
                {[...Array(7)].map((_, i) => (
                    <div key={i} className="h-1 flex-1 bg-[#BBF246] rounded-full"></div>
                ))}
                <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 overflow-y-auto no-scrollbar"
            >
                <h1 className="text-2xl font-black mb-2 tracking-tight">Any roadblocks?</h1>
                <p className="text-[#5E6468] font-medium mb-8">Do you follow any specific diet or have habits we should combat?</p>

                <div className="flex flex-wrap gap-3">
                    {BARRIERS.map((barrier) => {
                        const isSelected = barriers.includes(barrier);
                        return (
                            <motion.button
                                key={barrier}
                                onClick={() => toggleBarrier(barrier)}
                                whileTap={{ scale: 0.95 }}
                                animate={isSelected ? {
                                    backgroundColor: "#192126",
                                    borderColor: "#192126",
                                    color: "#ffffff"
                                } : {
                                    backgroundColor: "#ffffff",
                                    borderColor: "#e5e7eb",
                                    color: "#192126"
                                }}
                                className={`px-4 py-3 rounded-full border-2 font-bold text-sm transition-all shadow-sm ${isSelected ? 'shadow-lg' : ''}`}
                            >
                                {barrier}
                            </motion.button>
                        );
                    })}
                </div>

            </motion.div>

            {/* Motivational Toast */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-24 left-6 right-6 bg-[#192126] text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 z-20"
                    >
                        <div className="p-2 bg-[#BBF246] rounded-full text-black">
                            <span className="text-xl">🛡️</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Got it.</p>
                            <p className="text-xs text-gray-400">We'll build a strategy for that.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-4 pt-6 border-t border-gray-100">
                <Button onClick={onNext}>
                    Next
                </Button>
            </div>
        </div>
    );
}
