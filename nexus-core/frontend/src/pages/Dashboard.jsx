import React, { useState, useEffect } from 'react';
import { getDashboard, healthCheck } from '../api/api';
import { useToast } from '../ui/ToastContext';

const Dashboard = () => {
  const [kpis, setKpis] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Test connectivity first
        const isHealthy = await healthCheck();
        
        if (isHealthy) {
          console.log("✅ API is reachable, loading data...");
          setKpis(await getDashboard());
        } else {
          console.log("⚠️ API unreachable, attempting data load anyway...");
          setKpis(await getDashboard());
        }
        
        // TODO: Add recent activity API call when endpoint is available
        setRecentActivity([
          { id: 'TXN-092', type: 'Receipt', item: 'Steel Rods', qty: '+500', status: 'Done', date: 'Today, 08:42 AM' },
          { id: 'TXN-093', type: 'Delivery', item: 'Lithium Batteries', qty: '-40', status: 'Pending', date: 'Today, 09:15 AM' },
          { id: 'TXN-094', type: 'Transfer', item: 'Copper Wire', qty: '120', status: 'Ready', date: 'Yesterday' },
          { id: 'TXN-095', type: 'Adjustment', item: 'Pallet Racks', qty: '-2', status: 'Done', date: 'Yesterday' },
        ]);
      } catch (err) {
        setError(err.message);
        console.error('Failed to load dashboard data:', err);
        addToast('Failed to load dashboard data', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [addToast]);

  const getKPIStatus = (status) => {
    const statusConfig = {
      optimal: 'bg-green-600',
      warning: 'bg-yellow-600',
      critical: 'bg-red-600'
    };
    return statusConfig[status] || 'bg-gray-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ccff00]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
            <p className="text-red-400">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Real-time inventory overview</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-400">{kpi.label}</h3>
                <div className={`w-2 h-2 rounded-full ${getKPIStatus(kpi.status)}`}></div>
              </div>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-b-0">
                <div className="flex items-center space-x-4">
                  <div className={`px-2 py-1 rounded text-xs ${
                    activity.type === 'Receipt' ? 'bg-green-600' : 
                    activity.type === 'Delivery' ? 'bg-blue-600' : 
                    'bg-gray-600'
                  }`}>
                    {activity.type}
                  </div>
                  <div>
                    <div className="font-medium">{activity.item}</div>
                    <div className="text-sm text-gray-400">{activity.date}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`font-bold ${
                    activity.qty.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {activity.qty}
                  </span>
                  <div className={`px-2 py-1 rounded text-xs ${
                    activity.status === 'Done' ? 'bg-green-600' : 
                    activity.status === 'Pending' ? 'bg-yellow-600' : 
                    'bg-gray-600'
                  }`}>
                    {activity.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
