"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Results() {
    const { comprehensiveResults, setScreen, setLoading, userBlob, setSelectedDailyLook } = useStylistStore();
    const [activeTab, setActiveTab] = useState<"Work" | "Travel" | "Social">("Work");
    const [visualizedImg, setVisualizedImg] = useState<string | null>(null);

    const handleVisualize = async () => {
        if (!userBlob) return;
        const prompt = comprehensiveResults?.first_looks?.[activeTab.toLowerCase() as keyof typeof comprehensiveResults.first_looks];
        if (!prompt) return;

        setLoading(true, "Visualizing...");
        const fd = new FormData();
        fd.append("prompt", prompt);
        fd.append("ref_image", userBlob);

        try {
            const res = await fetch("/api/generate-image", {
                method: "POST",
                body: fd,
            });
            const data = await res.json();
            if (data.image) {
                setVisualizedImg(data.image);
                // Save this as the daily look
                setSelectedDailyLook({
                    desc: prompt,
                    img: data.image
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const styleSummary = comprehensiveResults?.profile_writeup?.summary ||
        "Your unique style DNA favors tailored pieces in neutral colors that emphasize a polished image. Your style transcends seasonal trends, relying instead on timeless designs that showcase confidence and poise. You are drawn to quality fabrics and impeccable tailoring, ensuring that your look is always refined. Your style communicates professionalism and approachability, creating a welcoming atmosphere for colleagues and clients alike. Whether you are presenting to executives or attending networking events, your sophisticated style makes for a captivating and respected presence.";

    return (
        <div className="screen pt-12 pb-24">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-extrabold tracking-tighter mb-2">Style DNA</h1>
                <p className="text-gray-400 text-xs">Your personalized style blueprint.</p>
            </div>

            {/* Style DNA Narrative */}
            <div className="tile p-8 mb-12 bg-white shadow-sm border border-gray-100 rounded-[32px]">
                <p className="text-sm leading-[1.8] text-gray-700 font-medium">
                    {styleSummary}
                </p>
            </div>

            <div className="mb-12">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 block text-center">LOOK SUGGESTIONS</span>

                {/* Tabs */}
                <div className="flex gap-2 justify-center mb-8">
                    {(["Work", "Travel", "Social"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                setVisualizedImg(null);
                            }}
                            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === tab
                                ? "bg-white text-black shadow-sm border border-gray-100"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Look Card */}
                <div className="tile p-8 bg-gray-50/50 border-none rounded-[32px] text-center">
                    <h3 className="text-lg font-bold mb-4">Look</h3>

                    {visualizedImg ? (
                        <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden mb-6 border border-white shadow-md">
                            <Image src={`data:image/jpeg;base64,${visualizedImg}`} alt="Visualized Look" fill className="object-cover" />
                            <button
                                onClick={() => setVisualizedImg(null)}
                                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-md"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 mb-8 italic">
                            Select a category above to see your recommended look.
                        </p>
                    )}

                    <button
                        className="btn-nia w-full py-4 rounded-2xl flex items-center justify-center gap-2 bg-black text-white"
                        onClick={handleVisualize}
                    >
                        Visualize on Me
                    </button>
                </div>
            </div>

            <button
                className="btn-nia w-full py-5 rounded-2xl bg-black text-white font-bold text-sm shadow-xl active:scale-95 transition-all"
                onClick={() => setScreen("dashboard")}
            >
                Go to Main Dashboard
            </button>
        </div>
    );
}
