"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { Plus, History, ShoppingBag, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface WardrobeItem {
    id: number;
    name: string;
    category: string;
    img: string;
}

export default function Wardrobe() {
    const { setScreen } = useStylistStore();
    const [items, setItems] = useState<WardrobeItem[]>([]);

    const handleUploadItem = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create temporary preview
        const tempId = Date.now();
        const newItem = {
            id: tempId,
            name: "Analyzing...",
            category: "Extracting tags...",
            img: URL.createObjectURL(file)
        };
        setItems([newItem, ...items]);

        const fd = new FormData();
        fd.append("file", file);

        try {
            const res = await fetch("/api/analyze-item", {
                method: "POST",
                body: fd,
            });
            const d = await res.json();

            setItems(prev => prev.map(item =>
                item.id === tempId
                    ? { ...item, name: d.inventory_list?.[0] || "Analyzed Item", category: d.display_desc.replace(/<br>/g, ' • ') }
                    : item
            ));
        } catch (err) {
            console.error(err);
            setItems(prev => prev.filter(item => item.id !== tempId));
        }
    };

    return (
        <div className="screen pt-6">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setScreen("dashboard")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold">Wardrobe</h2>
            </div>

            <div className="flex gap-3 mb-8">
                <button className="btn-nia-outline flex-1 py-3 text-xs flex items-center justify-center gap-2">
                    <ShoppingBag size={14} /> Create Outfit
                </button>
                <button className="btn-nia-outline flex-1 py-3 text-xs flex items-center justify-center gap-2">
                    <History size={14} /> History
                </button>
            </div>

            <label className="btn-nia mb-8 flex items-center justify-center gap-2 py-4 cursor-pointer">
                <Plus size={20} /> Upload Item
                <input type="file" accept="image/*" className="hidden" onChange={handleUploadItem} />
            </label>

            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="tile animate-in slide-in-from-left-4 duration-300">
                        <div className="flex gap-4">
                            <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                                <Image src={item.img} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <h4 className="font-bold text-gray-800">{item.name}</h4>
                                <span className="text-xs text-gray-400 font-medium tracking-wide uppercase mt-1">{item.category}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="text-center py-20">
                        <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus size={32} className="text-gray-200" />
                        </div>
                        <p className="text-gray-400 text-sm">Your wardrobe is empty.<br />Upload items to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
