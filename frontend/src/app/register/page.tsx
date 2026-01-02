"use client";

import { motion } from "framer-motion";
import { Shield, ArrowRight, Mail, Lock, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState("citizen");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: role
                    }
                }
            });

            if (signUpError) throw signUpError;

            if (data.user) {
                // Profile is usually created by a trigger in Supabase (001_initial_schema.sql)
                // But we can also check if it worked
                alert("Registration successful! Please check your email for verification.");
                router.push("/login");
            }
        } catch (err: any) {
            console.error("Registration Error Details:", err);
            setError(err.message || "Failed to register. Please check console for details.");
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
                    <h1 className="text-2xl font-black text-primary uppercase tracking-tight">Create Account</h1>
                    <p className="text-muted-foreground font-bold text-xs mt-1 uppercase tracking-wider">Join our safety community</p>
                </div>

                {/* Card */}
                <div className="bg-white border-2 border-secondary rounded-4xl p-8 shadow-sm">
                    <form className="space-y-4" onSubmit={handleRegister}>
                        {error && (
                            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-500 uppercase tracking-tight">
                                {error}
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your name"
                                    required
                                    className="w-full bg-secondary/30 border-2 border-transparent focus:border-primary/10 focus:bg-white rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold text-primary outline-none transition-all placeholder:text-muted-foreground/40"
                                />
                            </div>
                        </div>

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
                            <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Choose a password"
                                    required
                                    className="w-full bg-secondary/30 border-2 border-transparent focus:border-primary/10 focus:bg-white rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold text-primary outline-none transition-all placeholder:text-muted-foreground/40"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full bg-secondary/30 border-2 border-transparent focus:border-primary/10 focus:bg-white rounded-xl py-3.5 px-4 text-sm font-bold text-primary outline-none transition-all"
                            >
                                <option value="citizen">Citizen</option>
                                <option value="student">Student</option>
                                <option value="trainer">Trainer / Teacher</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-primary text-white rounded-xl py-4 text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/10 hover:bg-primary/95 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center justify-center gap-2 group mt-4"
                        >
                            {loading ? "Creating Account..." : "Get Started"}
                            {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">
                            Already a member?{" "}
                            <Link href="/login" className="text-primary hover:text-primary/70 transition-colors underline underline-offset-4 decoration-2">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">
                    Trusted by Communities Worldwide
                </div>
            </motion.div>
        </div>
    );
}
