"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SignUp() {
    const { setScreen, setLoading, userBlob, setComprehensiveResults, userInfo, setUserInfo } = useStylistStore();

    const handleBack = () => {
        setScreen("initial-check");
    };

    const handleSignUp = async () => {
        // Simulate sign up then proceed to analysis
        setLoading(true, `Creating Account for ${userInfo.name || 'User'} & Building DNA...`);

        // Process the actual analysis after "signup"
        const fd = new FormData();
        if (userBlob) fd.append("files", userBlob);
        fd.append("userInfo", JSON.stringify(userInfo));

        try {
            const res = await fetch("/api/analyze-comprehensive", {
                method: "POST",
                body: fd,
            });
            const data = await res.json();
            setComprehensiveResults(data);
            setScreen("quiz"); // Or wherever the next flow is
        } catch (error) {
            console.error(error);
            // Even if analysis fails, we might want to let them through or show error
            alert("Error building DNA.");
            // setScreen("quiz"); // Fallback?
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {
        setScreen("signin");
    };

    return (
        <div className="screen pt-6 flex flex-col h-full">
            <button onClick={handleBack} className="mb-6 text-black">
                <ArrowLeft size={24} />
            </button>

            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Join Nia</h1>
            <p className="text-gray-500 mb-8">Start your personalized style journey today.</p>

            <div className="space-y-4 flex-1">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Full Name</label>
                    <Input
                        placeholder="Enter your name"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({ name: e.target.value })}
                        className="h-14 rounded-xl bg-gray-50 border-gray-100 placeholder:text-gray-400"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Email Address</label>
                    <Input placeholder="name@example.com" className="h-14 rounded-xl bg-gray-50 border-gray-100 placeholder:text-gray-400" />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Password</label>
                    <Input type="password" placeholder="Create a password" className="h-14 rounded-xl bg-gray-50 border-gray-100 placeholder:text-gray-400" />
                </div>
            </div>

            <div className="mt-6">
                <div className="bg-[#F5F5F5] rounded-xl p-5 mb-6 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={16} className="text-black" />
                        <span className="text-xs font-bold uppercase tracking-widest text-black">Limited Offer</span>
                    </div>
                    <h3 className="font-bold text-lg mb-1">Unlock Full Style Profile</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Get deep AI-driven fashion analysis and personalized recommendations for just <span className="font-bold text-black">₹99</span>.
                    </p>
                </div>

                <button
                    onClick={handleSignUp}
                    className="bg-black text-white w-full py-4 rounded-xl font-bold text-base hover:cursor-pointer transition-colors mb-4"
                >
                    Create Account & Unlock Profile
                </button>

                <p className="text-center text-xs text-gray-400">
                    Already have an account? <button onClick={handleLogin} className="font-bold text-black border-b border-black pb-0.5">Log in</button>
                </p>
                <div className="mt-4 text-[10px] text-center text-gray-300 px-8 leading-tight">
                    By joining, you agree to our Terms of Service and Privacy Policy.
                </div>
            </div>
        </div>
    );
}
