// import { motion } from 'framer-motion';
import { Button } from './Button';
import { ArrowLeft } from 'lucide-react';
import { TapeMeasure } from './TapeMeasure';
import { useState } from 'react';

interface Step5MetricsProps {
    height: number;
    setHeight: (h: number) => void;
    weight: number;
    setWeight: (w: number) => void;
    onNext: () => void;
    onBack: () => void;
}

export function Step5Metrics({ height, setHeight, weight, setWeight, onNext, onBack }: Step5MetricsProps) {
    const [focusedInput, setFocusedInput] = useState<'height' | 'weight' | null>(null);

    return (
        <div className="flex flex-col h-full p-6 bg-white text-[#192126]">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-[#192126]" />
                </button>
                <span className="mx-auto text-lg font-bold">Metrics</span>
                <div className="w-10"></div>
            </div>

            <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-1 flex-1 bg-[#BBF246] rounded-full"></div>
                ))}
                <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
            </div>

            {/* Content Container */}
            <div className="flex-1 flex flex-col justify-center gap-12 relative">
                {/* Note: Relative allows overlaying manual input fields if desired, but we'll stack them for clarity */}

                {/* Hiding the TapeMeasure's built-in text to use our own manual input */}

                {/* Height Section */}
                <div className="flex flex-col items-center">
                    <label className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Height</label>
                    <div className="relative flex items-end justify-center mb-6">
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            onFocus={() => setFocusedInput('height')}
                            onBlur={() => setFocusedInput(null)}
                            className={`text-7xl font-black bg-transparent text-center w-48 outline-none p-0 m-0 ${focusedInput === 'height' ? 'text-[#BBF246]' : 'text-[#192126]'} transition-colors`}
                        />
                        <span className="text-xl text-gray-400 font-bold mb-4 ml-1">cm</span>
                    </div>

                    <div className="w-full h-24 relative opacity-50 hover:opacity-100 transition-opacity">
                        <TapeMeasure
                            value={height}
                            onChange={setHeight}
                            min={100}
                            max={250}
                            step={50}
                            orientation="horizontal"
                            unit=""
                            label=""
                            showTickLabels={false}
                            showValue={false}
                        />
                    </div>
                </div>

                {/* Weight Section */}
                <div className="flex flex-col items-center">
                    <label className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Weight</label>
                    <div className="relative flex items-end justify-center mb-6">
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            onFocus={() => setFocusedInput('weight')}
                            onBlur={() => setFocusedInput(null)}
                            className={`text-7xl font-black bg-transparent text-center w-48 outline-none p-0 m-0 ${focusedInput === 'weight' ? 'text-[#BBF246]' : 'text-[#192126]'} transition-colors`}
                        />
                        <span className="text-xl text-gray-400 font-bold mb-4 ml-1">kg</span>
                    </div>

                    <div className="w-full h-24 relative opacity-50 hover:opacity-100 transition-opacity">
                        <TapeMeasure
                            value={weight}
                            onChange={setWeight}
                            min={30}
                            max={200}
                            step={50}
                            orientation="horizontal"
                            unit=""
                            label=""
                            showTickLabels={false}
                            showValue={false}
                        />
                    </div>
                </div>

            </div>

            <div className="mt-auto z-20 pt-6 border-t border-gray-100">
                <Button onClick={onNext}>
                    Next
                </Button>
            </div>
        </div>
    );
}
