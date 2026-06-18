import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  MessageSquare,
  FileText,
  User,
  Activity,
  PlusCircle
} from 'lucide-react';

const Tickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Lookups
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [interactionsModalOpen, setInteractionsModalOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);
  const [interactions, setInteractions] = useState([]);

  // Form Fields (Ticket)
  const [ticketId, setTicketId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Open');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  // Form Fields (Interaction)
  const [interactType, setInteractType] = useState('Note');
  const [interactNotes, setInteractNotes] = useState('');

  const isWriteAuthorized = user && ['Admin', 'Manager', 'Support Agent'].includes(user.role);

  useEffect(() => {
    fetchTickets();
    fetchLookups();
  }, [page, priorityFilter, statusFilter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        page,
        limit: 10,
        priority: priorityFilter || undefined,
        status: statusFilter || undefined
      };
      const response = await api.get('/tickets', { params });
      setTickets(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (err) {
      setError('Failed to fetch support tickets.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLookups = async () => {
    try {
      const custRes = await api.get('/customers', { params: { limit: 100 } });
      setCustomers(custRes.data.data);

      const empRes = await api.get('/employees', { params: { limit: 100 } });
      setEmployees(empRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      await api.delete(`/tickets/${id}`);
      fetchTickets();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const handleOpenAddModal = () => {
    setIsEdit(false);
    setTicketId('');
    setCustomerId(customers[0]?.id || '');
    setAssignedToId('');
    setPriority('Medium');
    setStatus('Open');
    setSubject('');
    setDescription('');
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (t) => {
    setIsEdit(true);
    setTicketId(t.id);
    setCustomerId(t.customerId.toString());
    setAssignedToId(t.assignedToId ? t.assignedToId.toString() : '');
    setPriority(t.priority);
    setStatus(t.status);
    setSubject(t.subject);
    setDescription(t.description || '');
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        customerId: parseInt(customerId),
        assignedToId: assignedToId ? parseInt(assignedToId) : null,
        priority,
        status,
        subject,
        description
      };

      if (isEdit) {
        await api.put(`/tickets/${ticketId}`, payload);
      } else {
        await api.post('/tickets', payload);
      }

      setFormModalOpen(false);
      fetchTickets();
    } catch (err) {
      alert(err.response?.data?.message || 'Ticket action failed.');
    }
  };

  // Interaction logs methods
  const handleOpenInteractions = async (t) => {
    try {
      setActiveTicket(t);
      setInteractNotes('');
      setInteractType('Note');
      setInteractionsModalOpen(true);
      
      const response = await api.get(`/tickets/${t.id}/interactions`);
      setInteractions(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddInteraction = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/tickets/${activeTicket.id}/interactions`, {
        type: interactType,
        notes: interactNotes
      });

      if (response.data.success) {
        setInteractNotes('');
        // Refresh list
        const refreshed = await api.get(`/tickets/${activeTicket.id}/interactions`);
        setInteractions(refreshed.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to log interaction.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Support Ticket Desk</h2>
          <p className="text-sm text-slate-400 mt-1">Manage ticket queues, customer issues, SLAs, and employee log interaction histories.</p>
        </div>
        {isWriteAuthorized && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-[0_4px_15px_rgba(59,130,246,0.2)]"
          >
            <Plus className="w-5 h-5 mr-2" /> Open Ticket
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row justify-end gap-4">
        <div className="flex gap-4">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-300 text-sm focus:outline-none"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-300 text-sm focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <button
            onClick={fetchTickets}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl transition-all"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Main Tickets Table */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[250px]">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl border border-slate-800">
          <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">No support tickets found.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="p-4">Ticket</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Assigned Agent</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm text-slate-300">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/20 transition-all">
                    <td className="p-4">
                      <p className="font-semibold text-slate-200">{t.subject}</p>
                      {t.description && <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{t.description}</p>}
                    </td>
                    <td className="p-4">{t.customer ? `${t.customer.firstName} ${t.customer.lastName}` : 'N/A'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        t.priority === 'Urgent' ? 'bg-red-500/10 text-red-400' :
                        t.priority === 'High' ? 'bg-amber-500/10 text-amber-400' :
                        t.priority === 'Medium' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-slate-500/10 text-slate-450'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        t.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400' :
                        t.status === 'Closed' ? 'bg-slate-500/10 text-slate-400' :
                        t.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-blue-500/10 text-blue-400'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-400">
                      {t.assignedTo ? `${t.assignedTo.firstName} ${t.assignedTo.lastName}` : 'Unassigned'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2.5">
                        <button
                          onClick={() => handleOpenInteractions(t)}
                          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-emerald-450 transition-all"
                          title="View & Log Interactions"
                        >
                          <MessageSquare className="w-4 h-4 text-emerald-400" />
                        </button>
                        {isWriteAuthorized && (
                          <button
                            onClick={() => handleOpenEditModal(t)}
                            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-400 transition-all"
                            title="Edit Ticket"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {user && user.role === 'Admin' && (
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-all"
                            title="Delete Ticket"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-800/80 bg-slate-900/20 text-xs text-slate-400">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg disabled:opacity-50 transition-all"
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg disabled:opacity-50 transition-all"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal 1: Create / Edit Ticket */}
      {formModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between p-5 border-b border-slate-800/80">
              <h3 className="text-lg font-bold text-slate-100">
                {isEdit ? 'Edit Ticket' : 'Open Support Ticket'}
              </h3>
              <button onClick={() => setFormModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Associated Customer
                </label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                >
                  {customers.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.email})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                  placeholder="e.g. Account lockout / Subscription issue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Assign Support Agent
                </label>
                <select
                  value={assignedToId}
                  onChange={(e) => setAssignedToId(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.role?.name})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Description
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none h-20"
                  placeholder="Details about client problem..."
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800/80 mt-4">
                <button
                  type="button"
                  onClick={() => setFormModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all"
                >
                  {isEdit ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Interactions Timeline & Notes Log */}
      {interactionsModalOpen && activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-2xl rounded-2xl border border-slate-800 max-h-[85vh] overflow-y-auto scrollbar-thin">
            
            <div className="flex items-center justify-between p-5 border-b border-slate-800/80">
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-emerald-400" /> Customer Interactions History
                </h3>
                <p className="text-xs text-slate-400 mt-1">Timeline of meetings, logs, emails, and notes for customer.</p>
              </div>
              <button onClick={() => setInteractionsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Interaction Logger Form */}
              {isWriteAuthorized && (
                <form onSubmit={handleAddInteraction} className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Log New Touchpoint Interaction</h4>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <label className="block text-[10px] uppercase text-slate-400 mb-1">Type</label>
                      <select
                        value={interactType}
                        onChange={(e) => setInteractType(e.target.value)}
                        className="block w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none"
                      >
                        <option value="Call">Call</option>
                        <option value="Email">Email</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Note">Note</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] uppercase text-slate-400 mb-1">Interaction Notes</label>
                      <input
                        type="text"
                        required
                        value={interactNotes}
                        onChange={(e) => setInteractNotes(e.target.value)}
                        placeholder="Log meeting outcome or email sent..."
                        className="block w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-xs transition-all"
                    >
                      <PlusCircle className="w-3.5 h-3.5 mr-1" /> Log Touchpoint
                    </button>
                  </div>
                </form>
              )}

              {/* Interactions Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Timeline touchpoints</h4>
                
                <div className="relative border-l border-slate-800 pl-4 space-y-4">
                  {interactions.map((int) => (
                    <div key={int.id} className="relative">
                      <div className="absolute -left-[21px] mt-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border border-slate-900"></div>
                      <div className="p-3.5 bg-slate-950/40 border border-slate-850 rounded-xl text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            int.type === 'Call' ? 'bg-blue-500/10 text-blue-400' :
                            int.type === 'Email' ? 'bg-amber-500/10 text-amber-400' :
                            int.type === 'Meeting' ? 'bg-purple-500/10 text-purple-400' :
                            'bg-slate-500/10 text-slate-400'
                          }`}>
                            {int.type}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(int.interactedAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-300 italic">"{int.notes}"</p>
                        <p className="text-[10px] text-slate-400 font-semibold flex items-center">
                          <User className="w-3 h-3 mr-1" /> Logged by: {int.employee?.firstName} {int.employee?.lastName} ({int.employee?.email})
                        </p>
                      </div>
                    </div>
                  ))}

                  {interactions.length === 0 && (
                    <p className="text-xs text-slate-500 py-4">No logged interactions exist for this customer yet.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Tickets;
