"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { ArrowLeft, Calendar, Sparkles } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface WeeklyLook {
    day: string;
    title: string;
    img: string | null;
}

export default function Lookbook() {
    const { setScreen, setLoading, userBlob, comprehensiveResults } = useStylistStore();
    const [weeklyLooks, setWeeklyLooks] = useState<WeeklyLook[]>([]);

    const generateWeek = async () => {
        if (!userBlob) {
            alert("Please start from the beginning to upload a photo first.");
            setScreen("splash");
            return;
        }

        setLoading(true, "Generating Weekly Plan...");

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        const schedule = [
            'Corporate Power Suit',
            'Smart Casual Chinos',
            'Creative Layering',
            'Relaxed Travel Linen',
            'High Fashion Party'
        ];

        const newLooks: WeeklyLook[] = [];

        for (let i = 0; i < days.length; i++) {
            const fd = new FormData();
            // Send simple outfit name, API handles the person consistency and photography steering
            fd.append("prompt", schedule[i]);
            if (userBlob) fd.append("ref_image", userBlob);

            try {
                const res = await fetch("/api/generate-image", {
                    method: "POST",
                    body: fd,
                });
                const data = await res.json();
                newLooks.push({
                    day: days[i],
                    title: schedule[i],
                    img: data.image || null
                });
            } catch (err) {
                console.error(`Error generating ${days[i]}:`, err);
                newLooks.push({
                    day: days[i],
                    title: schedule[i],
                    img: null
                });
            }
        }

        setWeeklyLooks(newLooks);
        setLoading(false);
    };

    return (
        <div className="screen pt-6">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setScreen("dashboard")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold">Weekly Lookbook</h2>
            </div>

            <button className="btn-nia h-16 flex items-center justify-center gap-3 mb-10" onClick={generateWeek}>
                <Sparkles size={20} /> Generate Week (Mon-Fri)
            </button>

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
                        <div className="h-[250px] bg-gray-50 flex items-center justify-center text-gray-300 relative">
                            {look.img ? (
                                <Image
                                    src={`data:image/jpeg;base64,${look.img}`}
                                    alt={look.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <Sparkles size={48} opacity={0.2} strokeWidth={1} />
                            )}
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
