"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { Bell, Cloud, Shirt, Scissors, ShoppingBag, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Dashboard() {
    const { comprehensiveResults, setScreen, setLoading, userBlob } = useStylistStore();
    const [heroImg, setHeroImg] = useState<string | null>(null);

    const handleVisualize = async () => {
        const desc = comprehensiveResults?.first_looks?.work;
        if (!desc || !userBlob) return;

        setLoading(true, "Visualizing...");
        const fd = new FormData();
        // Just send the outfit desc, API handles consistency
        fd.append("prompt", desc);
        fd.append("ref_image", userBlob);

        try {
            const res = await fetch("/api/generate-image", {
                method: "POST",
                body: fd,
            });
            const data = await res.json();
            if (data.image) setHeroImg(data.image);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="screen pt-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold tracking-tighter">Nia<span className="text-gray-400">.</span></h1>
                <div className="bg-gray-50 p-3 rounded-full border border-gray-100">
                    <Bell size={20} className="text-gray-400" />
                </div>
            </div>

            <div className="tile p-4 mb-6">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <Cloud size={16} className="text-gray-400" />
                        <strong className="text-sm">Heads Up</strong>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Today</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">Rain expected later. Swap suede for leather boots to protect your footwear.</p>
            </div>

            <div className="hero-container mb-8">
                <div className="hero-img-box h-[400px] bg-gray-100 rounded-[24px] overflow-hidden flex items-center justify-center text-gray-300 relative">
                    {heroImg ? (
                        <Image src={`data:image/jpeg;base64,${heroImg}`} alt="Curated Outfit" fill className="object-cover" />
                    ) : (
                        <Shirt size={64} opacity={0.3} />
                    )}
                </div>
                <div className="hero-content p-6">
                    <span className="label-nia text-black">TODAY, CURATED</span>
                    <p className="text-sm font-medium text-gray-800 leading-relaxed truncate-3-lines">
                        {comprehensiveResults?.first_looks?.work || "Your daily outfit will appear here once your DNA scan is complete."}
                    </p>
                    <div className="flex gap-3 mt-6">
                        <button className="btn-nia py-3 flex-1" onClick={() => setScreen("shop")}>
                            Shop Items
                        </button>
                        <button className="btn-nia-outline py-3 flex-1 flex items-center justify-center gap-2 border-black" onClick={handleVisualize}>
                            <Sparkles size={16} /> Visualize
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
                <DashboardCard icon={Shirt} label="Wardrobe" onClick={() => setScreen("wardrobe")} />
                <DashboardCard icon={Scissors} label="Trial Room" onClick={() => setScreen("trial")} />
                <DashboardCard icon={ShoppingBag} label="Shop" onClick={() => setScreen("shop")} />
            </div>
        </div>
    );
}

function DashboardCard({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="tile flex flex-col items-center justify-center gap-2 py-4 px-2 hover:bg-gray-50 active:scale-95 transition-all text-center"
        >
            <Icon size={20} className="text-gray-400" />
            <span className="text-[10px] font-bold uppercase tracking-tight text-gray-500">{label}</span>
        </button>
    );
}
