"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function OnboardingScreen() {
    const { userInfo, setUserInfo, setScreen } = useStylistStore();

    const handleProceed = () => {
        if (!userInfo.name) {
            alert("Please enter your name.");
            return;
        }
        setScreen("upload");
    };

    return (
        <div className="screen pt-12">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome to Nia</h1>
            <p className="text-gray-500 mb-10">Let&apos;s get to know you to personalize your style.</p>

            <span className="label-nia">STEP 1: Profile Setup</span>
            <Input
                type="text"
                placeholder="Full Name"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ name: e.target.value })}
                className="mb-4 h-14 rounded-xl bg-gray-50 border-gray-100 placeholder:text-gray-400"
            />

            <div className="flex gap-4 mb-4">
                <Input
                    type="number"
                    placeholder="Age"
                    value={userInfo.age}
                    onChange={(e) => setUserInfo({ age: e.target.value })}
                    className="flex-1 h-14 rounded-xl bg-gray-50 border-gray-100 placeholder:text-gray-400"
                />
                <Select
                    onValueChange={(val) => setUserInfo({ gender: val })}
                    value={userInfo.gender}
                >
                    <SelectTrigger className="flex-1 w-full h-14 rounded-xl bg-gray-50 border-gray-100 px-4 text-left text-sm">
                        <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-100" position="popper">
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Non-binary">Non-binary</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex gap-4 mb-6">
                <Input
                    type="number"
                    placeholder="Height (cm)"
                    value={userInfo.height}
                    onChange={(e) => setUserInfo({ height: e.target.value })}
                    className="flex-1 h-14 rounded-xl bg-gray-50 border-gray-100 placeholder:text-gray-400"
                />
                <Input
                    type="number"
                    placeholder="Weight (kg)"
                    value={userInfo.weight}
                    onChange={(e) => setUserInfo({ weight: e.target.value })}
                    className="flex-1 h-14 rounded-xl bg-gray-50 border-gray-100 placeholder:text-gray-400"
                />
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex flex-col items-center">
                <button className="bg-black text-white border border-black h-12 rounded-xl w-full text-base font-semibold transition active:scale-[0.98] flex items-center justify-center mb-4" onClick={handleProceed}>
                    Proceed to Stylist&apos;s Eye
                </button>
                <p className="text-xs text-gray-400">
                    Already a member? <button onClick={() => setScreen("signin")} className="font-bold text-black border-b border-black pb-0.5">Log in</button>
                </p>
            </div>
        </div>
    );
}
