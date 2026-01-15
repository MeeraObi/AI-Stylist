"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { CheckCircle2, AlertCircle, Sparkles, Watch, UserCheck } from "lucide-react";

export default function InitialCheck() {
    const { preliminaryResults, setScreen, setLoading, userBlob, setComprehensiveResults } = useStylistStore();

    const handleStartQuiz = async () => {
        setLoading(true, "Building Style DNA...");
        const fd = new FormData();
        if (userBlob) fd.append("files", userBlob);

        try {
            const res = await fetch("/api/analyze-comprehensive", {
                method: "POST",
                body: fd,
            });
            const data = await res.json();
            setComprehensiveResults(data);
            setScreen("quiz");
        } catch (error) {
            console.error(error);
            alert("Error building DNA.");
        } finally {
            setLoading(false);
        }
    };

    const results = preliminaryResults || {
        works: "Analyzing your facial structure...",
        tweaks: "Identifying potential improvements...",
        grooming: "Curating grooming tips...",
        accessories: "Selecting accessory matches...",
        posture: "Observing silhouette..."
    };

    const items = [
        { label: "What Works", value: results.works, icon: CheckCircle2, color: "text-green-500", labelColor: "text-green-600" },
        { label: "Small Tweaks", value: results.tweaks, icon: AlertCircle, color: "text-orange-500", labelColor: "text-orange-600" },
        { label: "Grooming Tips", value: results.grooming, icon: UserCheck, color: "text-blue-500", labelColor: "text-blue-600" },
        { label: "Accessories", value: results.accessories, icon: Watch, color: "text-purple-500", labelColor: "text-purple-600" },
        { label: "Posture", value: results.posture, icon: Sparkles, color: "text-red-500", labelColor: "text-red-600" },
    ];

    return (
        <div className="screen pt-6">
            <h2 className="text-2xl font-bold mb-1">Initial Check</h2>
            <p className="text-gray-500 mb-8 text-sm">Nia&apos;s first impressions based on your scan.</p>

            {items.map((item, idx) => (
                <div key={idx} className="tile group hover:border-gray-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                        <span className={`label-nia mb-0 ${item.labelColor}`}>{item.label}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.value}</p>
                </div>
            ))}

            <div className="tile mt-8 p-6 border-2 border-gray-100">
                <h3 className="text-lg font-bold mb-2">Subscribe to Nia</h3>
                <p className="text-gray-500 text-sm mb-6">Unlock detailed DNA analysis and AI-powered wardrobe planning.</p>
                <button className="btn-nia py-3" onClick={handleStartQuiz}>
                    Complete DNA Scan
                </button>
            </div>
        </div>
    );
}
