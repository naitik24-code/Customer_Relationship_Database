import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  UserCheck,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';

const Employees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form Fields
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  
  const [empId, setEmpId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('3'); // default Sales Executive
  const [isActive, setIsActive] = useState(true);

  const isAdmin = user && user.role === 'Admin';

  useEffect(() => {
    fetchEmployees();
  }, [page]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const params = { page, limit: 10 };
      const response = await api.get('/employees', { params });
      setEmployees(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (err) {
      setError('Access Denied: Only Admin and Managers can review employees roster.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      alert('Only Admins can delete employee records.');
      return;
    }
    if (id === user.id) {
      alert('Cannot delete your own active account.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this employee record?')) return;
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const handleOpenAddModal = () => {
    if (!isAdmin) {
      alert('Only Admins can register new employee accounts.');
      return;
    }
    setIsEdit(false);
    setEmpId('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setRoleId('3');
    setIsActive(true);
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (emp) => {
    setIsEdit(true);
    setEmpId(emp.id);
    setFirstName(emp.firstName);
    setLastName(emp.lastName);
    setEmail(emp.email);
    setPassword('');
    setRoleId(emp.roleId.toString());
    setIsActive(emp.isActive);
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        firstName,
        lastName,
        email,
        roleId: parseInt(roleId),
        isActive
      };

      if (password) {
        payload.password = password;
      } else if (!isEdit) {
        alert('Password is required for new employee registrations.');
        return;
      }

      if (isEdit) {
        await api.put(`/employees/${empId}`, payload);
      } else {
        await api.post('/employees', payload);
      }

      setFormModalOpen(false);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Employee Roster & Accounts</h2>
          <p className="text-sm text-slate-400 mt-1">Review team members, modify security permission roles, and disable active sessions.</p>
        </div>
        {isAdmin && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-[0_4px_15px_rgba(59,130,246,0.2)]"
          >
            <Plus className="w-5 h-5 mr-2" /> Register Employee
          </button>
        )}
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[250px]">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="glass-card p-12 text-center rounded-2xl border border-slate-800">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-400">{error}</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="p-4">Employee Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role Permission</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm text-slate-300">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-800/20 transition-all">
                    <td className="p-4 font-medium text-slate-200">{emp.firstName} {emp.lastName}</td>
                    <td className="p-4">{emp.email}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400">
                        {emp.role?.name}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        emp.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {emp.isActive ? 'Active' : 'Pending Approval'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2.5">
                        <button
                          onClick={() => handleOpenEditModal(emp)}
                          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-400 transition-all"
                          title="Edit Employee"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(emp.id)}
                            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-all"
                            title="Delete Employee"
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
                className="py-1.5 px-3 bg-slate-800 text-slate-350 font-semibold rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="py-1.5 px-3 bg-slate-800 text-slate-350 font-semibold rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal: Create / Edit Employee */}
      {formModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between p-5 border-b border-slate-800/80">
              <h3 className="text-lg font-bold text-slate-100">
                {isEdit ? 'Modify Employee Profile' : 'Register Employee'}
              </h3>
              <button onClick={() => setFormModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
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
                    className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
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
                    className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Password {isEdit && '(Leave blank to retain current)'}
                </label>
                <input
                  type="password"
                  required={!isEdit}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    System Role
                  </label>
                  <select
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                  >
                    <option value="1">Admin</option>
                    <option value="2">Manager</option>
                    <option value="3">Sales Executive</option>
                    <option value="4">Support Agent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Active Status
                  </label>
                  <select
                    value={isActive.toString()}
                    onChange={(e) => setIsActive(e.target.value === 'true')}
                    className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                  >
                    <option value="true">Active (Approved)</option>
                    <option value="false">Pending Approval / Disabled</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800/80 mt-4">
                <button
                  type="button"
                  onClick={() => setFormModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-350 font-semibold rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all"
                >
                  {isEdit ? 'Save Changes' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Employees;
