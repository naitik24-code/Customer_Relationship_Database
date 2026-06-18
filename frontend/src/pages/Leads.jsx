import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  AlertCircle,
  GitMerge
} from 'lucide-react';

const Leads = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Lookups
  const [sources, setSources] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [activeLead, setActiveLead] = useState(null);

  // Form Fields
  const [leadId, setLeadId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sourceId, setSourceId] = useState('1');
  const [statusId, setStatusId] = useState('1');
  const [assignedToId, setAssignedToId] = useState('');

  // Conversion Fields
  const [convFirstName, setConvFirstName] = useState('');
  const [convLastName, setConvLastName] = useState('');
  const [convEmail, setConvEmail] = useState('');

  const isWriteAuthorized = user && ['Admin', 'Manager', 'Sales Executive'].includes(user.role);

  useEffect(() => {
    fetchLeads();
    fetchLookups();
  }, [page, sourceFilter, statusFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        page,
        limit: 10,
        search,
        sourceId: sourceFilter || undefined,
        statusId: statusFilter || undefined
      };
      const response = await api.get('/leads', { params });
      setLeads(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (err) {
      setError('Failed to fetch leads.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLookups = async () => {
    try {
      // Create lookups endpoints or fetch list from existing database collections.
      // For sources and statuses, we can fetch from lookups if available or estimate.
      // Let's assume we can fetch them or we have standard ids (1-10 sources, 1-6 statuses).
      // We can fetch employees lists for assignment.
      const employeesRes = await api.get('/employees', { params: { limit: 100 } });
      setEmployees(employeesRes.data.data);

      // We can hardcode standard lists or make mock lookups matching schema.sql
      setSources([
        { id: 1, name: 'Website Form' },
        { id: 2, name: 'Referral' },
        { id: 3, name: 'Cold Call' },
        { id: 4, name: 'LinkedIn Outreach' },
        { id: 5, name: 'Email Marketing' },
        { id: 6, name: 'Partner Referral' },
        { id: 7, name: 'Google Search (SEO)' },
        { id: 8, name: 'PPC Ad Campaign' },
        { id: 9, name: 'Webinar / Event' },
        { id: 10, name: 'Direct Mail' }
      ]);

      setStatuses([
        { id: 1, name: 'New' },
        { id: 2, name: 'Contacted' },
        { id: 3, name: 'Qualified' },
        { id: 4, name: 'Proposal Sent' },
        { id: 5, name: 'Converted' },
        { id: 6, name: 'Lost' }
      ]);
    } catch (err) {
      console.error('Error fetching lookups:', err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLeads();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const handleOpenAddModal = () => {
    setIsEdit(false);
    setLeadId('');
    setTitle('');
    setDescription('');
    setSourceId('1');
    setStatusId('1');
    setAssignedToId('');
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (lead) => {
    setIsEdit(true);
    setLeadId(lead.id);
    setTitle(lead.title);
    setDescription(lead.description || '');
    setSourceId(lead.sourceId.toString());
    setStatusId(lead.statusId.toString());
    setAssignedToId(lead.assignedToId ? lead.assignedToId.toString() : '');
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        description,
        sourceId: parseInt(sourceId),
        statusId: parseInt(statusId),
        assignedToId: assignedToId ? parseInt(assignedToId) : null
      };

      if (isEdit) {
        await api.put(`/leads/${leadId}`, payload);
      } else {
        await api.post('/leads', payload);
      }

      setFormModalOpen(false);
      fetchLeads();
    } catch (err) {
      alert(err.response?.data?.message || 'Lead action failed.');
    }
  };

  const handleOpenConvertModal = (lead) => {
    setActiveLead(lead);
    setConvFirstName('');
    setConvLastName('');
    setConvEmail('');
    setConvertModalOpen(true);
  };

  const handleConvertSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calls POST /api/leads/:id/convert which calls the SQL Stored Procedure
      const response = await api.post(`/leads/${activeLead.id}/convert`, {
        firstName: convFirstName,
        lastName: convLastName,
        email: convEmail
      });

      if (response.data.success) {
        alert('Lead successfully converted to customer using stored procedure sp_convert_lead_to_customer!');
        setConvertModalOpen(false);
        fetchLeads();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lead conversion failed.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Leads Tracking</h2>
          <p className="text-sm text-slate-400 mt-1">Acquire prospective client leads and push them through conversion workflows.</p>
        </div>
        {isWriteAuthorized && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-[0_4px_15px_rgba(59,130,246,0.2)]"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Lead
          </button>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-card p-4 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-slate-200 text-sm focus:outline-none transition-all"
          />
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
        </form>

        <div className="flex gap-4">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-4 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-300 text-sm focus:outline-none"
          >
            <option value="">All Sources</option>
            {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-300 text-sm focus:outline-none"
          >
            <option value="">All Statuses</option>
            {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          <button
            onClick={fetchLeads}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl transition-all"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Main Leads Table */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[250px]">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : leads.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl border border-slate-800">
          <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">No leads registered matching filters.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="p-4">Lead Title</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Assigned Representative</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm text-slate-300">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/20 transition-all">
                    <td className="p-4">
                      <p className="font-medium text-slate-200">{lead.title}</p>
                      {lead.description && <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{lead.description}</p>}
                    </td>
                    <td className="p-4 text-xs text-slate-400">{lead.source?.name}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        lead.statusId === 1 ? 'bg-blue-500/10 text-blue-400' :
                        lead.statusId === 2 ? 'bg-amber-500/10 text-amber-400' :
                        lead.statusId === 3 ? 'bg-purple-500/10 text-purple-400' :
                        lead.statusId === 4 ? 'bg-pink-500/10 text-pink-400' :
                        lead.statusId === 5 ? 'bg-emerald-500/10 text-emerald-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {lead.status?.name}
                      </span>
                    </td>
                    <td className="p-4 text-xs">
                      {lead.assignedTo ? `${lead.assignedTo.firstName} ${lead.assignedTo.lastName}` : <span className="text-slate-600">Unassigned</span>}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2.5">
                        {isWriteAuthorized && lead.statusId !== 5 && (
                          <button
                            onClick={() => handleOpenConvertModal(lead)}
                            className="p-1.5 hover:bg-slate-800 rounded-lg text-emerald-400 hover:text-emerald-300 transition-all"
                            title="Convert Lead to Customer (Stored Procedure)"
                          >
                            <GitMerge className="w-4 h-4" />
                          </button>
                        )}
                        {isWriteAuthorized && (
                          <button
                            onClick={() => handleOpenEditModal(lead)}
                            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-400 transition-all"
                            title="Edit Lead"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {user && user.role === 'Admin' && (
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-all"
                            title="Delete Lead"
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

      {/* Modal 1: Create / Edit Lead Form */}
      {formModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between p-5 border-b border-slate-800/80">
              <h3 className="text-lg font-bold text-slate-100">
                {isEdit ? 'Edit Lead details' : 'Create New Lead'}
              </h3>
              <button onClick={() => setFormModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Lead Title / Company
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                  placeholder="e.g. Acme Corp License Deal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none h-20"
                  placeholder="Notes about client requirements..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Lead Source
                  </label>
                  <select
                    value={sourceId}
                    onChange={(e) => setSourceId(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                  >
                    {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Lead Status
                  </label>
                  <select
                    value={statusId}
                    onChange={(e) => setStatusId(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                  >
                    {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Assign Representative
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
                  {isEdit ? 'Save Changes' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Convert Lead to Customer (Stored Procedure integration) */}
      {convertModalOpen && activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between p-5 border-b border-slate-800/80">
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center">
                  <GitMerge className="w-5 h-5 mr-2 text-emerald-400" /> Convert Lead
                </h3>
                <p className="text-xs text-slate-400 mt-1">Converts lead using stored procedure and creates customer profile.</p>
              </div>
              <button onClick={() => setConvertModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConvertSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Customer First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={convFirstName}
                    onChange={(e) => setConvFirstName(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Customer Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={convLastName}
                    onChange={(e) => setConvLastName(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                    placeholder="Smith"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Customer Email Address
                </label>
                <input
                  type="email"
                  required
                  value={convEmail}
                  onChange={(e) => setConvEmail(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                  placeholder="jane.smith@corporation.com"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800/80 mt-4">
                <button
                  type="button"
                  onClick={() => setConvertModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-all shadow-[0_4px_15px_rgba(16,185,129,0.2)]"
                >
                  Convert Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Leads;
