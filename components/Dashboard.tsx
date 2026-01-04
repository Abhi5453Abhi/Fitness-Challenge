'use client'

import React, { useState, useEffect } from 'react';
import { Bell, Flame, Footprints, Clock, Play, LayoutGrid, Dumbbell, BarChart2, User, ChevronRight, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes'
import { CameraModal } from '@/components/CameraModal';
import { AnalysisResult } from '@/components/AnalysisResult';

export function Dashboard({ userName }: { userName?: string }) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
    const [reps, setReps] = useState<number | null>(null);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    // Get current date in IST
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    const currentDate = new Date().toLocaleDateString('en-IN', dateOptions);

    const handleVideoRecorded = (blob: Blob) => {
        setIsCameraOpen(false);
        setIsAnalysisOpen(true);
        // Here you would typically send the blob to a backend
        console.log("Video recorded:", blob);
    };

    if (!mounted) return null

    return (
        <div className="flex flex-col h-full bg-[var(--color-bg)] text-[var(--color-text-main)] overflow-hidden relative font-sans transition-colors duration-300">

            <CameraModal
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onVideoRecorded={handleVideoRecorded}
            />

            <AnalysisResult
                isOpen={isAnalysisOpen}
                reps={reps}
                onClose={() => setIsAnalysisOpen(false)}
                onComplete={() => setIsAnalysisOpen(false)}
            />

            {/* Header */}
            <header className="px-6 pt-8 pb-4 flex items-center justify-between z-10 sticky top-0 bg-[var(--color-bg)]/90 backdrop-blur-sm transition-colors duration-300">
                <div>
                    <p className="text-xs text-[#8B95A5] font-bold uppercase tracking-wider mb-1">{currentDate}</p>
                    <h1 className="text-2xl font-bold">Good Morning, {userName || 'Human'}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="w-10 h-10 rounded-full bg-[var(--color-card)] border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[var(--color-text-main)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <div className="relative">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                            alt="Profile"
                            className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                        />
                    </div>
                </div>
            </header>

            {/* Main Content Scroll Area */}
            <div className="flex-1 overflow-y-auto px-6 pb-32 no-scrollbar space-y-6">

                {/* Daily Goal and Stats Removed as per request */}


                {/* Challenges */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            Challenges <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        </h3>
                        <button className="text-xs text-[var(--color-primary)] font-bold hover:underline">View All</button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar snap-x">
                        {/* Challenge Card 1 */}
                        <div className="min-w-[280px] bg-[var(--color-card)] rounded-3xl p-5 snap-center relative overflow-hidden group shadow-sm transition-colors duration-300">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <Dumbbell className="w-24 h-24 text-[var(--color-text-main)]" />
                            </div>

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                                    <Dumbbell className="w-6 h-6" />
                                </div>
                                {/* AI Coach Button Removed */}
                            </div>

                            <h4 className="font-bold text-lg mb-1 relative z-10">Push-Up Challenge</h4>
                            <p className="text-[#8B95A5] text-xs mb-4 relative z-10 pr-8">Let AI analyze your form and count your reps automatically.</p>

                            <div className="flex items-center justify-between text-xs font-bold text-gray-400 mb-4 relative z-10">
                                <span>Current streak</span>
                                <span className="text-[var(--color-text-main)]">3 Days</span>
                            </div>

                            <button
                                onClick={() => setIsCameraOpen(true)}
                                className="w-full bg-[var(--color-bg)] text-[var(--color-text-main)] border border-gray-200 dark:border-gray-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 relative z-10 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                {/* Simple Camera Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.944 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.004-2.56 1.06z" />
                                </svg>
                                Record Attempt
                            </button>
                        </div>

                        {/* Challenge Card 2 */}
                        <div className="min-w-[280px] bg-[var(--color-card)] rounded-3xl p-5 snap-center relative overflow-hidden group shadow-sm transition-colors duration-300">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <User className="w-24 h-24 text-purple-500" />
                            </div>

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-500">
                                    <User className="w-6 h-6" />
                                </div>
                            </div>

                            <h4 className="font-bold text-lg mb-1 relative z-10">Squat Challenge</h4>
                            <p className="text-[#8B95A5] text-xs mb-4 relative z-10 pr-8">Perfect your squat depth with real-time feedback.</p>

                            <div className="flex items-center justify-between text-xs font-bold text-gray-400 mb-4 relative z-10">
                                <span>Personal Best</span>
                                <span className="text-[var(--color-text-main)]">45 Reps</span>
                            </div>

                            <button className="w-full bg-gray-100 dark:bg-[#1F2937] text-gray-400 dark:text-gray-500 font-bold py-3 rounded-xl flex items-center justify-center gap-2 relative z-10 cursor-not-allowed">
                                Coming Soon
                            </button>
                        </div>
                    </div>
                </div>

                {/* Weekly Activity Chart */}
                <div className="bg-[var(--color-card)] rounded-3xl p-6 shadow-sm transition-colors duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold">Weekly Activity</h3>
                        <span className="text-xs font-bold text-[#8B95A5] bg-[var(--color-bg)] px-3 py-1 rounded-lg">Last 7 Days</span>
                    </div>

                    <div className="flex items-end justify-between h-32 gap-2">
                        {/* Bars */}
                        {[30, 45, 60, 100, 80, 20, 50].map((height, i) => {
                            const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
                            const isSelected = i === 2; // Wednesday
                            return (
                                <div key={i} className="flex flex-col items-center gap-2 w-full">
                                    <div className="w-full h-full flex items-end justify-center">
                                        <div
                                            className={`w-full rounded-t-lg transition-all duration-500 ${isSelected ? 'bg-[var(--color-primary)]' : 'bg-gray-200 dark:bg-[#1F2937]'}`}
                                            style={{ height: `${height}%` }}
                                        ></div>
                                    </div>
                                    <span className={`text-xs font-bold ${isSelected ? 'text-[var(--color-primary)]' : 'text-[#8B95A5]'}`}>
                                        {days[i]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="h-20"></div> {/* Spacer for bottom nav/button */}
            </div>

            {/* Start Workout Button Removed as per request */}

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 bg-[var(--color-bg)]/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 pb-6 pt-4 px-8 flex justify-between z-30 transition-colors duration-300">
                <NavButton icon={<LayoutGrid className="w-6 h-6" />} label="Home" isActive />
                {/* Workouts Nav Removed */}
                <NavButton icon={<BarChart2 className="w-6 h-6" />} label="Stats" />
                <NavButton icon={<User className="w-6 h-6" />} label="Profile" />
            </div>

        </div>
    );
}

function NavButton({ icon, label, isActive = false }: { icon: any, label: string, isActive?: boolean }) {
    return (
        <button className={`flex flex-col items-center gap-1 ${isActive ? 'text-[var(--color-primary)]' : 'text-[#8B95A5] hover:text-[var(--color-text-main)]'}`}>
            {icon}
            <span className="text-[10px] font-bold">{label}</span>
        </button>
    )
}
