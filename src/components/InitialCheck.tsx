"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { CheckCircle2, Wrench, Gem, Scissors, Users } from "lucide-react";

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
        works: "Nia is currently analyzing your full outfit layers. She will provide detailed feedback on how your tops, bottoms, and additional layers interact.",
        tweaks: "Identifying subtle adjustments to elevate your style. Small changes in fit or color can make a significant impact on your overall silhouette.",
        accessories: "Selecting the perfect accents to complement your look. The right items can tie an entire outfit together and add a touch of personality.",
        grooming: "Curating personalized grooming advice for a sharp finish. Attention to detail ensures you always put your best foot forward.",
        posture: "Observing your stance to maximize visual impact. Good posture naturally enhances the way clothes drape and look on your frame."
    };

    const items = [
        { label: "What Works", value: results.works, icon: CheckCircle2, color: "text-green-500", bgColor: "bg-green-50", labelColor: "text-green-700", iconSize: 20 },
        { label: "Small Tweaks", value: results.tweaks, icon: Wrench, color: "text-orange-500", bgColor: "bg-orange-50", labelColor: "text-orange-700", iconSize: 20 },
        { label: "Accessories", value: results.accessories, icon: Gem, color: "text-purple-500", bgColor: "bg-purple-50", labelColor: "text-purple-700", iconSize: 20 },
        { label: "Grooming Tips", value: results.grooming, icon: Scissors, color: "text-blue-500", bgColor: "bg-blue-50", labelColor: "text-blue-700", iconSize: 20 },
        { label: "Posture", value: results.posture, icon: Users, color: "text-pink-500", bgColor: "bg-pink-50", labelColor: "text-pink-700", iconSize: 20 },
    ];

    return (
        <div className="screen pt-6">
            <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Initial Check</h2>
            <p className="text-gray-500 mb-10 text-sm">Nia&apos;s first impressions based on your scan.</p>

            {items.map((item, idx) => (
                <div key={idx} className="tile group hover:shadow-lg transition-all mb-6 border-l-4" style={{ borderLeftColor: item.color.replace('text-', '') }}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2.5 rounded-xl ${item.bgColor}`}>
                            <item.icon className={`${item.color}`} size={item.iconSize} strokeWidth={2.5} />
                        </div>
                        <span className={`font-bold text-base uppercase tracking-wide ${item.labelColor}`}>{item.label}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed pl-1">{item.value}</p>
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
