import { getUserWorkouts, getUserBalance, redeemItem } from '@/app/actions';

import React, { useState, useEffect, useRef } from 'react';
import Webcam from "react-webcam";
import { Bell, Flame, Footprints, Clock, Play, LayoutGrid, Dumbbell, BarChart2, User, ChevronRight, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes'
import { CameraModal } from '@/components/CameraModal';
import { AnalysisResult } from '@/components/AnalysisResult';
import { useUploadThing } from "@/lib/uploadthing"; // Import UploadThing hook

export function Dashboard({ userName }: { userName?: string }) {
    const webcamRef = useRef<Webcam>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [isCameraOpen, setIsCameraOpen] = useState(false); // This state will be managed differently now
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
    const [reps, setReps] = useState<number | null>(null);
    const [analysisStatus, setAnalysisStatus] = useState<'uploading' | 'analyzing' | 'manual_review' | 'complete'>('analyzing');

    const { startUpload, isUploading } = useUploadThing("workoutVideo", {
        onClientUploadComplete: async (res) => {
            console.log("Files: ", res);
            if (res && res.length > 0) {
                const fileUrl = res[0].ufsUrl;
                await handleAnalysis(fileUrl);
            }
        },
        onUploadError: (error: Error) => {
            console.error("UploadThing Error: ", error);
            setIsAnalysisOpen(false);
            alert(`Upload failed: ${error.message}`);
            setReps(null);
            setRecordedChunks([]);
        },
    });

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    // Get current date in IST
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    const currentDate = new Date().toLocaleDateString('en-IN', dateOptions);

    const [totalReps, setTotalReps] = useState(0);
    const [userWorkouts, setUserWorkouts] = useState<any[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (userName) {
            setIsLoading(true);
            Promise.all([
                getUserWorkouts(userName),
                getUserBalance(userName)
            ]).then(([workouts, bal]) => {
                setUserWorkouts(workouts);
                const verified = workouts.filter(w => w.status === 'VERIFIED');
                const total = verified.reduce((acc, curr) => acc + (curr.adminCount || 0), 0);
                setTotalReps(total);
                setBalance(bal);
                setIsLoading(false);
            });
        }
    }, [userName, isAnalysisOpen]);

    const handleStartRecording = () => {
        setIsRecording(true);
        setRecordedChunks([]);

        // Safety check for webcam ref
        if (webcamRef.current && webcamRef.current.stream) {
            const stream = webcamRef.current.stream;
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: "video/webm"
            });

            mediaRecorder.addEventListener("dataavailable", (event) => {
                if (event.data.size > 0) {
                    setRecordedChunks((prev) => [...prev, event.data]);
                }
            });

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        setIsAnalysisOpen(true); // Open "Analyzing" modal

        // Wait for chunks to be available then process
        // We use a small timeout to let the state settle, or use `onStop` event logic if we had it.
        // For simplicity, we can just process in a separate effect or just wait a tiny bit.
        // Actually, easiest is to use the `onStop` callback of MediaRecorder if we extracted it,
        // but since we are using chunks state, we need to be careful.
        // A better pattern for react-webcam is to process `recordedChunks` in a useEffect or ensure we have them.
        // Let's rely on the fact that stop() triggers dataavailable one last time.
    };

    // Add effect to trigger upload when recording stops and we have chunks
    useEffect(() => {
        if (!isRecording && recordedChunks.length > 0 && isAnalysisOpen && reps === null && !isUploading) {
            const blob = new Blob(recordedChunks, { type: "video/webm" });
            const file = new File([blob], "workout.webm", { type: "video/webm" });
            // Start Upload Logic
            setAnalysisStatus('uploading');
            startUpload([file]);
        }
    }, [recordedChunks, isRecording, isAnalysisOpen, reps, isUploading, startUpload]);


    const handleVideoUpload = async (blob: Blob) => {
        setIsCameraOpen(false);
        setIsAnalysisOpen(true);
        setAnalysisStatus('uploading');
        const file = new File([blob], "workout.webm", { type: "video/webm" });
        await startUpload([file]);
    };

    const handleAnalysis = async (videoUrl: string) => {
        try {
            console.log("Analyzing URL:", videoUrl);

            // Now send the URL to our backend
            const response = await fetch('/api/analyze-workout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: userName || 'Anonymous',
                    videoUrl: videoUrl
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Backend error:", response.status, errorData);
                throw new Error('Analysis failed');
            }

            const data = await response.json();
            console.log("Success:", data);

            if (typeof data.count === 'number') {
                setReps(data.count);
                if (data.message) {
                    // alert("Video submitted successfully for manual review!"); // Removed alert
                    setAnalysisStatus('manual_review');
                    // Keep the modal open so they see the result
                } else {
                    setAnalysisStatus('complete');
                }
            } else {
                setReps(0);
                setAnalysisStatus('complete');
            }

        } catch (error) {
            console.error("Error analyze:", error);
            setTimeout(() => {
                setIsAnalysisOpen(false);
                alert("Analysis failed. Please try again.");
                setReps(null);
                setRecordedChunks([]);
            }, 2000);
        }
    };

    const [activeTab, setActiveTab] = useState<'home' | 'logs' | 'profile' | 'store'>('home');
    const [balance, setBalance] = useState({ available: 0, redeemed: 0, totalEarned: 0 });
    const [storeItems, setStoreItems] = useState<any[]>([]);

    useEffect(() => {
        if (activeTab === 'store') {
            fetch('/api/store')
                .then(async res => {
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    const text = await res.text();
                    return text ? JSON.parse(text) : [];
                })
                .then(data => setStoreItems(data))
                .catch(err => console.error("Failed to fetch store items", err));
        }
    }, [activeTab]);

    // Fetched in combined effect above

    // ... (upload logic remains)

    // Calculate Weekly Stats
    const [weeklyStats, setWeeklyStats] = useState<{ day: string; height: number; fullDate: string }[]>([]);

    useEffect(() => {
        if (userWorkouts.length > 0) {
            const today = new Date();
            const last7Days = Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(today.getDate() - (6 - i));
                return d;
            });

            const stats = last7Days.map(date => {
                const dayStr = date.toLocaleDateString('en-IN', { weekday: 'narrow' }); // M, T, W
                // Filter workouts for this day that are VERIFIED
                const dayTotal = userWorkouts
                    .filter(w => {
                        const wDate = new Date(w.createdAt);
                        return wDate.getDate() === date.getDate() &&
                            wDate.getMonth() === date.getMonth() &&
                            w.status === 'VERIFIED';
                    })
                    .reduce((acc, curr) => acc + (curr.adminCount || 0), 0);

                return {
                    day: dayStr,
                    height: dayTotal, // We will normalize this later for percentage if needed, or use max
                    fullDate: date.toDateString()
                };
            });
            setWeeklyStats(stats);
        } else {
            // Default empty state
            setWeeklyStats(Array(7).fill({ day: '-', height: 0, fullDate: '' }));
        }
    }, [userWorkouts]);

    // Normalize height for chart (percentage relative to max or 100)
    const maxReps = Math.max(...weeklyStats.map(s => s.height), 1); // Avoid div by 0

    if (!mounted) return null

    return (
        <div className="flex flex-col h-full bg-[var(--color-bg)] text-[var(--color-text-main)] overflow-hidden relative font-sans transition-colors duration-300">

            <CameraModal
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onVideoRecorded={handleVideoUpload}
            />

            <AnalysisResult
                isOpen={isAnalysisOpen}
                reps={reps}
                status={analysisStatus}
                onClose={() => {
                    setIsAnalysisOpen(false);
                    setReps(null);
                    setRecordedChunks([]);
                    setAnalysisStatus('analyzing');
                }}
                onComplete={() => setIsAnalysisOpen(false)}
            />

            {/* Header */}
            <header className="px-6 pt-8 pb-4 flex items-center justify-between z-10 sticky top-0 bg-[var(--color-bg)]/90 backdrop-blur-sm transition-colors duration-300">
                <div>
                    <h1 className="text-2xl font-bold">{activeTab === 'home' ? `Good Morning, ${userName || 'Human'}` : activeTab === 'logs' ? 'Workout Logs' : activeTab === 'store' ? 'FitCoin Store' : 'Profile'}</h1>
                    {activeTab === 'home' && <p className="text-xs text-[#8B95A5] font-bold uppercase tracking-wider mb-1">{currentDate}</p>}
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

                {activeTab === 'home' && (
                    <>
                        {/* Stats Summary */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[var(--color-card)] p-5 rounded-3xl shadow-sm">
                                <div className="flex items-center gap-2 mb-2 text-[#8B95A5]">
                                    <Flame className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase">Verified Reps</span>
                                </div>
                                {isLoading ? (
                                    <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                                ) : (
                                    <p className="text-3xl font-black">{totalReps}</p>
                                )}
                            </div>
                            <div className="bg-[var(--color-card)] p-5 rounded-3xl shadow-sm">
                                <div className="flex items-center gap-2 mb-2 text-[#8B95A5]">
                                    <span className="text-lg font-bold">©</span>
                                    <span className="text-xs font-bold uppercase">FitCoins</span>
                                </div>
                                {isLoading ? (
                                    <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                                ) : (
                                    <p className="text-3xl font-black text-yellow-500">{balance.available}</p>
                                )}
                            </div>
                        </div>

                        {/* Challenges */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    Challenges <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                </h3>
                            </div>

                            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar snap-x">
                                <div className="min-w-[280px] bg-[var(--color-card)] rounded-3xl p-5 snap-center relative overflow-hidden group shadow-sm transition-colors duration-300">
                                    <div className="absolute top-0 right-0 p-3 opacity-10">
                                        <Dumbbell className="w-24 h-24 text-[var(--color-text-main)]" />
                                    </div>
                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                                            <Dumbbell className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-lg mb-1 relative z-10">Push-Up Challenge</h4>
                                    <p className="text-[#8B95A5] text-xs mb-4 relative z-10 pr-8">Let AI analyze your form and count your reps automatically.</p>
                                    <button
                                        onClick={() => setIsCameraOpen(true)}
                                        className="w-full bg-[var(--color-bg)] text-[var(--color-text-main)] border border-gray-200 dark:border-gray-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 relative z-10 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.944 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.004-2.56 1.06z" />
                                        </svg>
                                        Record Attempt
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Weekly Activity Chart (Working) */}
                        <div className="bg-[var(--color-card)] rounded-3xl p-6 shadow-sm transition-colors duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold">Weekly Activity</h3>
                                <span className="text-xs font-bold text-[#8B95A5] bg-[var(--color-bg)] px-3 py-1 rounded-lg">Last 7 Days</span>
                            </div>

                            <div className="flex items-end justify-between h-32 gap-2">
                                {weeklyStats.map((stat, i) => {
                                    const heightPercent = maxReps > 0 ? (stat.height / maxReps) * 100 : 0;
                                    const isToday = i === 6; // Last item is today
                                    return (
                                        <div key={i} className="flex flex-col items-center gap-2 w-full group relative">
                                            {/* Tooltip */}
                                            <div className="absolute -top-8 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                                {stat.height} Reps
                                            </div>
                                            <div className="w-full h-full flex items-end justify-center">
                                                <div
                                                    className={`w-full rounded-t-lg transition-all duration-500 ${isToday ? 'bg-[var(--color-primary)]' : 'bg-gray-200 dark:bg-[#1F2937]'} hover:bg-[var(--color-primary)]/70`}
                                                    style={{ height: `${Math.max(heightPercent, 5)}%` }} // Min height 5%
                                                ></div>
                                            </div>
                                            <span className={`text-xs font-bold ${isToday ? 'text-[var(--color-primary)]' : 'text-[#8B95A5]'}`}>
                                                {stat.day}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'store' && (
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl p-6 text-white mb-6">
                            <h3 className="text-lg font-bold mb-1">Your Balance</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black">{balance.available}</span>
                                <span className="text-sm opacity-80">FitCoins</span>
                            </div>
                            <div className="flex gap-4 mt-2">
                                <p className="text-xs opacity-80 bg-black/20 px-2 py-1 rounded">Redeemed: {balance.redeemed}</p>
                                <p className="text-xs opacity-80 bg-black/20 px-2 py-1 rounded">Total Earned: {balance.totalEarned}</p>
                            </div>
                            <p className="text-xs mt-3 opacity-80">Earn 5 Coins for every verified rep!</p>
                        </div>

                        <h3 className="text-lg font-bold mb-4">Redeem Rewards</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {storeItems.length === 0 ? (
                                <p className="col-span-2 text-center text-gray-500 py-10">Store is being stocked...</p>
                            ) : (
                                storeItems.map((item) => (
                                    <div key={item.id} className="bg-[var(--color-card)] p-4 rounded-xl flex flex-col gap-3">
                                        <div className="aspect-square rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                            {balance.available < item.cost && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded">Need {item.cost - balance.available} more</span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-xs font-bold text-yellow-500 flex items-center gap-1">
                                                    © {item.cost}
                                                </span>
                                                <button
                                                    disabled={balance.available < item.cost}
                                                    onClick={async () => {
                                                        if (!userName) return;
                                                        if (!confirm(`Redeem ${item.name} for ${item.cost} coins?`)) return;

                                                        const res = await redeemItem(userName, item.id, item.name, item.cost);

                                                        if (res.success) {
                                                            alert("Redemption Successful!");
                                                            const newBal = await getUserBalance(userName);
                                                            setBalance(newBal);
                                                        } else {
                                                            alert(res.message);
                                                        }
                                                    }}
                                                    className={`px-3 py-1 rounded-lg text-xs font-bold ${balance.available >= item.cost ? 'bg-[var(--color-primary)] text-white hover:opacity-90' : 'bg-gray-200 text-gray-400'}`}
                                                >
                                                    Buy
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'logs' && (
                    <div className="space-y-4">
                        {userWorkouts.length === 0 ? (
                            <div className="text-center py-10 opacity-50">
                                <Clock className="w-12 h-12 mx-auto mb-2" />
                                <p>No activity yet.</p>
                            </div>
                        ) : (
                            userWorkouts.map((workout) => (
                                <div key={workout.id} className="bg-[var(--color-card)] p-4 rounded-xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="w-16 h-16 bg-black rounded-lg overflow-hidden flex-shrink-0 relative">
                                        {/* Video thumbnail via video tag (poster not ideal for pure url but works) */}
                                        <video src={workout.videoUrl} className="w-full h-full object-cover opacity-50" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Play className="w-6 h-6 text-white opacity-80" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-xs text-gray-400 font-bold">{new Date(workout.createdAt!).toLocaleDateString(undefined, {
                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}</p>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${workout.status === 'VERIFIED' ? 'bg-green-500/20 text-green-500' :
                                                workout.status === 'REJECTED' ? 'bg-red-500/20 text-red-500' :
                                                    'bg-yellow-500/20 text-yellow-500'
                                                }`}>
                                                {workout.status}
                                            </span>
                                        </div>
                                        <p className="font-bold text-sm">Push-up Session</p>
                                        <p className="text-xs text-gray-400">
                                            {workout.status === 'VERIFIED' ? `Verified: ${workout.adminCount} Reps` : 'In Review'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="text-center py-20">
                        <User className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-bold">User Profile</h2>
                        <p className="text-gray-500">Coming Soon</p>
                    </div>
                )}

                <div className="h-20"></div> {/* Spacer for bottom nav/button */}
            </div>

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 bg-[var(--color-bg)]/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 pb-6 pt-4 px-8 flex justify-between z-30 transition-colors duration-300">
                <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-[var(--color-primary)]' : 'text-[#8B95A5] hover:text-[var(--color-text-main)]'}`}>
                    <LayoutGrid className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Home</span>
                </button>
                <button onClick={() => setActiveTab('store')} className={`flex flex-col items-center gap-1 ${activeTab === 'store' ? 'text-[var(--color-primary)]' : 'text-[#8B95A5] hover:text-[var(--color-text-main)]'}`}>
                    <Dumbbell className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Store</span>
                </button>
                <button onClick={() => setActiveTab('logs')} className={`flex flex-col items-center gap-1 ${activeTab === 'logs' ? 'text-[var(--color-primary)]' : 'text-[#8B95A5] hover:text-[var(--color-text-main)]'}`}>
                    <Clock className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Logs</span>
                </button>
                <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-[var(--color-primary)]' : 'text-[#8B95A5] hover:text-[var(--color-text-main)]'}`}>
                    <User className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Profile</span>
                </button>
            </div>

        </div>
    );
}
