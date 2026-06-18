import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Briefcase,
  DollarSign
} from 'lucide-react';

const Opportunities = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Lookups
  const [leads, setLeads] = useState([]);
  const [products, setProducts] = useState([]);

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Form Fields
  const [oppId, setOppId] = useState('');
  const [leadId, setLeadId] = useState('');
  const [productId, setProductId] = useState('');
  const [amount, setAmount] = useState('');
  const [stage, setStage] = useState('Prospecting');
  const [expectedClose, setExpectedClose] = useState('');

  const isWriteAuthorized = user && ['Admin', 'Manager', 'Sales Executive'].includes(user.role);

  useEffect(() => {
    fetchOpportunities();
    fetchLookups();
  }, [page, stageFilter]);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        page,
        limit: 10,
        stage: stageFilter || undefined
      };
      const response = await api.get('/opportunities', { params });
      setOpportunities(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (err) {
      setError('Failed to fetch opportunities.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLookups = async () => {
    try {
      const leadsRes = await api.get('/leads', { params: { limit: 100 } });
      setLeads(leadsRes.data.data);

      const productsRes = await api.get('/products', { params: { limit: 100 } });
      setProducts(productsRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this opportunity?')) return;
    try {
      await api.delete(`/opportunities/${id}`);
      fetchOpportunities();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const handleOpenAddModal = () => {
    setIsEdit(false);
    setOppId('');
    setLeadId(leads[0]?.id || '');
    setProductId(products[0]?.id || '');
    setAmount('');
    setStage('Prospecting');
    setExpectedClose('');
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (opp) => {
    setIsEdit(true);
    setOppId(opp.id);
    setLeadId(opp.leadId.toString());
    setProductId(opp.productId.toString());
    setAmount(opp.amount);
    setStage(opp.stage);
    setExpectedClose(opp.expectedClose || '');
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        leadId: parseInt(leadId),
        productId: parseInt(productId),
        amount: parseFloat(amount),
        stage,
        expectedClose: expectedClose || null
      };

      if (isEdit) {
        await api.put(`/opportunities/${oppId}`, payload);
      } else {
        await api.post('/opportunities', payload);
      }

      setFormModalOpen(false);
      fetchOpportunities();
    } catch (err) {
      alert(err.response?.data?.message || 'Opportunity action failed.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Sales Opportunities</h2>
          <p className="text-sm text-slate-400 mt-1">Track pipeline stages, forecast revenue, and associate leads with products.</p>
        </div>
        {isWriteAuthorized && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-[0_4px_15px_rgba(59,130,246,0.2)]"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Opportunity
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row justify-end gap-4">
        <div className="flex gap-4">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-4 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-300 text-sm focus:outline-none"
          >
            <option value="">All Stages</option>
            <option value="Prospecting">Prospecting</option>
            <option value="Qualification">Qualification</option>
            <option value="Proposal">Proposal</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>

          <button
            onClick={fetchOpportunities}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl transition-all"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Main Opportunities List Table */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[250px]">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl border border-slate-800">
          <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">No opportunities found.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="p-4">Opportunity ID</th>
                  <th className="p-4">Linked Lead</th>
                  <th className="p-4">Associated Product</th>
                  <th className="p-4">Pipeline Stage</th>
                  <th className="p-4">Deal Value</th>
                  <th className="p-4">Expected Close Date</th>
                  {isWriteAuthorized && <th className="p-4">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm text-slate-300">
                {opportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-slate-800/20 transition-all">
                    <td className="p-4 font-semibold text-blue-400">#OPP-{opp.id}</td>
                    <td className="p-4">{opp.lead?.title || 'N/A'}</td>
                    <td className="p-4">{opp.product?.name || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        opp.stage === 'Closed Won' ? 'bg-emerald-500/10 text-emerald-400' :
                        opp.stage === 'Closed Lost' ? 'bg-red-500/10 text-red-400' :
                        opp.stage === 'Negotiation' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-blue-500/10 text-blue-400'
                      }`}>
                        {opp.stage}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-emerald-400">
                      ₹{parseFloat(opp.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-xs text-slate-400">{opp.expectedClose || 'N/A'}</td>
                    {isWriteAuthorized && (
                      <td className="p-4">
                        <div className="flex items-center space-x-2.5">
                          <button
                            onClick={() => handleOpenEditModal(opp)}
                            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-400 transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {user && user.role === 'Admin' && (
                            <button
                              onClick={() => handleDelete(opp.id)}
                              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
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

      {/* Modal: Create / Edit Opportunity */}
      {formModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between p-5 border-b border-slate-800/80">
              <h3 className="text-lg font-bold text-slate-100">
                {isEdit ? 'Edit Opportunity' : 'Create Opportunity'}
              </h3>
              <button onClick={() => setFormModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Associated Lead
                </label>
                <select
                  value={leadId}
                  onChange={(e) => setLeadId(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                >
                  {leads.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Linked Product
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                >
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} (₹{parseFloat(p.price).toLocaleString('en-IN')})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Deal Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                    placeholder="e.g. 5000.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Expected Close Date
                  </label>
                  <input
                    type="date"
                    value={expectedClose}
                    onChange={(e) => setExpectedClose(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Pipeline Stage
                </label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                >
                  <option value="Prospecting">Prospecting</option>
                  <option value="Qualification">Qualification</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Closed Won">Closed Won</option>
                  <option value="Closed Lost">Closed Lost</option>
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
                  {isEdit ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Opportunities;
