"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignIn() {
    const { setScreen, setUserInfo, setQuizSelections, setComprehensiveResults } = useStylistStore();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleBack = () => {
        setScreen("signup");
    };

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Please enter email and password.");
            return;
        }

        setLoading(true);
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            alert(authError.message);
            setLoading(false);
            return;
        }

        // Fetch User Profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user?.id)
            .single();

        if (profileError) {
            console.error("Fetch profile error:", profileError);
        } else if (profile) {
            // Hydrate Store
            setUserInfo({
                name: profile.name,
                age: profile.age,
                gender: profile.gender,
                height: profile.height,
                weight: profile.weight
            });

            if (profile.style_preferences) {
                console.log("Loaded style preferences:", profile.style_preferences.length);
                setQuizSelections(profile.style_preferences);
            }

            // Fetch Analysis from New Table
            const { data: analysisRecord, error: analysisError } = await supabase
                .from('user_analysis')
                .select('analysis_data')
                .eq('user_id', authData.user?.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (analysisRecord?.analysis_data) {
                console.log("Loaded analysis results from user_analysis");
                setComprehensiveResults(analysisRecord.analysis_data);
            } else {
                console.warn("No analysis_data found. Using transient/empty state.", analysisError);
            }
        }

        setLoading(false);
        setScreen("dashboard");
    };

    const handleSignUp = () => {
        setScreen("signup");
    };

    return (
        <div className="screen pt-6 flex flex-col h-full">
            <button onClick={handleBack} className="mb-6 text-black">
                <ArrowLeft size={24} />
            </button>

            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome Back</h1>
            <p className="text-gray-500 mb-8">Sign in to Nia to continue your personalized style and fashion analysis.</p>

            <div className="space-y-4 flex-1">
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
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-14 rounded-xl bg-gray-50 border-gray-100 placeholder:text-gray-400 pr-10"
                        />
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {/* <div className="flex justify-end mt-2">
                        <button className="text-xs font-medium text-gray-400 hover:text-black transition-colors">Forgot Password?</button>
                    </div> */}
                </div>
            </div>

            <div className="mt-6">
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="bg-black text-white w-full py-4 rounded-xl font-bold text-base hover:cursor-pointer transition-colors mb-4 disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-center text-xs text-gray-400">
                    Don&apos;t have an account? <button onClick={handleSignUp} className="font-bold text-black border-b border-black pb-0.5">Sign Up</button>
                </p>

                {/* Dark Mode Toggle (Mock) */}
                <div className="absolute bottom-6 right-6">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-lg">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
