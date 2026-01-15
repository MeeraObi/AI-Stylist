"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function SplashScreen() {
    const { setScreen } = useStylistStore();

    useEffect(() => {
        const timer = setTimeout(() => {
            setScreen("onboarding");
        }, 2000);
        return () => clearTimeout(timer);
    }, [setScreen]);

    return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-white p-8">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-5xl font-extrabold tracking-tighter"
            >
                Nia<span className="text-gray-400">.</span>
            </motion.div>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-4 text-gray-400 font-medium tracking-wide uppercase text-xs"
            >
                Your Personal AI Stylist
            </motion.p>
        </div>
    );
}
