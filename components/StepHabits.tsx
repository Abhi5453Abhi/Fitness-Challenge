import { motion } from 'framer-motion';
import { Button } from './Button';
import { ArrowLeft, Check } from 'lucide-react';

interface StepHabitsProps {
    habits: string[];
    setHabits: (habits: string[]) => void;
    onNext: () => void;
    onBack: () => void;
}

const RECOMMENDED_HABITS = [
    "Eat more protein", "Plan more meals",
    "Meal prep and cook", "Eat more fiber",
    "Move more", "Workout more"
];

const MORE_HABITS = [
    "Track nutrients", "Track calories", "Track macros",
    "Eat mindfully", "Eat a balanced diet",
    "Eat whole foods", "Eat more vegetables",
    "Eat more fruit", "Drink more water",
    "Prioritize sleep", "Something else", "I'm not sure"
];

export function StepHabits({ habits, setHabits, onNext, onBack }: StepHabitsProps) {

    const toggleHabit = (habit: string) => {
        if (habits.includes(habit)) {
            setHabits(habits.filter(h => h !== habit));
        } else {
            setHabits([...habits, habit]);
        }
    };

    return (
        <div className="flex flex-col h-full p-6 bg-white text-[#192126]">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-[#192126]" />
                </button>
                <span className="mx-auto text-lg font-bold">Goals</span>
                <div className="w-10"></div>
            </div>

            <div className="flex gap-1 mb-8">
                {/* Progress Bar - Step 8 of 12 (roughly) */}
                <div className="h-1 flex-1 bg-[#BBF246] rounded-full"></div>
                <div className="h-1 flex-1 bg-[#BBF246] rounded-full"></div>
                <div className="h-1 flex-1 bg-[#BBF246] rounded-full"></div>
                <div className="h-1 flex-1 bg-[#BBF246] rounded-full"></div>
                <div className="h-1 flex-1 bg-[#BBF246] rounded-full"></div>
                <div className="h-1 flex-1 bg-[#BBF246] rounded-full"></div>
                <div className="h-1 flex-1 bg-[#BBF246] rounded-full"></div>
                <div className="h-1 flex-1 bg-[#BBF246] rounded-full"></div>
                <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 overflow-y-auto pb-4 no-scrollbar"
            >
                <h1 className="text-2xl font-black mb-6 tracking-tight">
                    Which healthy habits are most important to you?
                </h1>

                <div className="mb-8">
                    <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-4">Recommended for you</h3>
                    <div className="flex flex-wrap gap-2">
                        {RECOMMENDED_HABITS.map(habit => {
                            const isSelected = habits.includes(habit);
                            return (
                                <button
                                    key={habit}
                                    onClick={() => toggleHabit(habit)}
                                    className={`px-5 py-3 rounded-full text-sm font-bold transition-all border-2 flex items-center gap-2 ${isSelected
                                        ? 'bg-[#192126] border-[#192126] text-white shadow-lg'
                                        : 'bg-white border-gray-100 text-[#192126] hover:border-gray-300'
                                        }`}
                                >
                                    {habit}
                                    {isSelected && <Check className="w-4 h-4 text-[#BBF246]" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-4">More healthy habits</h3>
                    <div className="flex flex-wrap gap-2">
                        {MORE_HABITS.map(habit => {
                            const isSelected = habits.includes(habit);
                            return (
                                <button
                                    key={habit}
                                    onClick={() => toggleHabit(habit)}
                                    className={`px-5 py-3 rounded-full text-sm font-bold transition-all border-2 flex items-center gap-2 ${isSelected
                                        ? 'bg-[#192126] border-[#192126] text-white shadow-lg'
                                        : 'bg-white border-gray-100 text-[#192126] hover:border-gray-300'
                                        }`}
                                >
                                    {habit}
                                    {isSelected && <Check className="w-4 h-4 text-[#BBF246]" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </motion.div>

            <div className="mt-4 pt-6 border-t border-gray-100 text-center text-xs text-gray-400 font-medium mb-4">
                We use this to personalize your daily plan.
            </div>

            <div className="">
                <Button onClick={onNext}>
                    Next
                </Button>
            </div>
        </div>
    );
}
