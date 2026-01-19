"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { Loader2, Home, Calendar, Shirt, User, LucideIcon } from "lucide-react";

export default function Shell({ children }: { children: React.ReactNode }) {
    const { isLoading, loadingMessage, currentScreen } = useStylistStore();

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-[#f0f2f5] p-0 sm:p-4">
            <div className="app-container">
                {isLoading && (
                    <div className="loader-overlay">
                        <Loader2 className="h-10 w-10 animate-spin mb-4" />
                        <h3 className="text-lg font-bold">{loadingMessage}</h3>
                        <p className="text-sm text-gray-500 mt-2">Please wait while Nia analyzes your style.</p>
                    </div>
                )}

                {children}

                {/* Navigation Bar - only show on dashboard and related screens */}
                {["dashboard", "wardrobe", "trial", "grooming", "lookbook", "shop", "results"].includes(currentScreen) && (
                    <div className="absolute bottom-0 w-full bg-white/98 border-t border-gray-100 flex justify-around py-4 pb-8 z-40">
                        <NavIcon screen="dashboard" icon="Home" />
                        <NavIcon screen="lookbook" icon="Calendar" />
                        <NavIcon screen="wardrobe" icon="Shirt" />
                        <NavIcon screen="grooming" icon="User" />
                    </div>
                )}
            </div>
        </div>
    );
}

function NavIcon({ screen, icon }: { screen: string, icon: string }) {
    const { currentScreen, setScreen } = useStylistStore();
    const isActive = currentScreen === screen;

    const IconMap: Record<string, LucideIcon> = { Home, Calendar, Shirt, User };
    const IconComponent = IconMap[icon];

    return (
        <button
            onClick={() => setScreen(screen)}
            className={`p-2 transition-all duration-200 ${isActive ? 'text-black -translate-y-0.5' : 'text-gray-300'}`}
        >
            <IconComponent size={22} fill={isActive ? "currentColor" : "none"} />
        </button>
    );
}
