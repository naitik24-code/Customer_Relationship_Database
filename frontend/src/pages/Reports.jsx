import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp,
  Users,
  GitPullRequest,
  HelpCircle,
  FileSpreadsheet,
  Download,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';

const Reports = () => {
  const { user } = useAuth();
  const [revenueData, setRevenueData] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [conversionData, setConversionData] = useState([]);
  const [ticketData, setTicketData] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isManagement = user && (user.role === 'Admin' || user.role === 'Manager');

  useEffect(() => {
    if (isManagement) {
      fetchReportsData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [revRes, growthRes, convRes, ticketRes] = await Promise.all([
        api.get('/reports/revenue'),
        api.get('/reports/growth'),
        api.get('/reports/lead-conversion'),
        api.get('/reports/ticket-resolution')
      ]);

      setRevenueData(revRes.data.data);
      setGrowthData(growthRes.data.data);
      setConversionData(convRes.data.data);
      setTicketData(ticketRes.data.data);
    } catch (err) {
      setError('Failed to fetch analytical reports database views.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportMockCSV = (reportName, data) => {
    alert(`Exporting ${reportName} report to CSV format... (Simulated download matching database view contents)`);
  };

  if (!isManagement) {
    return (
      <div className="glass-card p-12 text-center rounded-2xl border border-slate-800">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-100 mb-2">Access Restrict System Warning</h3>
        <p className="text-slate-400">Reports dashboards contain sensitive corporate details and require Management permissions.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Enterprise Reports center</h2>
          <p className="text-sm text-slate-400 mt-1">Directly queries analytical MySQL database views.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Card 1: Revenue Forecast View */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-100 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-400" /> Monthly Revenue Forecast (v_monthly_revenue)
            </h3>
            <button
              onClick={() => exportMockCSV('v_monthly_revenue', revenueData)}
              className="flex items-center py-1.5 px-3 bg-slate-800 hover:bg-slate-750 text-xs font-semibold rounded-lg text-slate-350 transition-all border border-slate-700/50"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> CSV
            </button>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                <Line type="monotone" dataKey="projected_revenue" stroke="#3b82f6" strokeWidth={2.5} name="Projected Revenue (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto scrollbar-thin max-h-40 border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                  <th className="p-3">Forecast Month</th>
                  <th className="p-3">Deals Count</th>
                  <th className="p-3">Projected Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {revenueData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/10">
                    <td className="p-3">{row.month}</td>
                    <td className="p-3 font-semibold text-blue-400">{row.deals_count} deals</td>
                    <td className="p-3 font-semibold text-emerald-400">₹{parseFloat(row.projected_revenue).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 2: Customer Growth View */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-100 flex items-center">
              <Users className="w-5 h-5 mr-2 text-emerald-400" /> Customer Growth Metrics (v_customer_growth)
            </h3>
            <button
              onClick={() => exportMockCSV('v_customer_growth', growthData)}
              className="flex items-center py-1.5 px-3 bg-slate-800 hover:bg-slate-750 text-xs font-semibold rounded-lg text-slate-350 transition-all border border-slate-700/50"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> CSV
            </button>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                <Area type="monotone" dataKey="new_customers" stroke="#10b981" fill="rgba(16,185,129,0.15)" name="New signups" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto scrollbar-thin max-h-40 border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                  <th className="p-3">Calendar Month</th>
                  <th className="p-3">New Registrations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {growthData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/10">
                    <td className="p-3">{row.month}</td>
                    <td className="p-3 font-semibold text-emerald-400">+{row.new_customers} customers</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 3: Lead Conversion View */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-100 flex items-center">
              <GitPullRequest className="w-5 h-5 mr-2 text-amber-400" /> Lead Conversion efficiency (v_lead_conversion)
            </h3>
            <button
              onClick={() => exportMockCSV('v_lead_conversion', conversionData)}
              className="flex items-center py-1.5 px-3 bg-slate-800 hover:bg-slate-750 text-xs font-semibold rounded-lg text-slate-350 transition-all border border-slate-700/50"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> CSV
            </button>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="source" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                <Legend />
                <Bar dataKey="total_leads" fill="#3b82f6" name="Total Incoming" />
                <Bar dataKey="converted_leads" fill="#10b981" name="Converted" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto scrollbar-thin max-h-40 border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                  <th className="p-3">Source Channel</th>
                  <th className="p-3">Total Leads</th>
                  <th className="p-3">Converted Leads</th>
                  <th className="p-3">Conversion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {conversionData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/10">
                    <td className="p-3">{row.source}</td>
                    <td className="p-3">{row.total_leads}</td>
                    <td className="p-3 font-semibold text-emerald-400">{row.converted_leads}</td>
                    <td className="p-3 font-bold text-blue-400">{parseFloat(row.conversion_rate).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 4: Ticket Resolution View */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-100 flex items-center">
              <HelpCircle className="w-5 h-5 mr-2 text-rose-400" /> Support Desk Resolution rates (v_ticket_resolution)
            </h3>
            <button
              onClick={() => exportMockCSV('v_ticket_resolution', ticketData)}
              className="flex items-center py-1.5 px-3 bg-slate-800 hover:bg-slate-750 text-xs font-semibold rounded-lg text-slate-350 transition-all border border-slate-700/50"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> CSV
            </button>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ticketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="priority" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                <Legend />
                <Bar dataKey="total_tickets" fill="#8b5cf6" name="Total Tickets" />
                <Bar dataKey="resolved_tickets" fill="#ec4899" name="Resolved Tickets" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto scrollbar-thin max-h-40 border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                  <th className="p-3">Priority level</th>
                  <th className="p-3">Total Tickets</th>
                  <th className="p-3">Resolved</th>
                  <th className="p-3">Resolution Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {ticketData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/10">
                    <td className="p-3 font-semibold text-rose-450">{row.priority}</td>
                    <td className="p-3">{row.total_tickets}</td>
                    <td className="p-3 font-semibold text-emerald-450">{row.resolved_tickets}</td>
                    <td className="p-3 font-bold text-blue-450">{parseFloat(row.resolution_rate).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Reports;
