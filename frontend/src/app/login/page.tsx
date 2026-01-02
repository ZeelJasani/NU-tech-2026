"use client";

import { motion } from "framer-motion";
import { Shield, ArrowRight, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;

            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to sign in");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center pt-32 pb-20 px-6 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4 group ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg">
                        <Shield className="h-6 w-6 text-primary" />
                        <span className="text-xl font-black text-primary uppercase tracking-tighter">AlertWise</span>
                    </Link>
                    <h1 className="text-2xl font-black text-primary uppercase tracking-tight">Welcome Back</h1>
                    <p className="text-muted-foreground font-bold text-xs mt-1 uppercase tracking-wider">Please enter your details</p>
                </div>

                {/* Card */}
                <div className="bg-white border-2 border-secondary rounded-4xl p-8 shadow-sm">
                    <form className="space-y-5" onSubmit={handleLogin}>
                        {error && (
                            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-500 uppercase tracking-tight">
                                {error}
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full bg-secondary/30 border-2 border-transparent focus:border-primary/10 focus:bg-white rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold text-primary outline-none transition-all placeholder:text-muted-foreground/40"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Password</label>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-secondary/30 border-2 border-transparent focus:border-primary/10 focus:bg-white rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold text-primary outline-none transition-all placeholder:text-muted-foreground/40"
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-primary text-white rounded-xl py-4 text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/10 hover:bg-primary/95 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center justify-center gap-2 group mt-2"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                            {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">
                            New here?{" "}
                            <Link href="/register" className="text-primary hover:text-primary/70 transition-colors underline underline-offset-4 decoration-2">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">
                    Secure and Encrypted Access
                </div>
            </motion.div>
        </div>
    );
}
