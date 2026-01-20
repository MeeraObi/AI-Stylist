"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { ArrowLeft, ExternalLink, ShoppingCart, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ShopItem {
    name: string;
    store: string;
    price: string;
}

export default function ShopIndia() {
    const { setScreen, comprehensiveResults, setLoading, userBlob, shopTab, currentLookDescription } = useStylistStore();
    const [allResults, setAllResults] = useState<Record<string, ShopItem[]>>({});
    const [activeTab, setActiveTab] = useState(shopTab || "Work");
    const [visualizedImg, setVisualizedImg] = useState<string | null>(null);

    useEffect(() => {
        const fetchShopItems = async () => {
            setLoading(true, "Searching India...");
            try {
                const res = await fetch("/api/shop", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        context: comprehensiveResults?.physical_desc || "Normal stylish aesthetic",
                        lookDescription: currentLookDescription,
                        activeTab: activeTab
                    }),
                });
                const data = await res.json();
                setAllResults(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchShopItems();
        fetchShopItems();
    }, [comprehensiveResults, setLoading]);

    // Update activeTab if shopTab changes (e.g. re-entering screen)
    useEffect(() => {
        if (shopTab) setActiveTab(shopTab);
    }, [shopTab]);

    const visualizeLook = async () => {
        if (!userBlob) return;
        setLoading(true, "Trying it on...");

        const currentItems = allResults[activeTab] || [];
        const prompt = currentItems.map(i => i.name).join(", ");

        const fd = new FormData();
        fd.append("prompt", `Wearing ${prompt}`);
        fd.append("ref_image", userBlob);

        try {
            const res = await fetch("/api/generate-image", {
                method: "POST",
                body: fd,
            });
            const data = await res.json();
            setVisualizedImg(data.image || null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const currentItems = allResults[activeTab] || [];

    return (
        <div className="screen pt-6">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setScreen("dashboard")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold">Shop India</h2>
            </div>

            {currentLookDescription && (
                <div className="bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-blue-500 fill-blue-500" />
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Shopping For</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">"{currentLookDescription}"</p>
                </div>
            )}

            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                {["Work", "Casual", "Social"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setVisualizedImg(null); }}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="space-y-4 mb-8">
                {currentItems.map((item, idx) => (
                    <div key={idx} className="tile border-none bg-gray-50/50 p-6 flex justify-between items-center group hover:bg-white hover:shadow-md transition-all">
                        <div className="flex-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">
                                Recommendation #{idx + 1}
                            </span>
                            <h4 className="font-bold text-gray-900 text-sm mb-1">{item.name}</h4>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">{item.store}</span>
                                <span className="h-1 w-1 bg-gray-300 rounded-full" />
                                <span className="text-[10px] font-bold text-black">{item.price}</span>
                            </div>
                        </div>
                        <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(item.name)}&tbm=shop&gl=in`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white p-3 rounded-xl shadow-sm text-gray-400 hover:text-black hover:scale-110 transition-all border border-gray-50"
                        >
                            <ExternalLink size={18} />
                        </a>
                    </div>
                ))}
            </div>

            <div className="tile p-6 border-2 border-black text-center">
                <h3 className="font-bold mb-2">Visualize this Look</h3>
                <p className="text-xs text-gray-500 mb-6">See how this curated {activeTab} outfit looks on you.</p>

                {visualizedImg ? (
                    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden mb-4 border border-gray-100">
                        <Image src={`data:image/jpeg;base64,${visualizedImg}`} alt="Visualized Look" fill className="object-cover" />
                    </div>
                ) : (
                    <button className="btn-nia w-full py-4 flex items-center justify-center gap-2" onClick={visualizeLook}>
                        <Sparkles size={16} /> Visualize on Me
                    </button>
                )}

                {visualizedImg && (
                    <button className="text-xs font-bold text-gray-400 hover:text-black mt-2" onClick={() => setVisualizedImg(null)}>
                        Reset Visualization
                    </button>
                )}
            </div>
        </div>
    );
}
