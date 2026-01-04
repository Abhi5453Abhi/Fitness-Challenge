import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Button } from './Button';
import { ArrowLeft, Calendar } from 'lucide-react';

interface Step6TargetProps {
    targetWeight: number;
    setTargetWeight: (w: number | ((prev: number) => number)) => void;
    currentWeight: number;
    onNext: () => void;
    onBack: () => void;
}

const MIN_WEIGHT = 40;
const MAX_WEIGHT = 150;
const PIXELS_PER_KG = 50; // Distance between numbers
const TICKS = Array.from({ length: (MAX_WEIGHT - MIN_WEIGHT) + 1 }, (_, i) => MIN_WEIGHT + i);

export function Step6Target({ targetWeight, setTargetWeight, currentWeight, onNext, onBack }: Step6TargetProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const smoothX = useSpring(x, { stiffness: 400, damping: 40 });
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        const index = targetWeight - MIN_WEIGHT;
        const targetX = -index * PIXELS_PER_KG;
        x.set(targetX);
    }, [targetWeight, x]);

    const handleDrag = (_: any, info: any) => {
        const move = info.delta.x;
        const currentX = x.get();
        x.set(currentX + move);

        const rawIndex = -x.get() / PIXELS_PER_KG;
        const rawWeight = rawIndex + MIN_WEIGHT;

        const clamped = Math.round(Math.min(MAX_WEIGHT, Math.max(MIN_WEIGHT, rawWeight)));

        if (clamped !== targetWeight) {
            setTargetWeight(clamped);
        }
    };

    const calculateDate = () => {
        if (!currentWeight) return new Date();
        const diff = Math.abs(currentWeight - targetWeight);
        if (diff === 0) return new Date();
        const ratePerMonth = 2; // kg
        const monthsNeeded = diff / ratePerMonth;
        const date = new Date();
        date.setMonth(date.getMonth() + Math.ceil(monthsNeeded));
        return date;
    };

    const goalDate = calculateDate();
    const monthName = goalDate.toLocaleString('default', { month: 'long' });

    return (
        <div className="flex flex-col h-full p-6 select-none overflow-hidden bg-white text-[#192126]">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-[#192126]" />
                </button>
                <span className="mx-auto text-lg font-bold">Target</span>
                <div className="w-10"></div>
            </div>

            <div className="flex gap-1 mb-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-1 flex-1 bg-[#BBF246] rounded-full"></div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center relative"
            >
                <h1 className="text-2xl font-black mb-2 text-center text-[#192126]">Set your goal.</h1>
                <p className="text-[#5E6468] mb-12 text-center font-medium">Slide or type to adjust.</p>

                {/* Manual Input Display */}
                <div className="text-center mb-10 flex items-end justify-center">
                    <input
                        type="number"
                        value={targetWeight}
                        onChange={(e) => setTargetWeight(Number(e.target.value))}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className={`text-8xl font-black tracking-tighter bg-transparent text-center w-48 outline-none p-0 m-0 ${isFocused ? 'text-[#BBF246]' : 'text-[#192126]'} transition-colors`}
                    />
                    <span className="text-xl text-gray-400 font-bold ml-2 mb-4">kg</span>
                </div>

                {/* Tape Measure Container */}
                <div className="relative w-full h-24 flex items-center justify-center overflow-hidden mb-8">
                    {/* Gradient Masks (White fade) */}
                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none"></div>
                    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none"></div>

                    {/* Center Indicator */}
                    <div className="absolute h-12 w-1 bg-[#BBF246] rounded-full z-30 shadow-sm"></div>

                    {/* Draggable Tape */}
                    <motion.div
                        ref={containerRef}
                        className="flex items-center absolute left-1/2 cursor-grab active:cursor-grabbing touch-pan-x"
                        style={{ x: smoothX }}
                        drag="x"
                        dragConstraints={{ left: -10000, right: 10000 }}
                        dragElastic={0}
                        dragMomentum={false}
                        onDrag={handleDrag}
                    >
                        {TICKS.map((val) => (
                            <div
                                key={val}
                                className="flex flex-col items-center justify-end h-16 w-[50px] shrink-0 relative"
                            >
                                {/* Tick Mark */}
                                <div className={`w-[2px] rounded-full transition-colors ${val % 5 === 0 ? 'h-8 bg-gray-400' : 'h-4 bg-gray-200'}`}></div>

                                {/* Numbers for every 5kg */}
                                {val % 5 === 0 && (
                                    <span className="absolute -bottom-6 text-xs text-gray-400 font-bold font-mono">
                                        {val}
                                    </span>
                                )}
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Date Estimator */}
                <div className="h-20 flex items-center justify-center">
                    <motion.div
                        key={targetWeight}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="px-6 py-3 rounded-full bg-white border-2 border-gray-100 flex items-center gap-3 shadow-md"
                    >
                        <Calendar className="w-4 h-4 text-[#BBF246]" />
                        <span className="text-sm font-bold text-[#192126]">
                            {currentWeight === targetWeight
                                ? "Maintaing current weight."
                                : `Target date: ${monthName}`
                            }
                        </span>
                    </motion.div>
                </div>

            </motion.div>

            <div className="mt-auto pt-6 border-t border-gray-100">
                <Button onClick={onNext}>
                    Next
                </Button>
            </div>
        </div>
    );
}
