"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { X, Heart, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

    const handleAction = (like: boolean) => {
        if (like) {
            setLikes(prev => [...prev, cards[currentIndex].id]);
        }

        setDirection(like ? 1 : -1);

        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            const finalLikes = like ? [...likes, cards[currentIndex].id] : likes;
            setQuizSelections(finalLikes);
            setScreen("dashboard");
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

            <div className="flex-1 relative flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={card.id}
                        initial={{ scale: 0.9, opacity: 0, x: direction * 50 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        exit={{ scale: 0.9, opacity: 0, x: -direction * 50 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="w-full max-w-[320px] aspect-[3/4] bg-white rounded-[32px] overflow-hidden shadow-xl border border-gray-100 flex flex-col"
                    >
                        <div className="flex-1 relative">
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

            <div className="flex justify-center gap-6 py-10">
                <button
                    onClick={() => handleAction(false)}
                    className="h-16 w-16 rounded-full bg-white border border-gray-100 shadow-lg flex items-center justify-center text-gray-400 active:scale-90 transition-transform"
                >
                    <X size={32} />
                </button>
                <button
                    onClick={() => handleAction(true)}
                    className="h-16 w-16 rounded-full bg-gray-100 border border-gray-200 shadow-lg flex items-center justify-center text-gray-400 active:scale-90 transition-transform"
                >
                    <Heart size={32} />
                </button>
            </div>
        </div>
    );
}
