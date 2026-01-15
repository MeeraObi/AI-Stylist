"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { ArrowLeft, Camera, UserCheck } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function TrialRoom() {
    const { setScreen, setLoading } = useStylistStore();
    const [preview, setPreview] = useState<string | null>(null);
    const [result, setResult] = useState<{ verdict: string; reason: string } | null>(null);

    const handleCheckFit = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        setLoading(true, "Checking...");

        const fd = new FormData();
        fd.append("file", file);

        try {
            const res = await fetch("/api/analyze-fit", {
                method: "POST",
                body: fd,
            });
            const d = await res.json();
            setResult(d);
        } catch (err) {
            console.error(err);
            alert("Error analyzing fit.");
        } finally {
            setLoading(false);
        }
    };

    const resetTrial = () => {
        setPreview(null);
        setResult(null);
    };

    return (
        <div className="screen pt-6">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setScreen("dashboard")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold">Trial Room</h2>
            </div>

            <p className="text-gray-500 mb-8 leading-relaxed">Upload a mirror selfie for an AI fit check.</p>

            <div className="tile border-2 border-dashed border-gray-200 bg-gray-50/50 py-12 flex flex-col items-center justify-center transition-all">
                {preview ? (
                    <div className="relative h-64 w-48 rounded-2xl overflow-hidden border-4 border-white shadow-lg mb-4">
                        <Image src={preview} alt="Trial Preview" fill className="object-cover" />
                    </div>
                ) : (
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                        <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                )}

                {!result && (
                    <label className="btn-nia-outline w-auto px-8 py-3 bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                        Upload Photo
                        <input type="file" accept="image/*" className="hidden" onChange={handleCheckFit} />
                    </label>
                )}
            </div>

            {result && (
                <div className="tile bg-[#f0f8ff] border-[#d0e8ff] p-6 mt-6 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-2 mb-3">
                        <UserCheck className="text-blue-500" size={18} />
                        <strong className="text-blue-900">{result.verdict}</strong>
                    </div>
                    <p className="text-blue-700 text-sm leading-relaxed mb-6">{result.reason}</p>
                    <button className="btn-nia bg-blue-600 text-white" onClick={resetTrial}>
                        Try Another Outfit
                    </button>
                </div>
            )}
        </div>
    );
}
