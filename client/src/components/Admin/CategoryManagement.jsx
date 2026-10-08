import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import Loader from '../Loader/Loader';
import { 
  FolderPlus, Edit2, Trash2, RefreshCw, AlertCircle, CheckCircle2, Loader2, X, Plus, Folder 
} from 'lucide-react';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null if adding
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete confirmation
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await categoryService.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name || '');
    setDescription(cat.description || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setIsModalOpen(false);
    setEditingCategory(null);
    setName('');
    setDescription('');
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    if (!name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    if (name.trim().length > 50) {
      setFormError('Category name cannot exceed 50 characters.');
      return;
    }

    setSubmitting(true);

    try {
      if (editingCategory) {
        const catId = editingCategory.id || editingCategory._id;
        await categoryService.update(catId, {
          name: name.trim(),
          description: description.trim()
        });
        setSuccess(`Category '${name.trim()}' updated successfully!`);
      } else {
        await categoryService.create({
          name: name.trim(),
          description: description.trim()
        });
        setSuccess(`Category '${name.trim()}' created successfully!`);
      }

      handleCloseModal();
      fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      setFormError(err.message || 'Failed to save category. Duplicate name or server error.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    setError('');
    setSuccess('');
    try {
      await categoryService.delete(id);
      setSuccess('Category deleted successfully!');
      setDeletingId(null);
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err.message || 'Failed to delete category');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Folder className="w-5 h-5 text-green-700" /> Equipment Category Governance
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage machinery taxonomy and categories used across equipment catalog listings & filters.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={fetchCategories}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="Refresh Categories"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>

          <button
            onClick={handleOpenAddModal}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs transition flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" /> Add New Category
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-600 shrink-0" /> {error}</span>
          <button onClick={() => setError('')} className="text-red-600 hover:text-red-800 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs font-semibold flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" /> {success}</span>
          <button onClick={() => setSuccess('')} className="text-green-700 hover:text-green-900 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Category Table */}
      {loading ? (
        <Loader message="Loading equipment categories from database..." />
      ) : categories.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3 shadow-xs">
          <FolderPlus className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Categories Configured</h3>
          <p className="text-xs text-slate-500">Click below to create the first equipment category in the database.</p>
          <button
            onClick={handleOpenAddModal}
            className="text-xs font-bold text-green-700 hover:underline cursor-pointer pt-2"
          >
            + Create First Category
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Total Categories: <strong className="text-slate-900 font-bold">{categories.length}</strong></span>
            <span className="text-slate-500 text-[11px]">Taxonomy synchronization active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 uppercase text-[10px] text-slate-500 font-semibold tracking-wider border-y border-slate-200">
                <tr>
                  <th className="p-3">Category ID</th>
                  <th className="p-3">Category Name</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Created Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => {
                  const catId = cat.id || cat._id;
                  const isConfirmingDelete = deletingId === catId;

                  return (
                    <tr key={catId} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-mono text-slate-400 text-[10px]">#{catId}</td>
                      <td className="p-3 font-semibold text-slate-900 flex items-center gap-2">
                        <Folder className="w-4 h-4 text-green-700 shrink-0" />
                        <span>{cat.name}</span>
                      </td>
                      <td className="p-3 text-slate-600 max-w-xs truncate">
                        {cat.description || <span className="text-slate-400 italic">No description</span>}
                      </td>
                      <td className="p-3 text-slate-500">
                        {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-3 text-right">
                        {isConfirmingDelete ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-[11px] text-amber-700 font-semibold">Confirm Delete?</span>
                            <button
                              disabled={deleteLoading}
                              onClick={() => handleDelete(catId)}
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[10px] transition disabled:opacity-50 cursor-pointer"
                            >
                              {deleteLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Yes'}
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded text-[10px] transition cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(cat)}
                              className="p-1.5 text-slate-500 hover:text-green-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                              title="Edit Category"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingId(catId)}
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-md w-full space-y-5 shadow-xl relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-green-700" />
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Irrigation Pump, Tiller, Seeder"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of machinery types included under this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    editingCategory ? 'Update Category' : 'Create Category'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CategoryManagement;
