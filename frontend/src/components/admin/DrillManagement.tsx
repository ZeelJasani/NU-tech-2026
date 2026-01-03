"use client";

import { Play, Settings, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DrillManagement() {
    const [drills, setDrills] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDrills = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/drills`, {
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setDrills(data.map((d: any) => ({
                    title: d.title,
                    time: new Date(d.scheduled_at).toLocaleString(),
                    status: d.status
                })));
            }
        } catch (err) {
            console.error("Failed to fetch drills:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrills();

        // Real-time updates for drills
        const channel = supabase
            .channel('public-drills-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'drills' },
                () => fetchDrills()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleStartDrill = async () => {
        const title = prompt("Enter Drill Title:", "Surprise Fire Drill");
        if (!title) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/drills`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    title,
                    scheduled_at: new Date().toISOString(),
                    status: 'pending'
                })
            });
            if (response.ok) {
                alert("Drill started and broadcasted!");
                fetchDrills();
            }
        } catch (err) {
            console.error("Failed to start drill:", err);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Drill Management</h2>
                </div>
                <button
                    onClick={handleStartDrill}
                    className="bg-[#003366] hover:bg-[#002244] text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-3 transition-all shadow-xl shadow-blue-900/10"
                >
                    <Play className="h-5 w-5 fill-white" />
                    Start Emergency Drill
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm p-8">
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-900">Scheduled Drills</h3>
                    <p className="text-sm text-slate-500 font-medium">Manage and track emergency drill sessions</p>
                </div>

                <div className="space-y-4">
                    {drills.map((drill, i) => (
                        <div key={i} className="p-6 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-slate-50">
                                    <Calendar className="h-6 w-6 text-slate-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg leading-tight">{drill.title}</h4>
                                    <p className="text-sm text-slate-500 font-medium mt-1">📅 {drill.time}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${drill.status === 'pending' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {drill.status}
                                </span>
                                <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                                    <Settings className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
