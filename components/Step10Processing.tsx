import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Step10ProcessingProps {
    userData: {
        name: string;
        selectedGoals: string[];
        gender: string;
        age: number;
        height: number;
        weight: number;
        targetWeight: number;
        weeklyRate: string;
        habits: string[];
        activityLevel: string;
        barriers: string[];
        pledgeDays: number;
        userId: string;
    };
    setPlanData: (data: any) => void;
    onNext: () => void;
}

const QUOTES = [
    "Rome wasn't built in a day, but they were laying bricks every hour.",
    "The body achieves what the mind believes.",
    "Your future self is watching you right now through memories.",
    "Don't stop when you're tired. Stop when you're done.",
    "Discipline is doing what needs to be done, even if you don't want to do it."
];

export function Step10Processing({ userData, setPlanData, onNext }: Step10ProcessingProps) {
    const [quoteIndex, setQuoteIndex] = useState(0);

    // Rotate quotes
    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex(prev => (prev + 1) % QUOTES.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const hasFetched = useRef(false);

    // Fetch Plan
    useEffect(() => {
        const fetchPlan = async () => {
            if (hasFetched.current) return;
            hasFetched.current = true;

            try {
                // Using relative path - works both locally and on Vercel
                const response = await fetch('/api/generate-plan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });

                if (!response.ok) throw new Error("Failed to fetch");

                const data = await response.json();
                setPlanData(data);

                setTimeout(() => {
                    onNext();
                }, 2000);

            } catch (error) {
                console.error("Error generating plan:", error);
            }
        };

        fetchPlan();
    }, []);

    return (
        <div className="flex flex-col h-full bg-transparent relative overflow-hidden items-center justify-center p-6 text-[#192126]">

            <motion.div className="z-10 text-center max-w-sm">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-gray-100 border-t-[#BBF246] rounded-full mx-auto mb-12"
                />

                <div className="h-8 overflow-hidden relative mb-8">
                    <motion.div
                        animate={{ y: -64 }} // Scroll up through 3 items
                        transition={{ duration: 4, times: [0, 0.3, 0.6, 1], repeat: Infinity }}
                        className="flex flex-col items-center gap-2"
                    >
                        <span className="text-xl font-bold text-[#192126]">Analyzing your goals...</span>
                        <span className="text-xl font-bold text-[#192126]">Your meal plan will be ready in 5-10 minutes...</span>
                        <span className="text-xl font-bold text-[#192126]">Optimizing nutrition...</span>
                    </motion.div>
                </div>

                {/* Rotating Quote */}
                <motion.div
                    key={quoteIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="h-24"
                >
                    <p className="text-[#5E6468] font-medium italic">"{QUOTES[quoteIndex]}"</p>
                </motion.div>
            </motion.div>

        </div>
    );
}
