import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Button } from './Button';
import { ArrowLeft, User } from 'lucide-react';

interface Step4BiometricsProps {
    gender: 'male' | 'female' | 'other' | null;
    setGender: (g: 'male' | 'female' | 'other' | null) => void;
    age: number;
    setAge: (a: number | ((prev: number) => number)) => void;
    onNext: () => void;
    onBack: () => void;
}

const MIN_AGE = 18;
const MAX_AGE = 100;
const PIXELS_PER_YEAR = 50;
const TICKS = Array.from({ length: (MAX_AGE - MIN_AGE) + 1 }, (_, i) => MIN_AGE + i);

export function Step4Biometrics({ gender, setGender, age, setAge, onNext, onBack }: Step4BiometricsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const smoothX = useSpring(x, { stiffness: 400, damping: 40 });

    // Sync visual position to state
    useEffect(() => {
        const index = age - MIN_AGE;
        const targetX = -index * PIXELS_PER_YEAR;
        x.set(targetX);
    }, [age, x]);

    const handleDrag = (_: any, info: any) => {
        const move = info.delta.x;
        const currentX = x.get();
        x.set(currentX + move);

        const rawIndex = -x.get() / PIXELS_PER_YEAR;
        const rawAge = rawIndex + MIN_AGE;

        const clamped = Math.round(Math.min(MAX_AGE, Math.max(MIN_AGE, rawAge)));

        if (clamped !== age) {
            setAge(clamped);
        }
    };

    return (
        <div className="flex flex-col h-full p-6 select-none overflow-hidden bg-white text-[#192126]">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-[#192126]" />
                </button>
                <span className="mx-auto text-lg font-bold">Biometrics</span>
                <div className="w-10"></div>
            </div>

            <div className="flex gap-1 mb-8">
                <div className="h-1 flex-1 bg-[#BBF246] rounded-full"></div>
                <div className="h-1 flex-1 bg-[#BBF246] rounded-full"></div>
                <div className="h-1 flex-1 bg-[#BBF246] rounded-full"></div>
                <div className="h-1 flex-1 bg-[#BBF246] rounded-full"></div>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-1 flex-1 bg-gray-100 rounded-full"></div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col"
            >
                <h1 className="text-2xl font-black mb-2 text-center tracking-tight">Let's calibrate your baseline.</h1>
                <p className="text-[#5E6468] mb-8 text-center font-medium">To check your metabolic rate, we need a few details.</p>

                {/* Gender Selection */}
                <div className="grid grid-cols-2 gap-4 mb-12">
                    {['male', 'female'].map((g) => (
                        <button
                            key={g}
                            onClick={() => setGender(g as any)}
                            className={`p-6 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden group ${gender === g ? 'bg-[#192126] border-[#192126] shadow-xl' : 'bg-white border-gray-100 hover:border-gray-200'
                                }`}
                        >
                            <div className="relative z-10 mb-2 flex justify-center">
                                {g === 'male' ? (
                                    <User className={`w-12 h-12 ${gender === g ? 'text-[#BBF246]' : 'text-gray-400'}`} />
                                ) : (
                                    <User className={`w-12 h-12 ${gender === g ? 'text-[#BBF246]' : 'text-gray-400'}`} />
                                )}
                            </div>
                            <span className={`text-lg font-bold capitalize relative z-10 ${gender === g ? 'text-white' : 'text-gray-400'}`}>{g}</span>
                        </button>
                    ))}
                </div>

                {/* Age Scroller */}
                <div className="flex flex-col items-center">
                    <label className="text-gray-400 block mb-4 text-center font-bold uppercase tracking-wider text-xs">Age</label>

                    {/* Big Number Display */}
                    <div className="text-center mb-6">
                        <span className="text-6xl font-black tracking-tighter text-[#192126] tabular-nums">
                            {age}
                        </span>
                        <span className="text-xl text-gray-400 font-bold ml-2">years</span>
                    </div>

                    {/* Tape Measure Container */}
                    <div className="relative w-full h-24 flex items-center justify-center overflow-hidden mb-8">
                        {/* Gradient Masks (White fade) */}
                        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none"></div>
                        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none"></div>

                        {/* Center Indicator */}
                        <div className="absolute h-10 w-1 bg-[#BBF246] rounded-full z-30"></div>

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
                                    <div className={`w-[2px] rounded-full transition-colors ${val % 10 === 0 ? 'h-8 bg-gray-400' : 'h-4 bg-gray-200'}`}></div>

                                    {val % 10 === 0 && (
                                        <span className="absolute -bottom-6 text-xs text-gray-400 font-bold font-sans">
                                            {val}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>

            </motion.div>

            <div className="mt-auto pt-6 border-t border-gray-100">
                <Button onClick={onNext} disabled={!gender}>
                    Next
                </Button>
            </div>
        </div>
    );
}
