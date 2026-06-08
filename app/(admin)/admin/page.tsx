"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Settings,
  Headphones,
  ClipboardCheck,
  ArrowUpRight,
  TrendingUp,
  LayoutGrid
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Line
} from "recharts";

const iconMap: any = {
  Users,
  LayoutGrid,
  Headphones,
  ClipboardCheck
};

const defaultOperationsData = [
  { name: "Consultations", value: 60 },
  { name: "Payments", value: 80 },
  { name: "Documents", value: 55 },
  { name: "Reports", value: 85 },
  { name: "Approvals", value: 65 },
  { name: "Support", value: 95 }
];

const activityData = [
  { name: "Jan", value: 30 },
  { name: "Feb", value: 45 },
  { name: "Mar", value: 65 },
  { name: "Apr", value: 50 },
  { name: "May", value: 85 },
  { name: "Jun", value: 40 },
  { name: "Jul", value: 70 }
];

export default function AdminPage() {
  const [statsData, setStatsData] = useState<any[]>([]);
  const [areaData, setAreaData] = useState<any[]>([]);
  const [barData, setBarData] = useState<any[]>([]);
  const [operationsData, setOperationsData] = useState<any[]>(defaultOperationsData);
  const [isLoading, setIsLoading] = useState(true);

  const hasRealAreaData = areaData.some(item => item.value > 0);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        const data = await res.json();
        if (!data.error) {
          setStatsData(data.stats || []);
          setAreaData(data.areaData || []);
          setBarData(data.barData || []);
          if (data.operationsData && data.operationsData.length) {
            setOperationsData(data.operationsData);
          }
        }
      } catch (e) {
        console.error("Error fetching dashboard data:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 xl:space-y-4 2xl:space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, i) => {
          const IconComponent = iconMap[stat.icon];
          return (
            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex items-start justify-between group hover:shadow-md transition-all duration-300">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  {stat.change && (
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {stat.change}
                    </span>
                  )}
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform`}>
                {IconComponent && <IconComponent className="w-6 h-6" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Activity Overview */}
        <div className="bg-white p-4 md:p-6 xl:p-4 2xl:p-6 rounded-[1.5rem] border border-gray-50 shadow-sm flex flex-col md:flex-row gap-6 items-center overflow-hidden">
          <div className="w-full md:w-[35%] shrink-0">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Business Activity Overview</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Track user growth, active services, and overall platform performance in real-time. Get complete visibility into how your business is scaling.
            </p>
            <button className="text-blue-600 text-sm font-semibold flex items-center gap-2 hover:underline">
              View Analytics <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="w-full md:w-[65%] bg-blue-600 rounded-2xl h-[180px] md:h-[220px] relative overflow-hidden group p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/50 to-transparent" />
            <div className="relative h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hasRealAreaData ? areaData.slice(0, 7) : activityData} margin={{ top: 15, right: 15, left: 15, bottom: 10 }}>
                  <defs>
                    <linearGradient id="whiteGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffffff" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#ffffff" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="rgba(255, 255, 255, 0.2)" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#1D2128] px-3 py-1.5 rounded-lg border-none shadow-xl">
                            <p className="text-[10px] font-bold text-white uppercase">{payload[0].payload.name}</p>
                            <p className="text-sm font-bold text-white">{payload[0].value}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#ffffff"
                    strokeWidth={3.5}
                    fillOpacity={1}
                    fill="url(#whiteGradient)"
                    dot={{ r: 5, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 3 }}
                    activeDot={{ r: 7, fill: "#ffffff", stroke: "#2563eb", strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Operations Card */}
        <div className="bg-[#24272a] p-4 md:p-6 xl:p-4 2xl:p-6 rounded-[1.5rem] shadow-sm relative overflow-hidden group">
          <div className="relative z-10 max-w-full md:max-w-[40%] md:pr-4">
            <h3 className="text-lg font-bold text-white mb-2">Manage Your Operations Efficiently</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Handle consultations, track payments, and manage documents — all in one centralized dashboard designed for seamless business control.
            </p>
            <button className="text-white text-sm font-semibold flex items-center gap-2 hover:underline">
              Explore Features <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute right-4 bottom-4 top-4 w-full md:w-[55%] p-2 pt-8 group-hover:scale-102 transition-transform duration-500">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={operationsData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2DD4BF" stopOpacity={0.6}/>
                    <stop offset="100%" stopColor="#2DD4BF" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                  dy={10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1D2128', 
                    border: 'none', 
                    borderRadius: '12px',
                  }}
                  itemStyle={{ color: '#2DD4BF' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#barGradient)" 
                  radius={[12, 12, 0, 0]}
                  barSize={32}
                  animationDuration={1500}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2DD4BF" 
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#2DD4BF", stroke: "#24272a", strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: "#2DD4BF", stroke: "#ffffff", strokeWidth: 2 }}
                  animationDuration={2000}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Active Users Chart */}
        <div className="bg-white p-4 md:p-6 xl:p-4 2xl:p-6 rounded-[1.5rem] border border-gray-50 shadow-sm w-full group">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Active Users</h3>
              <p className="text-sm text-blue-600 font-semibold">(+23) than last week</p>
            </div>
          </div>

          <div className="h-[180px] xl:h-[140px] 2xl:h-[180px] w-full mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 shadow-xl rounded-xl border border-gray-100 animate-in zoom-in-95 duration-200">
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{payload[0].payload?.name}</p>
                          <p className="text-sm font-bold text-gray-900">{payload[0].value?.toLocaleString() ?? '0'} Users</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#334155"
                  radius={[4, 4, 4, 4]}
                  barSize={8}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 xl:gap-2 2xl:gap-4">
            {[
              { label: "Total Users", val: "32,984", icon: Users, color: "bg-blue-600", progress: 85 },
              { label: "Active Services", val: "412", icon: LayoutGrid, color: "bg-blue-500", progress: 65 },
              { label: "Pending", val: "27", icon: Headphones, color: "bg-blue-400", progress: 45 },
              { label: "Completed Orders", val: "936", icon: ClipboardCheck, color: "bg-blue-700", progress: 92 },
            ].map((item, i) => (
              <div key={i} className="space-y-1 group/item cursor-default">
                <div className="flex items-center gap-2">
                  <div className={`${item.color} w-3 h-3 rounded-sm shadow-sm group-hover/item:scale-125 transition-transform`} />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{item.label}</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{item.val}</p>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden w-full">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Overview Chart */}
        <div className="bg-white p-4 md:p-6 xl:p-4 2xl:p-6 rounded-[1.5rem] border border-gray-50 shadow-sm w-full group">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Revenue overview</h3>
              <p className="text-sm text-blue-600 font-semibold">(+5) more in 2021</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="text-[10px] font-bold text-gray-400 uppercase">This Year</span>
              </div>
            </div>
          </div>

          <div className="h-[220px] xl:h-[160px] 2xl:h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-4 shadow-2xl rounded-2xl border border-gray-100 animate-in slide-in-from-bottom-2 duration-300">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase">{payload[0].payload?.name} 2021</p>
                          </div>
                          <p className="text-xl font-black text-gray-900">${Number(payload[0].value || 0).toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between mt-6 px-4">
            {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map(month => (
              <span key={month} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{month}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}