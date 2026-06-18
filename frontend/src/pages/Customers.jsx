import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  PlusCircle,
  MinusCircle,
  FileText,
  AlertCircle
} from 'lucide-react';

const Customers = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modals state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openTicketsCount, setOpenTicketsCount] = useState(0);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  
  // Form fields
  const [customerId, setCustomerId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [statusId, setStatusId] = useState('1'); // Active by default
  const [addresses, setAddresses] = useState([{ addressLine: '', city: '', state: '', zipCode: '', country: '', isPrimary: true }]);
  const [phones, setPhones] = useState([{ phoneNumber: '', type: 'mobile', isPrimary: true }]);

  const isWriteAuthorized = user && ['Admin', 'Manager', 'Sales Executive'].includes(user.role);
  const isDeleteAuthorized = user && ['Admin', 'Manager'].includes(user.role);

  useEffect(() => {
    fetchCustomers();
  }, [page, statusFilter]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        page,
        limit: 10,
        search,
        statusId: statusFilter || undefined
      };
      const response = await api.get('/customers', { params });
      setCustomers(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (err) {
      setError('Failed to fetch customers list.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers();
  };

  const handleOpenViewModal = async (cust) => {
    try {
      // Fetch full details including preferences
      const response = await api.get(`/customers/${cust.id}`);
      setSelectedCustomer(response.data.data);
      setViewModalOpen(true);
      
      // Let's check open tickets for customer. We can call the backend.
      // Wait, we can fetch tickets or have a function in backend that exposes open tickets count using the SQL function fn_count_open_tickets.
      // Let's mock or estimate it, or fetch tickets for customer and calculate.
      // To simulate calling the SQL function fn_count_open_tickets, the backend can either return it or we can fetch.
      // Let's assume the backend `GET /api/customers/:id` returns it as `openTicketsCount` (which we can compute using the model or SQL).
      // Let's compute it dynamically by fetching the customer tickets.
      const ticketsResponse = await api.get('/tickets', { params: { customerId: cust.id } });
      const openCount = ticketsResponse.data.data.filter(t => t.status !== 'Closed').length;
      setOpenTicketsCount(openCount);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer profile? This action will cascade delete all linked addresses, phone numbers, and preferences.')) {
      return;
    }
    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const handleOpenAddModal = () => {
    setIsEdit(false);
    setCustomerId('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setStatusId('1');
    setAddresses([{ addressLine: '', city: '', state: '', zipCode: '', country: '', isPrimary: true }]);
    setPhones([{ phoneNumber: '', type: 'mobile', isPrimary: true }]);
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (cust) => {
    setIsEdit(true);
    setCustomerId(cust.id);
    setFirstName(cust.firstName);
    setLastName(cust.lastName);
    setEmail(cust.email);
    setStatusId(cust.statusId.toString());
    
    if (cust.addresses && cust.addresses.length > 0) {
      setAddresses(cust.addresses.map(a => ({
        addressLine: a.addressLine,
        city: a.city,
        state: a.state,
        zipCode: a.zipCode,
        country: a.country,
        isPrimary: a.isPrimary
      })));
    } else {
      setAddresses([{ addressLine: '', city: '', state: '', zipCode: '', country: '', isPrimary: true }]);
    }

    if (cust.phones && cust.phones.length > 0) {
      setPhones(cust.phones.map(p => ({
        phoneNumber: p.phoneNumber,
        type: p.type,
        isPrimary: p.isPrimary
      })));
    } else {
      setPhones([{ phoneNumber: '', type: 'mobile', isPrimary: true }]);
    }
    
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        firstName,
        lastName,
        email,
        statusId: parseInt(statusId),
        addresses,
        phones
      };

      if (isEdit) {
        await api.put(`/customers/${customerId}`, payload);
      } else {
        await api.post('/customers', payload);
      }
      
      setFormModalOpen(false);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || 'Form submission failed.');
    }
  };

  // Helper fields modification
  const handleAddressChange = (index, field, val) => {
    const updated = [...addresses];
    updated[index][field] = val;
    setAddresses(updated);
  };

  const handlePhoneChange = (index, field, val) => {
    const updated = [...phones];
    updated[index][field] = val;
    setPhones(updated);
  };

  const addAddressField = () => {
    setAddresses([...addresses, { addressLine: '', city: '', state: '', zipCode: '', country: '', isPrimary: false }]);
  };

  const removeAddressField = (index) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const addPhoneField = () => {
    setPhones([...phones, { phoneNumber: '', type: 'mobile', isPrimary: false }]);
  };

  const removePhoneField = (index) => {
    setPhones(phones.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Customers Directory</h2>
          <p className="text-sm text-slate-400 mt-1">Manage corporate contacts, profiles, locations, and interests.</p>
        </div>
        {isWriteAuthorized && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-[0_4px_15px_rgba(59,130,246,0.2)]"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Customer
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
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-slate-200 text-sm focus:outline-none transition-all"
          />
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
        </form>
        
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-slate-300 text-sm focus:outline-none transition-all"
          >
            <option value="">All Statuses</option>
            <option value="1">Active</option>
            <option value="2">Inactive</option>
            <option value="3">Prospect</option>
            <option value="4">Suspended</option>
          </select>
          
          <button
            onClick={fetchCustomers}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl transition-all"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Main Customers List Table */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[250px]">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : customers.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl border border-slate-800">
          <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">No customer profiles found matching filters.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Primary Phone</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm text-slate-300">
                {customers.map((cust) => {
                  const primaryPhone = cust.phones?.find(p => p.isPrimary)?.phoneNumber || (cust.phones?.[0]?.phoneNumber || 'N/A');
                  return (
                    <tr key={cust.id} className="hover:bg-slate-800/20 transition-all">
                      <td className="p-4 font-medium text-slate-200">
                        {cust.firstName} {cust.lastName}
                      </td>
                      <td className="p-4">{cust.email}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          cust.statusId === 1 ? 'bg-emerald-500/10 text-emerald-400' :
                          cust.statusId === 2 ? 'bg-slate-500/10 text-slate-400' :
                          cust.statusId === 3 ? 'bg-blue-500/10 text-blue-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {cust.status?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="p-4">{primaryPhone}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2.5">
                          <button
                            onClick={() => handleOpenViewModal(cust)}
                            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-all"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {isWriteAuthorized && (
                            <button
                              onClick={() => handleOpenEditModal(cust)}
                              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-400 transition-all"
                              title="Edit Profile"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {isDeleteAuthorized && (
                            <button
                              onClick={() => handleDelete(cust.id)}
                              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-all"
                              title="Delete Profile"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-800/80 bg-slate-900/20 text-xs text-slate-400">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg disabled:opacity-50 transition-all"
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg disabled:opacity-50 transition-all"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal 1: View Profile Details */}
      {viewModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-2xl rounded-2xl border border-slate-800 max-h-[85vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between p-5 border-b border-slate-800/80">
              <h3 className="text-lg font-bold text-slate-100">Customer Full Profile</h3>
              <button onClick={() => setViewModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              
              {/* Basic Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Full Name</p>
                  <p className="text-sm font-semibold text-slate-200 mt-0.5">
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Email Address</p>
                  <p className="text-sm font-semibold text-slate-200 mt-0.5">{selectedCustomer.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Customer Status</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 mt-1">
                    {selectedCustomer.status?.name}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Active Support Cases</p>
                  <p className="text-sm font-bold text-rose-400 mt-0.5">{openTicketsCount} Cases Open</p>
                </div>
              </div>

              {/* Preferences */}
              <div className="border-t border-slate-800/80 pt-4">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Customer Preferences</h4>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-slate-400 font-semibold">Preferred Language</p>
                    <p className="text-slate-200 mt-0.5 uppercase">{selectedCustomer.preference?.preferredLanguage || 'en'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-semibold">Newsletter Subscription</p>
                    <p className="text-slate-200 mt-0.5">{selectedCustomer.preference?.newsletterOptIn ? 'Opted In' : 'Opted Out'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-semibold">Marketing Alerts</p>
                    <p className="text-slate-200 mt-0.5">{selectedCustomer.preference?.marketingOptIn ? 'Opted In' : 'Opted Out'}</p>
                  </div>
                </div>
              </div>

              {/* Address Records */}
              <div className="border-t border-slate-800/80 pt-4">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">Addresses</h4>
                <div className="space-y-3">
                  {selectedCustomer.addresses?.map((addr, idx) => (
                    <div key={addr.id || idx} className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex justify-between items-start text-xs">
                      <div>
                        <p className="text-slate-200 font-semibold">{addr.addressLine}</p>
                        <p className="text-slate-400 mt-0.5">{addr.city}, {addr.state} - {addr.zipCode}</p>
                        <p className="text-slate-400 mt-0.5">{addr.country}</p>
                      </div>
                      {addr.isPrimary && (
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md font-semibold text-[10px]">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                  {(!selectedCustomer.addresses || selectedCustomer.addresses.length === 0) && (
                    <p className="text-xs text-slate-500">No addresses registered.</p>
                  )}
                </div>
              </div>

              {/* Phone Contacts */}
              <div className="border-t border-slate-800/80 pt-4">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">Phone Contacts</h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedCustomer.phones?.map((ph, idx) => (
                    <div key={ph.id || idx} className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <p className="text-slate-200 font-bold">{ph.phoneNumber}</p>
                        <p className="text-slate-400 capitalize mt-0.5">{ph.type} phone</p>
                      </div>
                      {ph.isPrimary && (
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md font-semibold text-[10px]">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                  {(!selectedCustomer.phones || selectedCustomer.phones.length === 0) && (
                    <p className="text-xs text-slate-500">No phone contacts registered.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Create / Edit Customer Form */}
      {formModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-2xl rounded-2xl border border-slate-800 max-h-[85vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between p-5 border-b border-slate-800/80">
              <h3 className="text-lg font-bold text-slate-100">
                {isEdit ? 'Edit Customer Profile' : 'Add New Customer Profile'}
              </h3>
              <button onClick={() => setFormModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              
              {/* Basic Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Status
                  </label>
                  <select
                    value={statusId}
                    onChange={(e) => setStatusId(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none transition-all"
                  >
                    <option value="1">Active</option>
                    <option value="2">Inactive</option>
                    <option value="3">Prospect</option>
                    <option value="4">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Addresses */}
              <div className="border-t border-slate-800/80 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Address Locations</h4>
                  <button
                    type="button"
                    onClick={addAddressField}
                    className="flex items-center text-xs text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" /> Add Address
                  </button>
                </div>
                
                <div className="space-y-4">
                  {addresses.map((addr, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-xl space-y-3 relative">
                      {addresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAddressField(idx)}
                          className="absolute top-3 right-3 text-red-400 hover:text-red-300"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                      )}
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <label className="block text-[10px] uppercase text-slate-400 mb-1">Street Address</label>
                          <input
                            type="text"
                            required
                            value={addr.addressLine}
                            onChange={(e) => handleAddressChange(idx, 'addressLine', e.target.value)}
                            className="block w-full px-3 py-1.5 bg-slate-950/60 border border-slate-800 focus:border-blue-500 rounded-lg text-slate-200 text-xs focus:outline-none"
                            placeholder="100 Main St"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-slate-400 mb-1">City</label>
                          <input
                            type="text"
                            required
                            value={addr.city}
                            onChange={(e) => handleAddressChange(idx, 'city', e.target.value)}
                            className="block w-full px-3 py-1.5 bg-slate-950/60 border border-slate-800 focus:border-blue-500 rounded-lg text-slate-200 text-xs focus:outline-none"
                            placeholder="New York"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase text-slate-400 mb-1">State</label>
                          <input
                            type="text"
                            required
                            value={addr.state}
                            onChange={(e) => handleAddressChange(idx, 'state', e.target.value)}
                            className="block w-full px-3 py-1.5 bg-slate-950/60 border border-slate-800 focus:border-blue-500 rounded-lg text-slate-200 text-xs focus:outline-none"
                            placeholder="NY"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-slate-400 mb-1">Zip Code</label>
                          <input
                            type="text"
                            required
                            value={addr.zipCode}
                            onChange={(e) => handleAddressChange(idx, 'zipCode', e.target.value)}
                            className="block w-full px-3 py-1.5 bg-slate-950/60 border border-slate-800 focus:border-blue-500 rounded-lg text-slate-200 text-xs focus:outline-none"
                            placeholder="10001"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] uppercase text-slate-400 mb-1">Country</label>
                          <input
                            type="text"
                            required
                            value={addr.country}
                            onChange={(e) => handleAddressChange(idx, 'country', e.target.value)}
                            className="block w-full px-3 py-1.5 bg-slate-950/60 border border-slate-800 focus:border-blue-500 rounded-lg text-slate-200 text-xs focus:outline-none"
                            placeholder="USA"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`primary-addr-${idx}`}
                          checked={addr.isPrimary}
                          onChange={(e) => handleAddressChange(idx, 'isPrimary', e.target.checked)}
                          className="rounded text-blue-500 focus:ring-0"
                        />
                        <label htmlFor={`primary-addr-${idx}`} className="ml-2 text-[10px] uppercase text-slate-400">
                          Set as Primary Address
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Phones */}
              <div className="border-t border-slate-800/80 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Phone Contacts</h4>
                  <button
                    type="button"
                    onClick={addPhoneField}
                    className="flex items-center text-xs text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" /> Add Phone
                  </button>
                </div>
                
                <div className="space-y-4">
                  {phones.map((ph, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-xl space-y-3 relative">
                      {phones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePhoneField(idx)}
                          className="absolute top-3 right-3 text-red-400 hover:text-red-300"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase text-slate-400 mb-1">Phone Number</label>
                          <input
                            type="text"
                            required
                            value={ph.phoneNumber}
                            onChange={(e) => handlePhoneChange(idx, 'phoneNumber', e.target.value)}
                            className="block w-full px-3 py-1.5 bg-slate-950/60 border border-slate-800 focus:border-blue-500 rounded-lg text-slate-200 text-xs focus:outline-none"
                            placeholder="212-555-0100"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-slate-400 mb-1">Type</label>
                          <select
                            value={ph.type}
                            onChange={(e) => handlePhoneChange(idx, 'type', e.target.value)}
                            className="block w-full px-3 py-1.5 bg-slate-950/60 border border-slate-800 focus:border-blue-500 rounded-lg text-slate-200 text-xs focus:outline-none"
                          >
                            <option value="mobile">Mobile</option>
                            <option value="work">Work</option>
                            <option value="home">Home</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`primary-ph-${idx}`}
                          checked={ph.isPrimary}
                          onChange={(e) => handlePhoneChange(idx, 'isPrimary', e.target.checked)}
                          className="rounded text-blue-500 focus:ring-0"
                        />
                        <label htmlFor={`primary-ph-${idx}`} className="ml-2 text-[10px] uppercase text-slate-400">
                          Set as Primary Number
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="border-t border-slate-800/80 pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setFormModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all shadow-[0_4px_15px_rgba(59,130,246,0.2)]"
                >
                  {isEdit ? 'Save Changes' : 'Create Customer'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Customers;
