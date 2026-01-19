"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { ArrowLeft, Sparkles, Package } from "lucide-react";
import { useEffect, useState } from "react";

interface GroomingData {
    tip: string;
    products: string[];
}

export default function Grooming() {
    const { setScreen, comprehensiveResults, setLoading, groomingData, setGroomingData } = useStylistStore();

    useEffect(() => {
        // Only fetch if not already available
        if (groomingData) return;

        const fetchGrooming = async () => {
            setLoading(true, "Curating...");
            try {
                const res = await fetch("/api/grooming", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        desc: comprehensiveResults?.physical_desc || "General Style Vibe"
                    }),
                });
                const d = await res.json();
                setGroomingData(d);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchGrooming();
    }, [groomingData, comprehensiveResults, setLoading, setGroomingData]);

    return (
        <div className="screen pt-6">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setScreen("dashboard")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold">Grooming</h2>
            </div>

            <div className="tile p-8 mb-8 overflow-hidden relative">
                <Sparkles className="absolute -right-4 -top-4 h-24 w-24 text-gray-50 rotate-12" />
                <span className="label-nia mb-4 text-gray-400 block">Personalized Advice</span>
                <p className="text-lg font-medium leading-relaxed italic text-gray-700 relative z-10">
                    &quot;{groomingData?.tip || "Loading your personalized grooming strategy..."}&quot;
                </p>
            </div>

            <h3 className="label-nia mb-4 text-black">Recommended Product Categories</h3>
            <div className="space-y-3">
                {(groomingData?.products || ["Face Wash", "Moisturizer", "Hair Styling Gel"]).map((prod: string, idx: number) => (
                    <div key={idx} className="tile flex items-center gap-4 py-4">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <Package size={20} className="text-gray-400" />
                        </div>
                        <span className="font-bold text-gray-700">{prod}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
