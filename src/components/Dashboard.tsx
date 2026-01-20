"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { Bell, Cloud, Shirt, Scissors, ShoppingBag, Sparkles, Power, LogOut, Camera } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
    const { comprehensiveResults, setScreen, selectedDailyLook, setSelectedDailyLook, userBlob, setLoading, setShopTab, setCurrentLookDescription } = useStylistStore();
    const [heroImg, setHeroImg] = useState<string | null>(null);
    const [userImageBase64, setUserImageBase64] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"Work" | "Travel" | "Social">("Work");
    const [showMenu, setShowMenu] = useState(false);

    // Load user image base64
    useEffect(() => {
        if (userBlob) {
            const reader = new FileReader();
            reader.readAsDataURL(userBlob);
            reader.onloadend = () => {
                const base64 = (reader.result as string)?.split(",")[1];
                setUserImageBase64(base64);
            };
        }
    }, [userBlob]);

    // Update hero image when selected daily look changes
    useEffect(() => {
        if (selectedDailyLook?.img) {
            setHeroImg(selectedDailyLook.img);
        }
    }, [selectedDailyLook]);

    const displayImg = heroImg || userImageBase64;

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
                setHeroImg(data.image);
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

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    return (
        <div className="screen pt-6">
            <div className="flex justify-between items-center mb-8 relative">
                <h1 className="text-3xl font-extrabold tracking-tighter">Nia<span className="text-gray-400">.</span></h1>

                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="bg-gray-50 p-3 rounded-full border border-gray-100 hover:bg-gray-100 transition-colors"
                    >
                        <Power size={20} className="text-gray-400" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 p-3 hover:bg-red-50 text-red-500 rounded-xl transition-colors text-sm font-bold"
                            >
                                <LogOut size={16} />
                                Log Out
                            </button>
                        </div>
                    )}
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

            <button
                onClick={() => setScreen("upload")}
                className="btn-nia w-full py-4 mb-8 text-sm rounded-2xl flex items-center justify-center gap-2"
            >
                <Camera size={18} /> Assess Another Look
            </button>

            <div className="hero-container mb-10">
                <div className="hero-img-box h-[420px] bg-gray-50 rounded-[32px] overflow-hidden flex items-center justify-center text-gray-300 relative border border-gray-100 shadow-sm">
                    {displayImg ? (
                        <Image src={`data:image/jpeg;base64,${displayImg}`} alt="Curated Outfit" fill className="object-cover" />
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <Shirt size={64} opacity={0.2} strokeWidth={1} />
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Visualizing Style...</span>
                        </div>
                    )}
                </div>
                <div className="hero-content mt-6 text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 block">TODAY, CURATED</span>

                    {/* Tabs */}
                    <div className="flex gap-2 justify-center mb-6">
                        {(["Work", "Travel", "Social"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setActiveTab(tab);
                                    setHeroImg(null); // Reset image when changing tabs to encourage visualization
                                }}
                                className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeTab === tab
                                    ? "bg-black text-white shadow-md"
                                    : "bg-gray-100 text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-4 px-4 leading-snug">
                        {comprehensiveResults?.first_looks?.[activeTab.toLowerCase() as keyof typeof comprehensiveResults.first_looks] ||
                            selectedDailyLook?.desc ||
                            "Your daily outfit strategy is ready."}
                    </h3>

                    {/* Style Tweaks */}
                    {(comprehensiveResults as any)?.style_tweaks && (comprehensiveResults as any).style_tweaks.length > 0 && (
                        <div className="mb-6 px-4">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Style Tweaks</h4>
                            <ul className="text-xs text-gray-600 space-y-1 text-left inline-block">
                                {(comprehensiveResults as any).style_tweaks.map((tweak: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="mt-0.5 w-1 h-1 bg-black rounded-full shrink-0" />
                                        {tweak}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex gap-3 px-2">
                        <button
                            className="btn-nia py-4 flex-1 text-sm rounded-2xl"
                            onClick={() => {
                                const targetTab = activeTab === "Travel" ? "Casual" : activeTab;
                                const currentDesc = comprehensiveResults?.first_looks?.[activeTab.toLowerCase() as keyof typeof comprehensiveResults.first_looks] ||
                                    selectedDailyLook?.desc || "Your daily outfit strategy.";

                                setShopTab(targetTab);
                                setCurrentLookDescription(currentDesc);
                                setScreen("shop");
                            }}
                        >
                            Shop This Look
                        </button>
                        <button className="btn-nia-outline py-4 flex-1 text-sm rounded-2xl flex items-center justify-center gap-2" onClick={handleVisualize}>
                            <Sparkles size={16} className="inline" /> Visualize This Look
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-10 text-center px-4">
                <h3 className="text-lg font-bold mb-2">Style DNA</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium mb-4">
                    {comprehensiveResults?.profile_writeup?.summary ||
                        "Your unique style DNA favors tailored pieces in neutral colors that emphasize a polished image. Your style transcends seasonal trends, relying instead on timeless designs."}
                </p>
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
