import { motion } from 'framer-motion';
import { Button } from './Button';
import { ArrowLeft, Sparkles, Brain, Salad, Trophy } from 'lucide-react';

interface Step3MotivationProps {
    selectedGoals: string[];
    onNext: () => void;
    onBack: () => void;
}

export function Step3Motivation({ selectedGoals = [], onNext, onBack }: Step3MotivationProps) {
    const isSynergy = selectedGoals.length > 1;
    const primaryGoal = selectedGoals[0] || "Lose Weight";

    // -----------------------------------------------------------------------
    // RENDERERS (Light Mode Variants)
    // -----------------------------------------------------------------------

    const renderSynergyCore = () => (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Connecting Beams */}
                <svg className="absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite]">
                    {selectedGoals.map((_, i) => (
                        <line
                            key={i}
                            x1="50%" y1="50%"
                            x2={`${50 + 40 * Math.cos(i * 2 * Math.PI / selectedGoals.length)}%`}
                            y2={`${50 + 40 * Math.sin(i * 2 * Math.PI / selectedGoals.length)}%`}
                            stroke="#BBF246"
                            strokeWidth="2"
                            strokeOpacity="0.8"
                        />
                    ))}
                </svg>

                {/* Central Core */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-20 h-20 bg-[#192126] rounded-full z-10 flex items-center justify-center shadow-2xl shadow-[#BBF246]/30"
                >
                    <Sparkles className="w-10 h-10 text-[#BBF246]" />
                </motion.div>

                {/* Orbiting Goals */}
                {selectedGoals.map((goal, i) => {
                    const angle = (i * 2 * Math.PI) / selectedGoals.length;
                    const radius = 100; // px
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                        <motion.div
                            key={goal}
                            initial={{ opacity: 0, x: 0, y: 0 }}
                            animate={{ opacity: 1, x, y }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                            className="absolute w-12 h-12 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center text-[10px] text-center font-bold text-[#192126] shadow-md z-20"
                        >
                            {goal.split(' ')[0]}
                        </motion.div>
                    )
                })}
            </div>
            <p className="mt-8 text-center text-gray-500 max-w-xs font-medium">
                Combining <strong className="text-[#192126]">{selectedGoals.length} goals</strong> into one unified protocol.
            </p>
        </div>
    );

    const renderMuscleCurve = () => (
        <div className="relative w-full h-64 bg-orange-50/50 rounded-3xl border border-orange-100 p-6 flex flex-col justify-between overflow-hidden shadow-inner">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 500 250">
                {/* Gradient Fill */}
                <defs>
                    <linearGradient id="muscleGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FB923C" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#FB923C" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Trend Line */}
                <path
                    d="M0,220 C100,210 180,180 250,140 S400,60 500,40"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="4"
                    strokeLinecap="round"
                />

                {/* Fill Area underneath */}
                <path
                    d="M0,220 C100,210 180,180 250,140 S400,60 500,40 V250 H0 Z"
                    fill="url(#muscleGradient)"
                />

                {/* Dashed Projection Extension */}
                <path
                    d="M500,40 C530,35 560,30 600,20"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.6"
                />
            </svg>

            <div className="absolute right-6 top-6 z-10">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Trophy className="w-6 h-6 text-orange-500" />
                </div>
            </div>

            <div className="mt-auto z-10 bg-white/60 backdrop-blur-sm self-start px-4 py-2 rounded-2xl border border-orange-100/50">
                <h3 className="text-3xl font-black text-[#192126]">+2.5kg</h3>
                <p className="text-orange-900/60 font-medium text-sm">Lean Mass Projection</p>
            </div>
        </div>
    );

    const renderDietStream = () => (
        <div className="relative w-full h-64 bg-green-50 rounded-3xl border border-green-100 p-6 flex flex-col items-center justify-center overflow-hidden">

            {/* Particles Stream */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ x: -200, y: Math.random() * 200, opacity: 0 }}
                    animate={{ x: 400, opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 2 + Math.random(), delay: Math.random() * 2, ease: "linear" }}
                    className="absolute w-3 h-3 bg-green-400 rounded-full opacity-50"
                    style={{ top: Math.random() * 100 + "%" }}
                />
            ))}

            <div className="z-10 bg-white border border-gray-100 shadow-xl px-6 py-3 rounded-full flex items-center gap-3">
                <Salad className="w-5 h-5 text-green-600" />
                <span className="text-[#192126] font-bold">Metabolic Optimization</span>
            </div>
        </div>
    );

    const renderStressWave = () => (
        <div className="relative w-full h-64 bg-indigo-50 rounded-3xl border border-indigo-100 p-6 flex items-center justify-center overflow-hidden">
            <svg className="absolute inset-0 w-full h-full">
                <path d="M0,128 Q50,50 100,128 T200,128 T300,128 T400,128" fill="none" stroke="#6366F1" strokeWidth="4" className="drop-shadow-sm" />
            </svg>
            <div className="z-10 flex flex-col items-center bg-white/80 backdrop-blur  p-4 rounded-3xl">
                <Brain className="w-12 h-12 text-indigo-600 mb-2" />
                <span className="text-indigo-900 font-bold">Cortisol Regulation</span>
            </div>
        </div>
    );

    const renderStepsStairs = () => (
        <div className="relative w-full h-64 bg-gray-50 rounded-3xl border border-gray-100 p-6 flex items-end gap-2 justify-center overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((h, i) => (
                <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: h * 15 + "%" }}
                    transition={{ delay: i * 0.1 }}
                    className="w-10 bg-[#192126] rounded-t-lg"
                />
            ))}
            <div className="absolute top-6 left-6 text-[#192126] font-black text-xl">Activity Volume</div>
        </div>
    );

    const renderWeightLoss = () => (
        <div className="relative w-full h-64 bg-blue-50 rounded-3xl border border-blue-100 p-6 flex flex-col justify-between mb-8 overflow-hidden">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                <path
                    d="M0,50 C50,60 100,120 150,110 S250,140 300,160 S400,200 500,220"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="4"
                    strokeLinecap="round"
                />
                <path
                    d="M0,30 C50,40 100,100 150,90 S250,120 300,140 S400,180 500,200"
                    fill="none"
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                />
            </svg>
            <div className="mt-auto flex justify-between text-xs font-bold text-blue-900/50 z-10 w-full px-1">
                <span>Today</span>
                <span>6 months</span>
            </div>
        </div>
    );

    // -----------------------------------------------------------------------
    // SELECTOR
    // -----------------------------------------------------------------------

    let content;
    let title = "Losing weight isn't always easy.";
    let sub = "But we'll motivate you through the ups and downs.";

    if (isSynergy) {
        title = "Ambitious. Complex. Achievable.";
        sub = "Most people pick one path. You've chosen to master multiple. We've built a protocol to harmonize them.";
        content = renderSynergyCore();
    } else if (primaryGoal.includes("Muscle") || primaryGoal.includes("Gain Weight")) {
        title = "Building strength takes patience.";
        sub = "We optimize your hypertrophy window so every rep counts.";
        content = renderMuscleCurve();
    } else if (primaryGoal.includes("Diet") || primaryGoal.includes("Meals")) {
        title = "Fueling your engine.";
        sub = "It's not just about less food, it's about better fuel.";
        content = renderDietStream();
    } else if (primaryGoal.includes("Stress") || primaryGoal.includes("Maintain")) {
        title = "Finding your balance.";
        sub = "Sustainable health resets in a calm mind.";
        content = renderStressWave();
    } else if (primaryGoal.includes("Active")) {
        title = "Momentum builds daily.";
        sub = "Small steps compound into massive change.";
        content = renderStepsStairs();
    } else {
        content = renderWeightLoss();
    }


    return (
        <div className="flex flex-col h-full bg-white text-[#192126]">
            <div className="p-6 pb-0">
                <div className="flex items-center mb-6">
                    <span className="mx-auto text-lg font-bold text-gray-400">Motivation</span>
                </div>
                {/* Progress Bar */}
                <div className="flex gap-1 mb-8">
                    <div className="h-1 flex-1 bg-[#BBF246] rounded-full"></div>
                    <div className="h-1 flex-1 bg-[#BBF246] rounded-full"></div>
                    <div className="h-1 flex-1 bg-[#BBF246] rounded-full"></div>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-1 flex-1 bg-gray-100 rounded-full"></div>
                    ))}
                </div>
            </div>

            <motion.div
                key={isSynergy ? 'synergy' : primaryGoal}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1 px-6 flex flex-col"
            >
                <h2 className="text-lg font-bold text-gray-400 mb-2">OK, real talk:</h2>
                <h1 className="text-3xl font-black mb-4 leading-tight tracking-tight text-[#192126]">
                    {title}
                </h1>
                <p className="text-[#5E6468] text-lg mb-8 leading-relaxed font-medium">
                    {sub}
                </p>

                {/* Dynamic Content Area */}
                <div className="flex-1 relative mb-4">
                    {content}
                </div>

                {!isSynergy && (
                    <p className="text-sm italic text-gray-400 mb-6 text-center">
                        P.S. You've already done the hardest part: getting started 🥳
                    </p>
                )}

            </motion.div>

            <div className="p-6 mt-auto flex items-center gap-4 border-t border-gray-100 bg-white">
                <button onClick={onBack} className="p-4 rounded-full hover:bg-gray-100 transition-colors shrink-0">
                    <ArrowLeft className="w-6 h-6 text-[#192126]" />
                </button>
                <Button onClick={onNext} className="">
                    Next
                </Button>
            </div>
        </div>
    );
}
