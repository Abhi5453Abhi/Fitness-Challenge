import { motion } from 'framer-motion';
import { Dumbbell, Apple, Droplets, Activity, Heart, Flame, Trophy, Timer } from 'lucide-react';

const icons = [
    { Icon: Dumbbell, color: '#BBF246', size: 48, initialX: '10%' },
    { Icon: Apple, color: '#A48AED', size: 40, initialX: '80%' },
    { Icon: Droplets, color: '#95CCE3', size: 36, initialX: '20%' },
    { Icon: Activity, color: '#ED4747', size: 52, initialX: '70%' },
    { Icon: Heart, color: '#FCC46F', size: 32, initialX: '40%' },
    { Icon: Flame, color: '#ED4747', size: 44, initialX: '15%' },
    { Icon: Trophy, color: '#BBF246', size: 56, initialX: '85%' },
    { Icon: Timer, color: '#A48AED', size: 38, initialX: '60%' },
    { Icon: Dumbbell, color: '#BBF246', size: 42, initialX: '30%' },
    { Icon: Apple, color: '#A48AED', size: 38, initialX: '90%' },
    { Icon: Droplets, color: '#95CCE3', size: 34, initialX: '5%' },
    { Icon: Activity, color: '#ED4747', size: 48, initialX: '50%' },
    { Icon: Heart, color: '#FCC46F', size: 30, initialX: '25%' },
    { Icon: Flame, color: '#ED4747', size: 40, initialX: '75%' },
    { Icon: Trophy, color: '#BBF246', size: 50, initialX: '95%' },
    { Icon: Timer, color: '#A48AED', size: 36, initialX: '55%' },
];

export function BackgroundAnimation() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Fast Scrolling Icons */}
            {icons.map((item, index) => {
                const duration = 4 + Math.random() * 4; // 4-8 seconds
                const delay = -Math.random() * duration; // Start mid-animation

                return (
                    <motion.div
                        key={index}
                        className="absolute z-0 opacity-50" // Increased opacity
                        style={{
                            left: item.initialX,
                            top: "100%", // Start position (conceptually)
                            color: item.color,
                        }}
                        animate={{
                            y: ["0vh", "-120vh"], // Move up
                        }}
                        transition={{
                            duration: duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: delay, // Negative delay to pre-warm
                        }}
                    >
                        <item.Icon size={item.size} />
                    </motion.div>
                );
            })}

            {/* Subtle Pulse Circles */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#BBF246] rounded-full filter blur-[100px] opacity-5 z-0"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.05, 0.08, 0.05],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#A48AED] rounded-full filter blur-[100px] opacity-5 z-0"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.05, 0.08, 0.05],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />
        </div>
    );
}
