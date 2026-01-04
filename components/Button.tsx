import { motion, type HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
}

export function Button({ children, className = '', ...props }: ButtonProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 px-6 btn-primary text-lg ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
}
