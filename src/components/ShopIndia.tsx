"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { ArrowLeft, ExternalLink, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

interface ShopItem {
    name: string;
    store: string;
    price: string;
}

export default function ShopIndia() {
    const { setScreen, comprehensiveResults, setLoading } = useStylistStore();
    const [results, setResults] = useState<ShopItem[]>([]);

    useEffect(() => {
        const fetchShopItems = async () => {
            setLoading(true, "Searching India...");
            try {
                const res = await fetch("/api/shop", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        context: comprehensiveResults?.first_looks?.work || "Modern Indian Fashion"
                    }),
                });
                const data = await res.json();
                setResults(data.results || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchShopItems();
    }, [comprehensiveResults, setLoading]);

    return (
        <div className="screen pt-6">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setScreen("dashboard")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold">Shop India</h2>
            </div>

            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">
                Top recommendations to recreate your look
            </p>

            <div className="space-y-4">
                {results.map((item, idx) => (
                    <div key={idx} className="tile border-none bg-gray-50/50 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase">{item.store}</span>
                                    <span className="h-1 w-1 bg-gray-300 rounded-full" />
                                    <span className="text-xs font-bold text-black">{item.price}</span>
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded-xl shadow-sm">
                                <ShoppingCart size={18} className="text-gray-400" />
                            </div>
                        </div>

                        <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(item.name)}&tbm=shop&gl=in`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-nia-outline bg-white flex items-center justify-center gap-2 py-3 text-sm"
                        >
                            Buy Now <ExternalLink size={14} />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
