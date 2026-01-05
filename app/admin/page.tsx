'use client'

import { useState, useEffect } from 'react';
import { getAllWorkouts, verifyWorkout } from '../actions';
import { Loader2, Check, X, Play } from 'lucide-react';
import { UploadButton } from "@/lib/uploadthing";

interface Workout {
    id: number;
    userName: string;
    videoUrl: string;
    geminiCount: number | null;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED' | null;
    adminCount: number | null;
    createdAt: Date | null;
}


export default function AdminPage() {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState<number | null>(null);
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED'>('ALL');
    const [activeSection, setActiveSection] = useState<'reviews' | 'store'>('reviews');

    // Store State
    const [storeItems, setStoreItems] = useState<any[]>([]);
    const [newItem, setNewItem] = useState({ name: '', description: '', cost: 200, imageUrl: '' });

    useEffect(() => {
        loadWorkouts();
    }, []);

    useEffect(() => {
        if (activeSection === 'store') {
            fetchStoreItems();
        }
    }, [activeSection]);

    const loadWorkouts = async () => {
        try {
            // Dynamically import to avoid server-client mismatch issues if any
            const { getAllWorkouts } = await import('../actions');
            const data = await getAllWorkouts();
            setWorkouts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStoreItems = async () => {
        try {
            const res = await fetch('/api/store');
            if (!res.ok) {
                console.error("Failed to fetch store items", res.status);
                return;
            }
            const text = await res.text();
            try {
                const data = JSON.parse(text);
                setStoreItems(data);
            } catch (jsonError) {
                console.error("JSON Parse Error:", jsonError, "Response:", text);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/store', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });
            if (res.ok) {
                setNewItem({ name: '', description: '', cost: 200, imageUrl: '' });
                fetchStoreItems();
                alert("Item added!");
            } else {
                alert("Failed to add item");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleVerify = async (id: number, count: number) => {
        setVerifying(id);
        try {
            await verifyWorkout(id, count);
            // Re-fetch to update state correctly
            loadWorkouts();
        } catch (error) {
            console.error("Verification failed", error);
            alert("Verification failed");
        } finally {
            setVerifying(null);
        }
    };

    const filteredWorkouts = workouts.filter(w => {
        if (filter === 'ALL') return true;
        return w.status === filter;
    });

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
            <header className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-400">Manage workouts and store items</p>
                    </div>
                </div>

                {/* Admin Tab Nav */}
                <div className="flex gap-4 border-b border-gray-700 pb-4 mb-6">
                    <button
                        onClick={() => setActiveSection('reviews')}
                        className={`px-4 py-2 rounded-lg font-bold transition-colors ${activeSection === 'reviews' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                    >
                        Review Workouts
                    </button>
                    <button
                        onClick={() => setActiveSection('store')}
                        className={`px-4 py-2 rounded-lg font-bold transition-colors ${activeSection === 'store' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                    >
                        Manage Store
                    </button>
                </div>

                {activeSection === 'reviews' && (
                    <div className="flex gap-2 mb-6">
                        {(['ALL', 'PENDING', 'VERIFIED'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === f
                                    ? 'bg-blue-600/50 text-blue-100 border border-blue-500'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                )}
            </header>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : activeSection === 'reviews' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWorkouts.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-gray-800/50 rounded-3xl border border-gray-700 border-dashed">
                            <Check className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">No Workouts Found</h3>
                            <p className="text-gray-500">Try changing the filter.</p>
                        </div>
                    ) : (
                        filteredWorkouts.map(workout => (
                            <WorkoutCard
                                key={workout.id}
                                workout={workout}
                                onVerify={handleVerify}
                                isVerifying={verifying === workout.id}
                            />
                        ))
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Item Form */}
                    <div className="bg-gray-800 p-6 rounded-2xl h-fit sticky top-8">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            Add New Item
                        </h3>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Item Name</label>
                                <input
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none"
                                    required
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                    placeholder="e.g. Wireless Earbuds"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Description</label>
                                <textarea
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none h-24 resize-none"
                                    value={newItem.description}
                                    onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                    placeholder="Short description..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Cost (FitCoins)</label>
                                <input
                                    type="number"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none"
                                    required
                                    value={newItem.cost}
                                    onChange={e => setNewItem({ ...newItem, cost: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Image</label>
                                {newItem.imageUrl ? (
                                    <div className="relative w-full h-32 mb-2 rounded-lg overflow-hidden border border-gray-700 group">
                                        <img src={newItem.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setNewItem({ ...newItem, imageUrl: '' })}
                                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <UploadButton
                                        endpoint="imageUploader"
                                        onClientUploadComplete={(res) => {
                                            if (res && res[0]) {
                                                setNewItem({ ...newItem, imageUrl: res[0].url });
                                                alert("Image uploaded!");
                                            }
                                        }}
                                        onUploadError={(error: Error) => {
                                            alert(`ERROR! ${error.message}`);
                                        }}
                                        className="ut-button:bg-gray-700 ut-button:ut-readying:bg-gray-700/50 ut-label:text-blue-400"
                                    />
                                )}
                            </div>
                            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-colors">
                                Add Item to Store
                            </button>
                        </form>
                    </div>

                    {/* Items List */}
                    <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {storeItems.map(item => (
                            <div key={item.id} className="bg-gray-800 p-4 rounded-xl flex gap-4">
                                <div className="w-24 h-24 bg-gray-700 rounded-lg shrink-0 overflow-hidden">
                                    <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{item.name}</h4>
                                    <p className="text-orange-500 font-bold text-sm mb-2">{item.cost} Coins</p>
                                    <p className="text-gray-400 text-xs">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function WorkoutCard({ workout, onVerify, isVerifying }: { workout: Workout, onVerify: (id: number, count: number) => void, isVerifying: boolean }) {
    // Default to adminCount if verified, otherwise geminiCount (which is 0 now) or 0
    const initialCount = workout.status === 'VERIFIED' && workout.adminCount !== null
        ? workout.adminCount
        : (workout.geminiCount || 0);

    const [adminCount, setAdminCount] = useState<string>(initialCount.toString());

    return (
        <div className={`rounded-2xl overflow-hidden border shadow-xl flex flex-col transition-colors ${workout.status === 'VERIFIED'
            ? 'bg-gray-800 border-green-500/30'
            : 'bg-gray-800 border-yellow-500/30'
            }`}>
            <div className="relative aspect-video bg-black group">
                <video
                    src={workout.videoUrl}
                    controls
                    className="w-full h-full object-contain"
                    preload="metadata"
                />
                <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/60 text-[10px] font-bold uppercase backdrop-blur-md">
                    <span className={workout.status === 'VERIFIED' ? 'text-green-400' : 'text-yellow-400'}>
                        {workout.status}
                    </span>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="font-bold text-lg">{workout.userName}</h4>
                        <p className="text-xs text-gray-400">
                            {new Date(workout.createdAt!).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="mt-auto space-y-3">
                    <div>
                        <label className="text-xs text-gray-400 font-bold ml-1 mb-1 block">
                            {workout.status === 'VERIFIED' ? 'EDIT COUNT' : 'VERIFY COUNT'}
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setAdminCount(String(Math.max(0, parseInt(adminCount || '0') - 1)))}
                                className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors font-bold text-xl"
                            >
                                -
                            </button>
                            <input
                                type="number"
                                value={adminCount}
                                onChange={(e) => setAdminCount(e.target.value)}
                                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl text-center font-bold text-lg focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <button
                                onClick={() => setAdminCount(String(parseInt(adminCount || '0') + 1))}
                                className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors font-bold text-xl"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => onVerify(workout.id, parseInt(adminCount || '0'))}
                        disabled={isVerifying}
                        className={`w-full font-bold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 ${workout.status === 'VERIFIED'
                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                            : 'bg-green-600 hover:bg-green-500 text-white'
                            }`}
                    >
                        {isVerifying ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                {workout.status === 'VERIFIED' ? 'Update Count' : 'Verify Workout'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
