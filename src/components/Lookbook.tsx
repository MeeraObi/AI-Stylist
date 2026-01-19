"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { ArrowLeft, Calendar, Sparkles } from "lucide-react";
import { useEffect } from "react";

export default function Lookbook() {
    const { setScreen, setLoading, comprehensiveResults, weeklyLooks, setWeeklyLooks } = useStylistStore();

    const generateWeekPlan = async () => {
        setLoading(true, "Planning your week...");
        try {
            const res = await fetch("/api/generate-weekly-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    context: comprehensiveResults?.physical_desc || "Normal stylish aesthetic"
                }),
            });
            const data = await res.json();
            if (data.week) {
                setWeeklyLooks(data.week);
            }
        } catch (err) {
            console.error("Error planning week:", err);
            alert("Failed to generate plan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="screen pt-6">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setScreen("dashboard")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold">Weekly Lookbook</h2>
            </div>

            {weeklyLooks.length === 0 && (
                <button className="btn-nia h-16 flex items-center justify-center gap-3 mb-10" onClick={generateWeekPlan}>
                    <Sparkles size={20} /> Generate Week (Mon-Fri)
                </button>
            )}

            <div className="space-y-6">
                {weeklyLooks.map((look, idx) => (
                    <div key={idx} className="tile p-0 overflow-hidden group">
                        <div className="p-5 border-b border-gray-50 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400" />
                                <strong className="text-lg">{look.day}</strong>
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{look.title}</span>
                        </div>
                        <div className="p-5">
                            <p className="text-sm text-gray-600 leading-relaxed mb-4">{look.desc}</p>
                            <button
                                onClick={() => setScreen("shop")}
                                className="btn-nia w-full py-3 text-xs flex items-center justify-center gap-2"
                            >
                                Shop Items
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {weeklyLooks.length === 0 && (
                <div className="text-center py-20 flex flex-col items-center">
                    <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar size={32} className="text-gray-200" />
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">Your weekly looks are not generated yet.<br />Click the button above to start.</p>
                </div>
            )}
        </div>
    );
}
