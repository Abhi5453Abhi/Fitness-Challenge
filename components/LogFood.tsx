import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Search, ScanBarcode, Mic, Camera, Plus, ChevronDown, CheckCircle2, Zap } from 'lucide-react';

interface LogFoodProps {
    isOpen: boolean;
    onClose: () => void;
}

const SUGGESTIONS = [
    { name: "Roti", cal: 120, detail: "1 medium", verified: true },
    { name: "Chapati", cal: 120, detail: "50 gram, Homemade", verified: true },
    { name: "Sugar", cal: 16, detail: "1 teaspoon", verified: true },
    { name: "Ghee", cal: 40, detail: "1 teaspoon", verified: true },
    { name: "Almonds", cal: 164, detail: "1 ounce", verified: true },
    { name: "Curd (Dahi) 200gm", cal: 122, detail: "200 gms, Curd", verified: false },
    { name: "Egg white", cal: 17, detail: "1 large", verified: true },
];

export function LogFood({ isOpen, onClose }: LogFoodProps) {
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-50 flex flex-col text-[#192126]"
        >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-white z-10">
                <button onClick={onClose} className="p-2 -ml-2 text-[#192126] hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                </button>
                <button className="flex items-center gap-1 font-bold text-[#192126]">
                    Select a Meal <ChevronDown className="w-4 h-4" />
                </button>
                <div className="w-8"></div> {/* Spacer for alignment */}
            </div>

            {/* Search Bar */}
            <div className="p-4 bg-white">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Food"
                        className="w-full bg-[#F8F9FA] text-[#192126] pl-12 pr-10 py-4 rounded-2xl border-none focus:ring-2 focus:ring-[#BBF246] outline-none text-base font-medium placeholder:text-gray-400 transition-all font-sans"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#192126] transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="px-4 flex gap-8 border-b border-gray-100 text-sm font-bold overflow-x-auto no-scrollbar bg-white">
                {['All', 'My Meals', 'My Recipes', 'My Foods'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 whitespace-nowrap transition-colors relative ${activeTab === tab
                            ? 'text-[#192126]'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BBF246]"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="p-6 grid grid-cols-4 gap-4 bg-white">
                <button className="bg-[#F8F9FA] p-3 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors aspect-square">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <ScanBarcode className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold text-center leading-tight">Barcode</span>
                </button>
                <button className="bg-[#F8F9FA] p-3 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors aspect-square">
                    <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center">
                        <Mic className="w-5 h-5 text-violet-500" />
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold text-center leading-tight">Voice</span>
                </button>
                <button className="bg-[#F8F9FA] p-3 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors aspect-square">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                        <Camera className="w-5 h-5 text-emerald-500" />
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold text-center leading-tight">Scan</span>
                </button>
                <button className="bg-[#F8F9FA] p-3 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors aspect-square">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-orange-500" />
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold text-center leading-tight">Quick Add</span>
                </button>
            </div>

            {/* Suggestions */}
            <div className="flex-1 overflow-y-auto px-4 pb-20 bg-white">
                <h3 className="text-lg font-black mb-4">Suggestions</h3>
                <div className="space-y-3">
                    {SUGGESTIONS.map((item, index) => (
                        <div key={index} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between group hover:border-[#BBF246] transition-colors shadow-sm">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-[#192126]">{item.name}</span>
                                    {item.verified && <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />}
                                </div>
                                <div className="text-sm text-gray-500 font-medium">
                                    {item.cal} cal, {item.detail}
                                </div>
                            </div>
                            <button className="w-10 h-10 rounded-full bg-[#F8F9FA] flex items-center justify-center text-[#192126] hover:bg-[#BBF246] transition-all group-hover:scale-110">
                                <Plus className="w-6 h-6" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
