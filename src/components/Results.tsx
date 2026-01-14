"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { ArrowLeft, Sparkles, Shirt, Plane, Users, Scissors } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Results() {
    const { comprehensiveResults, setScreen, setLoading, userBlob } = useStylistStore();
    const [visualizedImg, setVisualizedImg] = useState<string | null>(null);
    const [activePrompt, setActivePrompt] = useState<string | null>(null);

    const handleVisualize = async (prompt: string) => {
        if (!userBlob) return;
        setLoading(true, "Visualizing...");
        setActivePrompt(prompt);

        const fd = new FormData();
        // Just send the outfit desc, API handles the photographic consistency prompts
        fd.append("prompt", prompt);
        fd.append("ref_image", userBlob);

        try {
            const res = await fetch("/api/generate-image", {
                method: "POST",
                body: fd,
            });
            const data = await res.json();
            if (data.image) setVisualizedImg(data.image);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const looks = [
        { label: "Work", icon: Shirt, desc: comprehensiveResults?.first_looks?.work || "Professional Suiting" },
        { label: "Travel", icon: Plane, desc: comprehensiveResults?.first_looks?.travel || "Comfortable Airport Style" },
        { label: "Social", icon: Users, desc: comprehensiveResults?.first_looks?.social || "Evening Casual" }
    ];

    return (
        <div className="screen pt-6 pb-20">
            <div className="flex items-center gap-3 mb-8">
                <button onClick={() => setScreen("dashboard")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold tracking-tight">Style DNA</h2>
            </div>

            <div className="tile bg-black text-white border-none p-8 mb-8 relative overflow-hidden">
                <Sparkles className="absolute -right-4 -top-4 h-24 w-24 text-white/5 rotate-12" />
                <span className="label-nia text-gray-400 mb-2">Style Profile</span>
                <p className="text-xl font-medium leading-relaxed italic">
                    &quot;{comprehensiveResults?.profile_writeup?.summary || "Your unique style profile is ready."}&quot;
                </p>
            </div>

            <h3 className="label-nia text-black mb-4">Occasions & Looks</h3>
            <div className="space-y-4 mb-10">
                {looks.map((look, idx) => (
                    <div key={idx} className="tile p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-gray-50 p-2 rounded-lg">
                                <look.icon size={18} className="text-gray-400" />
                            </div>
                            <strong className="text-sm uppercase tracking-widest">{look.label}</strong>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">{look.desc}</p>
                        <button
                            className="btn-nia-outline flex items-center justify-center gap-2 py-3 text-sm border-black"
                            onClick={() => handleVisualize(look.desc)}
                        >
                            <Scissors size={14} /> Visualize on Me
                        </button>
                    </div>
                ))}
            </div>

            {visualizedImg && (
                <div className="tile p-0 overflow-hidden border-2 border-black mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-4 bg-black text-white flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                        <span>Visualization Result</span>
                        <button onClick={() => setVisualizedImg(null)} className="opacity-60 hover:opacity-100">Close</button>
                    </div>
                    <div className="relative aspect-[3/4] w-full">
                        <Image src={`data:image/jpeg;base64,${visualizedImg}`} alt="Visualized Look" fill className="object-cover" />
                    </div>
                    <div className="p-4 bg-gray-50 italic text-[10px] text-gray-500 leading-relaxed">
                        {activePrompt}
                    </div>
                </div>
            )}

            <div className="tile bg-[#f0f9ff] border-[#e0f2fe] p-6 text-center">
                <h4 className="text-blue-900 font-bold mb-2">Physical Description Analysis</h4>
                <p className="text-blue-700/80 text-xs leading-relaxed italic">
                    {comprehensiveResults?.physical_desc || "No comprehensive physical analysis data found."}
                </p>
                <button
                    className="mt-4 text-[10px] font-bold uppercase tracking-widest text-blue-900 hover:underline"
                    onClick={() => setScreen("grooming")}
                >
                    View Grooming Details →
                </button>
            </div>
        </div>
    );
}
