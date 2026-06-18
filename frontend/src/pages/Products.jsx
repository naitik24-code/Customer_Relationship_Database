import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Layers,
  Search
} from 'lucide-react';

const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Form Fields
  const [prodId, setProdId] = useState('');
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [price, setPrice] = useState('');

  const isWriteAuthorized = user && ['Admin', 'Manager'].includes(user.role);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page, catFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        page,
        limit: 12,
        search,
        categoryId: catFilter || undefined
      };
      const response = await api.get('/products', { params });
      setProducts(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (err) {
      setError('Failed to fetch product catalog.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/products/categories');
      setCategories(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const handleOpenAddModal = () => {
    setIsEdit(false);
    setProdId('');
    setName('');
    setSku('');
    setDescription('');
    setCategoryId(categories[0]?.id || '1');
    setPrice('');
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setIsEdit(true);
    setProdId(prod.id);
    setName(prod.name);
    setSku(prod.sku);
    setDescription(prod.description || '');
    setCategoryId(prod.categoryId.toString());
    setPrice(prod.price);
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        sku,
        description,
        categoryId: parseInt(categoryId),
        price: parseFloat(price)
      };

      if (isEdit) {
        await api.put(`/products/${prodId}`, payload);
      } else {
        await api.post('/products', payload);
      }

      setFormModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Product & Services Catalog</h2>
          <p className="text-sm text-slate-400 mt-1">Review standard price structures, software assets, hardware assets, and consulting plans.</p>
        </div>
        {isWriteAuthorized && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-[0_4px_15px_rgba(59,130,246,0.2)]"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Product
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="glass-card p-4 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name or SKU..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-200 text-sm focus:outline-none"
          />
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
        </form>

        <div className="flex gap-4">
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="px-4 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-300 text-sm focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl transition-all"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[250px]">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl border border-slate-800">
          <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">No products found matching filters.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((prod) => (
              <div key={prod.id} className="glass-card p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-0.5 bg-slate-950/60 border border-slate-850 rounded text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                      {prod.category?.name}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{prod.sku}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 line-clamp-1">{prod.name}</h3>
                  {prod.description && <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 h-8">{prod.description}</p>}
                </div>
                
                <div className="border-t border-slate-800/80 pt-4 mt-4 flex items-center justify-between">
                  <span className="text-lg font-extrabold text-emerald-400">₹{parseFloat(prod.price).toLocaleString('en-IN')}</span>
                  
                  {isWriteAuthorized && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="p-1.5 bg-slate-800/60 hover:bg-slate-750 text-slate-400 hover:text-blue-400 rounded-lg transition-all"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="p-1.5 bg-slate-800/60 hover:bg-slate-750 text-slate-400 hover:text-red-400 rounded-lg transition-all"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border border-slate-800/80 bg-slate-900/10 rounded-xl text-xs text-slate-400">
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

      {/* Modal: Create / Edit Product Form */}
      {formModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between p-5 border-b border-slate-800/80">
              <h3 className="text-lg font-bold text-slate-100">
                {isEdit ? 'Edit Catalog Product' : 'Add New Catalog Product'}
              </h3>
              <button onClick={() => setFormModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                  placeholder="e.g. CRM Cloud Pro License"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                    placeholder="e.g. SaaS-CRM-PRO"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Unit Price (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 text-sm focus:outline-none"
                  placeholder="e.g. 99.99"
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
                  placeholder="Specify asset size, features, parameters..."
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
                  {isEdit ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Products;
