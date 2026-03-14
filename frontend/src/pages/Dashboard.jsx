import React, { useState, useEffect } from 'react';
import { getDashboardKPIs, getRecentActivity } from '../api/dashboardApi';

const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [kpis, setKpis] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const load = async () => {
      setKpis(await getDashboardKPIs());
      setRecentActivity(await getRecentActivity());
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-12 font-sans pb-24">
      
      {/* Header Section */}
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">System Overview</h1>
          <p className="text-neutral-500">Live inventory tracking and operations.</p>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse"></span>
          <span className="text-xs font-medium text-neutral-300 uppercase tracking-widest">Live Sync Active</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {kpis.map((kpi, index) => (
          <div 
            key={index} 
            className="group bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-[#ccff00]/50 transition-all duration-300 cursor-default"
          >
            <h3 className="text-neutral-500 text-sm font-medium uppercase tracking-wider mb-4 group-hover:text-neutral-300 transition-colors">
              {kpi.label}
            </h3>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold tracking-tighter group-hover:text-[#ccff00] transition-colors">
                {kpi.value}
              </span>
              {kpi.status === 'critical' && (
                <span className="text-xs font-bold text-black bg-red-500 px-2 py-1 rounded-full uppercase tracking-wider animate-pulse">
                  Action Needed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area: Filters & Data Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        
        {/* Table Header & Filters */}
        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-bold tracking-tight">Recent Operations</h2>
          
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {['All', 'Receipts', 'Deliveries', 'Transfers'].map((filter) => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  activeFilter === filter 
                    ? 'bg-[#ccff00] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]' 
                    : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* The Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Transaction ID</th>
                <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</th>
                <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Product</th>
                <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Quantity</th>
                <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentActivity.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className="p-4 font-mono text-sm text-neutral-300 group-hover:text-white">{row.id}</td>
                  <td className="p-4">
                    <span className="text-sm font-medium px-3 py-1 bg-white/10 rounded-full text-neutral-300 border border-white/5">
                      {row.type}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium">{row.item}</td>
                  <td className={`p-4 text-sm font-bold ${row.qty.startsWith('+') ? 'text-[#ccff00]' : row.qty.startsWith('-') ? 'text-white' : 'text-neutral-400'}`}>
                    {row.qty}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${row.status === 'Done' ? 'bg-[#ccff00]' : row.status === 'Pending' ? 'bg-orange-400' : 'bg-blue-400'}`}></div>
                      <span className="text-sm text-neutral-400">{row.status}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-neutral-500">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
