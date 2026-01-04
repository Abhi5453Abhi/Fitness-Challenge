import { motion } from 'framer-motion';
import { Button } from './Button';
import { ArrowLeft, Check } from 'lucide-react';

interface Step2GoalsProps {
    name: string;
    selectedGoals: string[];
    toggleGoal: (goal: string) => void;
    onNext: () => void;
    onBack: () => void;
}

const GOALS = [
    "Lose Weight",
    "Maintain Weight",
    "Gain Weight",
    "Gain Muscle",
    "Modify My Diet",
    "Plan Meals",
    "Manage Stress",
    "Stay Active"
];

export function Step2Goals({ name, selectedGoals, toggleGoal, onNext, onBack }: Step2GoalsProps) {
    return (
        <div className="flex flex-col h-full p-6 text-[#192126] bg-white">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-[#192126]" />
                </button>
                <span className="mx-auto text-lg font-bold">Goals</span>
                <div className="w-10"></div>
            </div>

            <div className="flex gap-1 mb-6">
                <div className="h-1 flex-1 bg-[#BBF246] rounded-full"></div>
                <div className="h-1 flex-1 bg-[#BBF246] rounded-full"></div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-1 flex-1 bg-gray-100 rounded-full"></div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 overflow-y-auto pb-4 no-scrollbar"
            >
                <h1 className="text-2xl font-black mb-2 tracking-tight">
                    Hey, {name || 'User'}. 👋 <br />Let's start with your goals.
                </h1>
                <p className="text-[#5E6468] font-medium mb-6 text-sm">
                    Select up to three that are most important to you.
                </p>

                {/* Reverted to Vertical List (Cards) but styled for Light Mode */}
                <div className="space-y-3">
                    {GOALS.map((goal) => {
                        const isSelected = selectedGoals.includes(goal);
                        return (
                            <div
                                key={goal}
                                onClick={() => toggleGoal(goal)}
                                className={`flex items-center justify-between p-5 rounded-3xl border-2 cursor-pointer transition-all ${isSelected
                                    ? 'bg-[#192126] border-[#192126] shadow-lg scale-[1.02] text-white'
                                    : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-[#192126]'
                                    }`}
                            >
                                <span className="font-bold text-lg">{goal}</span>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-[#BBF246]' : 'bg-gray-100'
                                    }`}>
                                    {isSelected && <Check className="w-4 h-4 text-[#192126]" />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 bg-white">
                <Button onClick={onNext} disabled={selectedGoals.length === 0}>
                    Next
                </Button>
            </div>
        </div>
    );
}
