"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function SignUp() {
    const { setScreen, setLoading, userBlob, setComprehensiveResults, userInfo, setUserInfo } = useStylistStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleBack = () => {
        setScreen("initial-check");
    };

    const handleSignUp = async () => {
        if (!email || !password || !userInfo.name) {
            alert("Please fill in all fields.");
            return;
        }

        setLoading(true, "Creating Account...");

        // 1. Sign Up with Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            console.error("Auth Error:", authError);
            alert(authError.message);
            setLoading(false);
            return;
        }

        const userId = authData.user?.id;
        const session = authData.session;

        // If Email Confirmation is enabled, session might be null.
        if (!session && !userId) {
            alert("Please check your email to confirm your account.");
            setLoading(false);
            return;
        }

        if (!userId) {
            console.error("No User ID returned");
            setLoading(false);
            return;
        }

        console.log("User created:", userId, "Session:", session ? "Active" : "Null (Email Verification likely on)");

        // 2. Create Profile
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: userId,
                email: email,
                name: userInfo.name,
                age: userInfo.age,
                gender: userInfo.gender,
                height: userInfo.height,
                weight: userInfo.weight,
                style_preferences: []
            });

        if (profileError) {
            console.error("Profile creation error FULL:", profileError, profileError.message, profileError.details);

            // If the error implies RLS violation or missing ID
            if (!session) {
                alert("Account created! Please check your email to verify before we can save your profile.");
            } else {
                alert("Failed to save profile data. check console.");
            }
        }

        // 3. Proceed with Analysis
        setLoading(true, `Building Style DNA for ${userInfo.name}...`);

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

            // Save Analysis to DB (New Table)
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { error: insertError } = await supabase
                    .from('user_analysis')
                    .insert({
                        user_id: user.id,
                        analysis_data: data
                    });

                if (insertError) {
                    console.error("FAILED TO SAVE ANALYSIS TO DB:", insertError);
                    alert("Warning: Could not save your style profile to the database. It will be lost on logout.");
                } else {
                    console.log("Analysis saved to user_analysis table successfully.");
                }
            } else {
                console.error("User not found during analysis save.");
            }

            setScreen("quiz");
        } catch (error) {
            console.error(error);
            alert("Error building DNA.");
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
                    <Input
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-14 rounded-xl bg-gray-50 border-gray-100 placeholder:text-gray-400"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Password</label>
                    <Input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-14 rounded-xl bg-gray-50 border-gray-100 placeholder:text-gray-400"
                    />
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
