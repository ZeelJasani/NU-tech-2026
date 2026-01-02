"use client";

import { AlertTriangle, Users, TrendingUp, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";

export default function Overview() {
    const { session } = useAuth();
    const [stats, setStats] = useState([
        { label: "Total Students", value: "0", trend: "Syncing...", icon: Users },
        { label: "Average Safety Score", value: "0", trend: "Syncing...", icon: TrendingUp },
        { label: "Drills This Month", value: "0", trend: "Syncing...", icon: Calendar },
        { label: "Active SOS Alerts", value: "0", trend: "Calculating...", icon: AlertTriangle, critical: false },
    ]);

    const [alerts, setAlerts] = useState<any[]>([]);

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/v1/user/stats', {
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setStats([
                    { label: "Total Students", value: data.totalStudents.toString(), trend: "+12 from last month", icon: Users },
                    { label: "Average Safety Score", value: data.averageScore.toString(), trend: "+5% from last week", icon: TrendingUp },
                    { label: "Drills This Month", value: data.drillsThisMonth.toString(), trend: "2 scheduled", icon: Calendar },
                    { label: "Active SOS Alerts", value: data.activeAlerts.toString(), trend: data.activeAlerts > 0 ? "Requires attention" : "Everything clear", icon: AlertTriangle, critical: data.activeAlerts > 0 },
                ]);
            }
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        }
    };

    const fetchAlerts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/v1/alerts');
            if (response.ok) {
                const data = await response.json();
                setAlerts(data.map((a: any) => ({
                    id: a.id,
                    name: a.title,
                    location: a.region || "All Regions",
                    time: new Date(a.created_at).toLocaleTimeString(),
                    status: a.active ? "Active" : "Resolved",
                    severity: a.severity
                })));
            }
        } catch (err) {
            console.error("Failed to fetch alerts:", err);
        }
    };

    useEffect(() => {
        if (session) {
            fetchStats();
        }
        fetchAlerts();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('public-alerts-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'alerts' },
                (payload) => {
                    console.log('Change received!', payload);
                    fetchAlerts();
                    if (session) fetchStats();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [session]);

    const handleResolve = async (id: string, action: string) => {
        if (!session) return alert("Must be logged in to resolve alerts");
        try {
            const response = await fetch(`http://localhost:5000/api/v1/alerts/${id}/deactivate`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action }) // 'resolve' or 'false_alarm' if supported backend
            });
            if (response.ok) {
                fetchAlerts();
                fetchStats();
            }
        } catch (err) {
            console.error("Failed to resolve alert:", err);
        }
    };

    return (
        <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-bold text-slate-500">{stat.label}</p>
                            <stat.icon className={`h-5 w-5 ${stat.critical ? 'text-rose-500' : 'text-slate-400'}`} />
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-4xl font-black ${stat.critical ? 'text-rose-600' : 'text-slate-900'}`}>{stat.value}</span>
                            <span className="text-xs font-medium text-slate-400 mt-2">{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* SOS Alerts Section */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-8 pb-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-rose-500" />
                        Live Broadcasts & SOS
                    </h2>
                    <span className="text-xs font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
                        Real-time Connected
                    </span>
                </div>
                <div className="px-8 pb-8 space-y-4">
                    {alerts.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 font-medium">
                            No active alerts or SOS signals at the moment.
                        </div>
                    ) : alerts.map((alert, i) => (
                        <div key={i} className="group p-6 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className={`mt-1 h-3 w-3 rounded-full ${alert.status === 'Active' ? (alert.severity === 'critical' ? 'bg-rose-500 animate-pulse' : 'bg-orange-400') : 'bg-slate-300'}`} />
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{alert.name}</h3>
                                    <p className="text-sm text-slate-500 font-medium mt-1">📍 {alert.location}</p>
                                    <p className="text-xs text-slate-400 font-medium mt-1">{alert.time}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {alert.status === 'Active' && (
                                    <>
                                        <button
                                            onClick={() => handleResolve(alert.id, 'resolve')}
                                            className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 transition-all"
                                        >
                                            Mark Resolved
                                        </button>
                                        <button
                                            onClick={() => handleResolve(alert.id, 'false_alarm')}
                                            className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-bold transition-all"
                                        >
                                            False Alarm
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
