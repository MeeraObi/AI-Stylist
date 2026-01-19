"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { Check, X, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { useState, useMemo } from "react";
import Image from "next/image";

export default function InitialCheck() {
    const { preliminaryResults, setScreen, setLoading, userBlob, setComprehensiveResults } = useStylistStore();
    const [viewMode, setViewMode] = useState<"current" | "tweak">("current");
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    const handleStartQuiz = async () => {
        setScreen("signup");
    };

    const results = preliminaryResults || {
        works: "Replace Top. Great Jumper. Perfect Boots.",
        tweaks: "Loose Trousers. Scarf Mismatch.",
        accessories: "Add a silver watch. Use a leather belt.",
        grooming: "Trim beard for sharper look. Use matte hair product.",
        posture: "Stand straighter to show confidence. Shoulders back."
    };

    // Helper to parse sentences and assign rough position
    const parseFeedback = (text: string, type: "works" | "tweaks") => {
        const sentences = text.split('.').map(s => s.trim()).filter(s => s.length > 0);

        return sentences.map((sentence, idx) => {
            const lower = sentence.toLowerCase();
            let position = "top: 50%;"; // default middle

            if (lower.match(/top|shirt|jacket|face|hair|neck|hat|glasses|makeup|shoulders/)) {
                position = `top: ${20 + (idx * 10)}%;`;
            } else if (lower.match(/shoe|boot|sneaker|heel|leg|pant|trouser|skirt|sock|bottom/)) {
                position = `top: ${70 + (idx * 10)}%;`;
            } else {
                position = `top: ${45 + (idx * 15)}%;`;
            }

            // Pseudo-random horizontal placement for visual variety
            const isLeft = idx % 2 === 0;
            const horizontal = isLeft ? "left: 5%;" : "right: 5%;";

            return {
                id: idx,
                text: sentence,
                type,
                style: position + horizontal
            };
        });
    };

    const feedbackItems = useMemo(() => {
        if (viewMode === "current") {
            return parseFeedback(results.works, "works");
        } else {
            return parseFeedback(results.tweaks, "tweaks");
        }
    }, [viewMode, results]);


    const AccordionItem = ({ title, content, id }: { title: string, content: string, id: string }) => (
        <div className="border border-gray-100 rounded-xl mb-3 overflow-hidden bg-white">
            <button
                onClick={() => setOpenAccordion(openAccordion === id ? null : id)}
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
            >
                <span className="font-bold text-sm uppercase tracking-wider text-gray-500">{title}</span>
                {openAccordion === id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </button>
            {openAccordion === id && (
                <div className="p-4 pt-0 text-sm text-gray-600 leading-relaxed bg-white">
                    {content}
                </div>
            )}
        </div>
    );

    const imageUrl = userBlob ? URL.createObjectURL(userBlob) : null;

    return (
        <div className="screen pt-6 pb-32">
            <h2 className="text-3xl font-extrabold mb-1 tracking-tight">Initial Check</h2>
            <p className="text-gray-500 mb-6 text-sm">Nia&apos;s first impression based on your scan</p>

            {/* Toggle */}
            <div className="flex items-center gap-6 mb-6">
                <button
                    onClick={() => setViewMode("current")}
                    className="flex items-center gap-2 group"
                >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${viewMode === "current" ? "border-black" : "border-gray-300"}`}>
                        {viewMode === "current" && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                    </div>
                    <span className={`text-sm font-semibold ${viewMode === "current" ? "text-black" : "text-gray-400"}`}>Your Current Style</span>
                </button>

                <button
                    onClick={() => setViewMode("tweak")}
                    className="flex items-center gap-2 group"
                >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${viewMode === "tweak" ? "border-black" : "border-gray-300"}`}>
                        {viewMode === "tweak" && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                    </div>
                    <span className={`text-sm font-semibold ${viewMode === "tweak" ? "text-black" : "text-gray-400"}`}>Required Tweek</span>
                </button>
            </div>

            {/* Image Area */}
            <div className="relative w-full aspect-[9/16] bg-gray-100 rounded-2xl overflow-hidden mb-6 shadow-sm">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt="User Scan"
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Uploaded</div>
                )}

                {/* Overlays */}
                {feedbackItems.map((item) => (
                    <div
                        key={item.id}
                        className={`absolute flex items-start gap-1.5 px-2.5 py-1.5 rounded-[8px] shadow-sm text-[11px] font-bold z-10 animate-in fade-in zoom-in duration-300 max-w-[140px]`}
                        style={{
                            top: item.style.split(';')[0].split(':')[1],
                            left: item.style.includes('left') ? '8px' : 'auto',
                            right: item.style.includes('right') ? '8px' : 'auto',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)'
                        }}
                    >
                        <span className="leading-tight text-left">{item.text}</span>
                        {item.type === "works" ? (
                            <div className="bg-green-100 rounded-full p-[2px] shrink-0 mt-0.5">
                                <Check size={10} className="text-green-600" strokeWidth={3} />
                            </div>
                        ) : (
                            <div className="bg-red-100 rounded-full p-[2px] shrink-0 mt-0.5">
                                <X size={10} className="text-red-500" strokeWidth={3} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Accordion */}
            <div className="mb-8">
                <AccordionItem id="acc" title="ACCESSORIES" content={results.accessories} />
                <AccordionItem id="groom" title="GROOMING" content={results.grooming} />
                <AccordionItem id="posture" title="POSTURE" content={results.posture} />
            </div>

            {/* Subscribe Card */}
            <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100">
                <h3 className="text-lg font-bold mb-2">Subscribe to Nia</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">Unlock detailed DNA analysis and AI-powered wardrobe planning</p>
                <button className="bg-[#2A2A2A] text-white w-full py-4 rounded-xl font-semibold text-sm hover:bg-black transition-colors" onClick={handleStartQuiz}>
                    Complete DNA Scan
                </button>
            </div>
        </div>
    );
}
