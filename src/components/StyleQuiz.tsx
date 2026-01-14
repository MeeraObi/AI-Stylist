"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { X, Heart, Sparkles, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StyleCard {
    id: string;
    name: string;
    desc: string;
    img: string;
    isGenerated?: boolean;
}

const STATIC_CARDS = [
    { id: 'minimalist', name: 'Minimalist', desc: 'Clean lines, neutral colors, and essential pieces.', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop' },
    { id: 'trendy', name: 'Trendy', desc: 'Latest fashion-forward pieces and bold statements.', img: 'https://images.unsplash.com/photo-1539109132314-3477524c8830?q=80&w=1000&auto=format&fit=crop' },
    { id: 'preppy', name: 'Preppy', desc: 'Timeless staples that never go out of style.', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop' },
    { id: 'bohemian', name: 'Bohemian', desc: 'Free-spirited, earthy tones, and relaxed silhouettes.', img: 'https://images.unsplash.com/photo-1574015974293-817f0efebb1b?q=80&w=1000&auto=format&fit=crop' },
    { id: 'formal', name: 'Formal', desc: 'Sophisticated, sharp, and business-ready attire.', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop' }
];

export default function StyleQuiz() {
    const { setScreen, setQuizSelections, userBlob } = useStylistStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [likes, setLikes] = useState<string[]>([]);
    const [direction, setDirection] = useState(0);
    const [cards, setCards] = useState<StyleCard[]>(STATIC_CARDS);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const fetchPersonalizedCards = async () => {
            if (!userBlob) return;

            setIsGenerating(true);
            const fd = new FormData();
            fd.append("ref_image", userBlob);

            try {
                const res = await fetch("/api/generate-quiz-images", {
                    method: "POST",
                    body: fd,
                });
                const data = await res.json();

                if (data.images && data.images.length > 0) {
                    const newCards = STATIC_CARDS.map(staticCard => {
                        const generated = data.images.find((img: any) => img.style === staticCard.id);
                        if (generated) {
                            return {
                                ...staticCard,
                                img: `data:image/jpeg;base64,${generated.image}`,
                                isGenerated: true
                            };
                        }
                        return staticCard;
                    });
                    setCards(newCards);
                }
            } catch (err) {
                console.error("Error fetching personalized cards:", err);
            } finally {
                setIsGenerating(false);
            }
        };

        fetchPersonalizedCards();
    }, [userBlob]);

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
            setScreen("results");
        }
    };

    const card = cards[currentIndex];

    if (isGenerating && currentIndex === 0) {
        return (
            <div className="loader-overlay flex flex-col items-center justify-center bg-white z-50">
                <div className="relative mb-8">
                    <Loader2 className="h-16 w-16 animate-spin text-black" />
                    <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">Personalizing your DNA</h3>
                <p className="text-gray-500 text-sm max-w-[200px] text-center leading-relaxed">
                    Nia is curating style options based on your unique features...
                </p>
            </div>
        );
    }

    return (
        <div className="screen pt-6 flex flex-col h-full bg-[#fafafa]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Style Quiz</h2>
                    <p className="text-gray-400 text-xs">Swipe to refine your DNA</p>
                </div>
                <div className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-bold">
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
                    className="h-16 w-16 rounded-full bg-black shadow-lg flex items-center justify-center text-white active:scale-90 transition-transform"
                >
                    <Heart size={32} fill="white" />
                </button>
            </div>
        </div>
    );
}
