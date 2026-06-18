import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Users,
  GitPullRequest,
  Briefcase,
  DollarSign,
  HelpCircle,
  TrendingUp,
  Award,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [conversionData, setConversionData] = useState([]);
  const [ticketData, setTicketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isManagement = user && (user.role === 'Admin' || user.role === 'Manager');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // KPIs (stats) is readable by everyone or handled in backend.
        // Let's call /api/reports/stats. If it requires Admin/Manager, we check.
        // If it throws 403, we handle it.
        const statsRes = await api.get('/reports/stats');
        setStats(statsRes.data.data);

        // If user is Admin or Manager, load report charts data
        if (isManagement) {
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
        }
      } catch (err) {
        console.error('Error fetching dashboard reports:', err);
        setError('Limited reporting view: Detailed analytical charts require Manager or Admin permissions.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, isManagement]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Panel */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800/80 bg-gradient-to-r from-slate-900/60 to-indigo-950/20">
        <h2 className="text-2xl font-bold text-slate-100">Welcome Back, {user?.email.split('@')[0]}!</h2>
        <p className="text-sm text-slate-400 mt-1">Here is a real-time snapshot of the CRM platform performance indicators.</p>
      </div>

      {/* KPI Cards Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-800/80 flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Customers</p>
              <p className="text-xl font-bold text-slate-100 mt-0.5">{stats.totalCustomers}</p>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800/80 flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <GitPullRequest className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Leads</p>
              <p className="text-xl font-bold text-slate-100 mt-0.5">{stats.activeLeads}</p>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800/80 flex items-center space-x-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Briefcase className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Opportunities</p>
              <p className="text-xl font-bold text-slate-100 mt-0.5">{stats.openOpportunities}</p>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800/80 flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <Award className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Closed Deals</p>
              <p className="text-xl font-bold text-slate-100 mt-0.5">{stats.closedDeals}</p>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800/80 flex items-center space-x-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Revenue</p>
              <p className="text-xl font-bold text-slate-100 mt-0.5">₹{parseFloat(stats.totalRevenue).toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800/80 flex items-center space-x-4">
            <div className="p-3 bg-rose-500/10 rounded-xl">
              <HelpCircle className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Open Tickets</p>
              <p className="text-xl font-bold text-slate-100 mt-0.5">{stats.openTickets}</p>
            </div>
          </div>
        </div>
      )}

      {/* Role Restriction warning */}
      {error && (
        <div className="flex items-center p-4 text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Analytics Charts Grid */}
      {isManagement && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Monthly Revenue Chart */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-slate-100 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-400" /> Monthly Revenue Forecast
              </h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                  <Legend />
                  <Line type="monotone" dataKey="projected_revenue" stroke="#3b82f6" strokeWidth={3} name="Revenue (₹)" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Customer Growth Chart */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-slate-100 flex items-center">
                <Users className="w-5 h-5 mr-2 text-emerald-400" /> Customer Growth
              </h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                  <Legend />
                  <Area type="monotone" dataKey="new_customers" stroke="#10b981" fillOpacity={1} fill="url(#colorGrowth)" name="New Customers" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lead Conversion Chart */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-slate-100 flex items-center">
                <GitPullRequest className="w-5 h-5 mr-2 text-amber-400" /> Lead Conversion by Source
              </h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="source" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                  <Legend />
                  <Bar dataKey="total_leads" fill="#3b82f6" name="Total Leads" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="converted_leads" fill="#10b981" name="Converted" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ticket Resolution Rate */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-slate-100 flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-rose-400" /> Ticket Resolution by Priority
              </h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ticketData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="priority" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                  <Legend />
                  <Bar dataKey="total_tickets" fill="#8b5cf6" name="Total Tickets" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved_tickets" fill="#ec4899" name="Resolved Tickets" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Dashboard;
