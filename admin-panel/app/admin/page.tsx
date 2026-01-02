"use client";

import { useState } from "react";
import Overview from "@/components/admin/Overview";
import DrillManagement from "@/components/admin/DrillManagement";
import StudentTracking from "@/components/admin/StudentTracking";
import Analytics from "@/components/admin/Analytics";
import ModuleManagement from "@/components/admin/ModuleManagement";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("Overview");

    const tabs = ["Overview", "Drill Management", "Student Tracking", "Analytics", "Module Management"];

    return (
        <div className="space-y-12">
            {/* Tab Navigation */}
            <div className="flex bg-[#f1f5f9] p-1.5 rounded-2xl w-full max-w-5xl mx-auto shadow-inner border border-slate-200/50 overflow-x-auto scroller-hide">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-none sm:flex-1 px-6 py-3.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab
                                ? "bg-white text-primary shadow-sm ring-1 ring-slate-200"
                                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="animate-in fade-in duration-500">
                {activeTab === "Overview" && <Overview />}
                {activeTab === "Drill Management" && <DrillManagement />}
                {activeTab === "Student Tracking" && <StudentTracking />}
                {activeTab === "Analytics" && <Analytics />}
                {activeTab === "Module Management" && <ModuleManagement />}
            </div>
        </div>
    );
}
