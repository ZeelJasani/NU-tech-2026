"use client";

import { Search, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function StudentTracking() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const response = await fetch('http://localhost:5000/api/v1/user/students', {
                    headers: {
                        'Authorization': `Bearer ${session?.access_token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStudents(data.map((s: any) => ({
                        name: s.full_name || "Unknown User",
                        class: s.region || "General",
                        safetyScore: s.preparedness_score || 0,
                        completion: 0, // Need to fetch from quiz_attempts
                        badges: 0
                    })));
                }
            } catch (err) {
                console.error("Failed to fetch students:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Student Progress</h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">Track individual student safety scores and completion rates</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search students..."
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>
                <button className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-all">
                    <Download className="h-4 w-4" />
                    Export CSV
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Student</th>
                            <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Class</th>
                            <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Safety Score</th>
                            <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Completion</th>
                            <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Badges</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {students.map((student, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="px-8 py-6 font-bold text-slate-800">{student.name}</td>
                                <td className="px-8 py-6 text-slate-500 font-medium text-center">{student.class}</td>
                                <td className={`px-8 py-6 font-black text-center ${student.safetyScore >= 85 ? 'text-emerald-500' :
                                    student.safetyScore >= 75 ? 'text-orange-500' : 'text-rose-500'
                                    }`}>
                                    {student.safetyScore}
                                </td>
                                <td className="px-8 py-6 min-w-[200px]">
                                    <div className="flex items-center gap-4">
                                        <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#003366]" style={{ width: `${student.completion}%` }} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 w-10">{student.completion}%</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-lg">
                                        {student.badges}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
