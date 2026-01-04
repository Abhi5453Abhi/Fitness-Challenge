import { motion, AnimatePresence } from 'framer-motion';
import { Search, ScanBarcode, Mic, Camera, Droplet, Scale, Flame, X } from 'lucide-react';

interface ActionMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onLogFood: () => void;
}

export function ActionMenu({ isOpen, onClose, onLogFood }: ActionMenuProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    />

                    {/* Bottom Sheet */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] p-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
                    >
                        <div className="flex justify-center mb-8">
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
                        </div>

                        {/* Grid Actions */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                onClick={onLogFood}
                                className="bg-[#F8F9FA] p-6 rounded-3xl flex flex-col items-center gap-3 hover:bg-white hover:shadow-lg hover:shadow-gray-200 transition-all border border-transparent hover:border-gray-100"
                            >
                                <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center">
                                    <Search className="w-7 h-7 text-indigo-500" />
                                </div>
                                <span className="font-bold text-[#192126]">Log Food</span>
                            </button>
                            <button className="bg-[#F8F9FA] p-6 rounded-3xl flex flex-col items-center gap-3 hover:bg-white hover:shadow-lg hover:shadow-gray-200 transition-all border border-transparent hover:border-gray-100">
                                <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
                                    <ScanBarcode className="w-7 h-7 text-rose-500" />
                                </div>
                                <span className="font-bold text-[#192126]">Barcode Scan</span>
                            </button>
                            <button className="bg-[#F8F9FA] p-6 rounded-3xl flex flex-col items-center gap-3 hover:bg-white hover:shadow-lg hover:shadow-gray-200 transition-all border border-transparent hover:border-gray-100">
                                <div className="w-14 h-14 rounded-full bg-violet-50 flex items-center justify-center">
                                    <Mic className="w-7 h-7 text-violet-500" />
                                </div>
                                <span className="font-bold text-[#192126]">Voice Log</span>
                            </button>
                            <button className="bg-[#F8F9FA] p-6 rounded-3xl flex flex-col items-center gap-3 hover:bg-white hover:shadow-lg hover:shadow-gray-200 transition-all border border-transparent hover:border-gray-100">
                                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                                    <Camera className="w-7 h-7 text-emerald-500" />
                                </div>
                                <span className="font-bold text-[#192126]">Meal Scan</span>
                            </button>
                        </div>

                        {/* List Actions */}
                        <div className="bg-[#F8F9FA] rounded-3xl overflow-hidden mb-8">
                            <button className="w-full flex items-center gap-4 p-5 hover:bg-white transition-colors border-b border-gray-100">
                                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                                    <Droplet className="w-4 h-4 text-sky-500 fill-sky-500" />
                                </div>
                                <span className="text-[#192126] font-bold text-lg">Water</span>
                            </button>
                            <button className="w-full flex items-center gap-4 p-5 hover:bg-white transition-colors border-b border-gray-100">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <Scale className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                                </div>
                                <span className="text-[#192126] font-bold text-lg">Weight</span>
                            </button>
                            <button className="w-full flex items-center gap-4 p-5 hover:bg-white transition-colors">
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                                </div>
                                <span className="text-[#192126] font-bold text-lg">Exercise</span>
                            </button>
                        </div>

                        <div className="flex justify-center">
                            <button onClick={onClose} className="p-4 bg-gray-100 rounded-full hover:bg-gray-200 text-[#192126] transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
