"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { Camera } from "lucide-react";
import Image from "next/image";

export default function StylistUpload() {
    const { userBlob, setUserBlob, setScreen, setLoading, setPreliminaryResults } = useStylistStore();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUserBlob(file);
        setLoading(true, "Comprehensive Scan...");

        const fd = new FormData();
        fd.append("files", file);

        try {
            const res = await fetch("/api/analyze-preliminary", {
                method: "POST",
                body: fd,
            });
            const data = await res.json();
            setPreliminaryResults(data);
            setScreen("initial-check");
        } catch (error) {
            console.error(error);
            alert("Error analyzing photo. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="screen">
            <h2 className="text-2xl font-bold mb-2">Stylist&apos;s Eye</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">We need a clear photo to analyze your facial structure and body proportions.</p>

            <div className="relative group">
                <div className="tile border-2 border-dashed border-gray-200 bg-gray-50/50 py-16 flex flex-col items-center justify-center transition-all group-hover:bg-gray-50 group-hover:border-gray-300">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                        <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Front facing, good lighting</p>
                    <p className="text-xs text-gray-400 mb-8">Avoid hats, glasses, or busy backgrounds</p>

                    <label className="btn-nia-outline w-auto px-8 py-3 bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                        Choose Photo
                        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                    </label>
                </div>
            </div>

            {userBlob && (
                <div className="mt-8 flex flex-col items-center animate-in zoom-in-95 duration-300">
                    <span className="label-nia mb-3">Selected Preview</span>
                    <div className="relative h-40 w-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                        <Image
                            src={URL.createObjectURL(userBlob)}
                            alt="Upload Preview"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
