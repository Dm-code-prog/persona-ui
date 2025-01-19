"use client"

import {motion} from "framer-motion"

export default function Loader() {
    return (
        <div className="inset-0 flex items-center justify-center bg-background">
            <div className="relative w-32 h-32">
                {[...Array(3)].map((_, index) => (
                    <motion.span
                        key={index}
                        className="absolute inset-0 border-4 border-transparent border-t-cyan-500 rounded-full"
                        style={{
                            borderWidth: 4 - index,
                            zIndex: 3 - index,
                        }}
                        animate={{
                            rotate: 360,
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear",
                            delay: index * 0.1,
                        }}
                    />
                ))}
                <motion.div
                    className="absolute inset-2 flex items-center justify-center"
                    initial={{scale: 0.5, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                    }}
                >
                    <svg
                        className="w-16 h-16 text-purple-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                    </svg>
                </motion.div>
            </div>
        </div>
    )
}

