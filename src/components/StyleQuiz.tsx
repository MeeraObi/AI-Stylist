"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { X, Heart, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface StyleCard {
    id: string;
    name: string;
    desc: string;
    img: string;
    isGenerated?: boolean;
}

const STATIC_CARDS = [
    { id: 'minimalist', name: 'Minimalist', desc: 'Clean lines, neutral colors, and essential pieces.', img: '/assets/styles/minimalist.png' },
    { id: 'trendy', name: 'Trendy', desc: 'Latest fashion-forward pieces and bold statements.', img: '/assets/styles/trendy.png' },
    { id: 'preppy', name: 'Preppy', desc: 'Timeless staples that never go out of style.', img: '/assets/styles/preppy.png' },
    { id: 'bohemian', name: 'Bohemian', desc: 'Free-spirited, earthy tones, and relaxed silhouettes.', img: '/assets/styles/bohemian.png' },
    { id: 'formal', name: 'Formal', desc: 'Sophisticated, sharp, and business-ready attire.', img: '/assets/styles/formal.png' }
];

export default function StyleQuiz() {
    const { setScreen, setQuizSelections } = useStylistStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [likes, setLikes] = useState<string[]>([]);
    const [direction, setDirection] = useState(0);
    const [cards] = useState<StyleCard[]>(STATIC_CARDS);

    // Motion values for swipe gestures
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const opacityLike = useTransform(x, [0, 100], [0, 1]);
    const opacityNope = useTransform(x, [0, -100], [0, 1]);
    const bgLike = useTransform(x, [0, 150], ["rgba(255,255,255,0)", "rgba(74, 222, 128, 0.2)"]);
    const bgNope = useTransform(x, [0, -150], ["rgba(255,255,255,0)", "rgba(248, 113, 113, 0.2)"]);

    // Reset x when index changes
    useEffect(() => {
        x.set(0);
    }, [currentIndex, x]);

    const handleAction = async (like: boolean) => {
        if (like) {
            setLikes(prev => [...prev, cards[currentIndex].id]);
        }

        setDirection(like ? 1 : -1);

        // Allow animation to complete before switching
        await new Promise(r => setTimeout(r, 200));

        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            const finalLikes = like ? [...likes, cards[currentIndex].id] : likes;
            setQuizSelections(finalLikes);

            // Save to Supabase
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { error } = await supabase
                    .from('profiles')
                    .update({ style_preferences: finalLikes })
                    .eq('id', user.id);

                if (error) console.error("Error saving style preferences:", error);
            }

            setScreen("dashboard");
        }
    };

    const handleDragEnd = (_: any, info: any) => {
        const threshold = 100;
        if (info.offset.x > threshold) {
            handleAction(true);
        } else if (info.offset.x < -threshold) {
            handleAction(false);
        }
    };

    const card = cards[currentIndex];

    return (
        <div className="screen pt-6 flex flex-col h-full bg-white">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Style Quiz</h2>
                    <p className="text-gray-400 text-xs">Swipe to refine your DNA</p>
                </div>
                <div className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-bold">
                    {currentIndex + 1} / {cards.length}
                </div>
            </div>

            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                        key={card.id}
                        style={{ x, rotate, zIndex: 10 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragSnapToOrigin
                        onDragEnd={handleDragEnd}
                        initial={{ scale: 0.9, opacity: 0, x: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                        exit={{
                            x: direction * 500,
                            opacity: 0,
                            scale: 0.8,
                            transition: { duration: 0.2 }
                        }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="w-full max-w-[320px] aspect-[3/4] bg-white rounded-[32px] overflow-hidden shadow-xl border border-gray-100 flex flex-col relative cursor-grab active:cursor-grabbing"
                    >
                        {/* Overlay Indicators */}
                        <motion.div style={{ opacity: opacityLike }} className="absolute top-6 left-6 z-20 bg-green-500/90 text-white p-3 rounded-full backdrop-blur-sm">
                            <Heart size={32} fill="currentColor" />
                        </motion.div>
                        <motion.div style={{ opacity: opacityNope }} className="absolute top-6 right-6 z-20 bg-red-500/90 text-white p-3 rounded-full backdrop-blur-sm">
                            <X size={32} />
                        </motion.div>
                        <motion.div style={{ backgroundColor: bgLike }} className="absolute inset-0 z-10 pointer-events-none" />
                        <motion.div style={{ backgroundColor: bgNope }} className="absolute inset-0 z-10 pointer-events-none" />

                        <div className="flex-1 relative pointer-events-none">
                            <img src={card.img} alt={card.name} className="absolute inset-0 w-full h-full object-cover" />
                            {card.isGenerated && (
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30">
                                    <Sparkles size={16} className="text-white" />
                                </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 pt-20">
                                <h3 className="text-white text-2xl font-bold mb-1">{card.name}</h3>
                                <p className="text-gray-200 text-sm leading-relaxed">{card.desc}</p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex justify-center gap-6 py-10 z-20">
                <button
                    onClick={() => handleAction(false)}
                    className="h-16 w-16 rounded-full bg-white border border-gray-100 shadow-lg flex items-center justify-center text-gray-400 active:scale-90 transition-transform hover:bg-red-50 hover:border-red-100 hover:text-red-500"
                >
                    <X size={32} />
                </button>
                <button
                    onClick={() => handleAction(true)}
                    className="h-16 w-16 rounded-full bg-gray-100 border border-gray-200 shadow-lg flex items-center justify-center text-gray-400 active:scale-90 transition-transform hover:bg-green-50 hover:border-green-100 hover:text-green-500"
                >
                    <Heart size={32} />
                </button>
            </div>
        </div>
    );
}
