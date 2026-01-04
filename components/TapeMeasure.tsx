import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface TapeMeasureProps {
    value: number;
    onChange: (val: number) => void;
    min: number;
    max: number;
    step?: number; // pixels per unit
    orientation?: 'horizontal' | 'vertical';
    unit?: string;
    label?: string;
    showTickLabels?: boolean;
    labelPosition?: 'top' | 'bottom';
    showValue?: boolean;
    transparent?: boolean;
}

export function TapeMeasure({
    value,
    onChange,
    min,
    max,
    step = 50,
    orientation = 'horizontal',
    unit = '',
    label = '',
    showTickLabels = true,
    labelPosition = 'top',
    showValue = true,
    transparent = false
}: TapeMeasureProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const motionVal = useMotionValue(0);
    const smoothVal = useSpring(motionVal, { stiffness: 400, damping: 40 });

    const isHorizontal = orientation === 'horizontal';
    const ticks = Array.from({ length: (max - min) + 1 }, (_, i) => min + i);

    useEffect(() => {
        const index = value - min;
        const targetPos = -index * step;
        motionVal.set(targetPos);
    }, [value, min, step, motionVal]);

    const handleDrag = (_: any, info: any) => {
        const delta = isHorizontal ? info.delta.x : info.delta.y;
        const current = motionVal.get();
        motionVal.set(current + delta);

        const rawIndex = -motionVal.get() / step;
        const rawValue = rawIndex + min;
        const clamped = Math.round(Math.min(max, Math.max(min, rawValue)));

        if (clamped !== value) {
            onChange(clamped);
        }
    };

    const ValueDisplay = () => (
        <div className={`text-center z-10 ${labelPosition === 'top' ? 'mb-6' : 'mt-6'}`}>
            {label && labelPosition === 'top' && <div className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">{label}</div>}
            <div>
                <span className="text-5xl font-black tracking-tighter text-[#192126]">
                    {value}
                </span>
                {unit && <span className="text-xl text-gray-400 font-bold ml-2">{unit}</span>}
            </div>
            {label && labelPosition === 'bottom' && <div className="text-gray-400 font-bold uppercase tracking-wider text-xs mt-1">{label}</div>}
        </div>
    );

    return (
        <div className={`flex flex-col items-center justify-center ${isHorizontal ? 'w-full' : 'h-full'}`}>

            {showValue && labelPosition === 'top' && <ValueDisplay />}

            {/* Tape Window */}
            <div className={`relative overflow-hidden flex items-center justify-center mask-linear-fade border-y-2 border-gray-100 ${transparent ? 'bg-transparent' : 'bg-white'} ${isHorizontal ? 'w-full h-24' : 'w-24 h-80'
                }`}>
                {/* Gradients - Only show if not transparent (avoid white fog) */}
                {!transparent && isHorizontal ? (
                    <>
                        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
                        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />
                        {/* Indicator - Center Vertical */}
                        <div className="absolute h-10 w-1 bg-[#BBF246] rounded-full z-30 shadow-md" />
                    </>
                ) : !transparent && !isHorizontal ? (
                    <>
                        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white to-transparent z-20 pointer-events-none" />
                        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />
                        {/* Indicator - Center Horizontal */}
                        <div className="absolute w-10 h-1 bg-[#BBF246] rounded-full z-30 shadow-md" />
                    </>
                ) : (
                    /* Transparent Mode Indicators without gradients */
                    isHorizontal ? (
                        <div className="absolute h-10 w-1 bg-[#BBF246] rounded-full z-30 shadow-md" />
                    ) : (
                        <div className="absolute w-10 h-1 bg-[#BBF246] rounded-full z-30 shadow-md" />
                    )
                )}

                {/* Draggable Track */}
                <motion.div
                    ref={containerRef}
                    className={`flex absolute items-center justify-center cursor-grab active:cursor-grabbing ${isHorizontal ? 'flex-row left-1/2 h-full' : 'flex-col top-1/2 w-full'}`}
                    style={isHorizontal ? { x: smoothVal } : { y: smoothVal }}
                    drag={isHorizontal ? 'x' : 'y'}
                    dragConstraints={isHorizontal ? { left: -10000, right: 10000 } : { top: -10000, bottom: 10000 }}
                    dragElastic={0}
                    dragMomentum={false}
                    onDrag={handleDrag}
                >
                    {ticks.map((val) => (
                        <div
                            key={val}
                            className={`flex shrink-0 items-center justify-center relative ${isHorizontal
                                ? 'flex-col justify-end h-12'
                                : 'flex-row justify-end w-12'
                                }`}
                            style={isHorizontal ? { width: step } : { height: step }}
                        >
                            {/* Tick Line */}
                            <div className={`rounded-full ${isHorizontal
                                ? `w-[2px] ${val % 10 === 0 ? 'h-8 bg-gray-300' : 'h-4 bg-gray-100'}`
                                : `h-[2px] ${val % 10 === 0 ? 'w-8 bg-gray-300' : 'w-4 bg-gray-100'}`
                                }`} />

                            {/* Number Label */}
                            {val % 10 === 0 && showTickLabels && (
                                <span className={`absolute text-xs text-gray-400 font-bold font-mono ${isHorizontal
                                    ? '-bottom-6'
                                    : 'right-10'
                                    }`}>
                                    {val}
                                </span>
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>

            {showValue && labelPosition === 'bottom' && <ValueDisplay />}
        </div>
    );
}
