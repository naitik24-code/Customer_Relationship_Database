import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Shield, RefreshCw, Clock, AlertTriangle } from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/audit');
      if (response.data.success) {
        setLogs(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch system audit logs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionBadge = (action) => {
    switch (action) {
      case 'INSERT':
        return <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">INSERT</span>;
      case 'UPDATE':
        return <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">UPDATE</span>;
      case 'DELETE':
        return <span className="px-2.5 py-1 text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 rounded-full">DELETE</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20 rounded-full">{action}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <Shield className="w-6 h-6 text-blue-500" />
            <span>Database Audit Logs</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time compliance logging powered by native MySQL database triggers.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-sm font-medium rounded-xl transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Logs
        </button>
      </div>

      {error && (
        <div className="flex items-center p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl">
          <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/20">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Log ID</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Target Table</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Record ID</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Action Type</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">User / Performed By</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-500" />
                    Fetching audit trails...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No logs found. Try performing actions (Insert, Update, Delete) on customers.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-950/20 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-300">#{log.id}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-200 capitalize">{log.table_name}</td>
                    <td className="px-6 py-4 text-sm text-slate-300 font-mono">ID {log.record_id}</td>
                    <td className="px-6 py-4 text-sm">{getActionBadge(log.action)}</td>
                    <td className="px-6 py-4 text-sm text-blue-400 font-medium">{log.performed_by_email || 'System'}</td>
                    <td className="px-6 py-4 text-sm text-slate-400 flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span>{new Date(log.performed_at).toLocaleString()}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
