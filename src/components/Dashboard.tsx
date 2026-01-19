"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { Bell, Cloud, Shirt, Scissors, ShoppingBag, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Dashboard() {
    const { comprehensiveResults, setScreen, selectedDailyLook } = useStylistStore();
    const [heroImg, setHeroImg] = useState<string | null>(null);

    // Display the selected daily look if available
    useEffect(() => {
        if (selectedDailyLook?.img) {
            setHeroImg(selectedDailyLook.img);
        }
    }, [selectedDailyLook]);

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

            <div className="hero-container mb-10">
                <div className="hero-img-box h-[420px] bg-gray-50 rounded-[32px] overflow-hidden flex items-center justify-center text-gray-300 relative border border-gray-100 shadow-sm">
                    {heroImg ? (
                        <Image src={`data:image/jpeg;base64,${heroImg}`} alt="Curated Outfit" fill className="object-cover" />
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <Shirt size={64} opacity={0.2} strokeWidth={1} />
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Visualizing Style...</span>
                        </div>
                    )}
                </div>
                <div className="hero-content mt-6 text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 block">TODAY, CURATED</span>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 px-4 leading-snug">
                        {selectedDailyLook?.desc || comprehensiveResults?.first_looks?.work || "Your daily outfit strategy is ready."}
                    </h3>
                    <div className="flex gap-3 px-2">
                        <button className="btn-nia py-4 flex-1 text-sm rounded-2xl" onClick={() => setScreen("shop")}>
                            Shop This Look
                        </button>
                        <button className="btn-nia-outline py-4 flex-1 text-sm rounded-2xl flex items-center justify-center gap-2" onClick={() => setScreen("results")}>
                            <Sparkles size={16} /> Change Look
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-10">
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
