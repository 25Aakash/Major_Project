import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaBook, FaFilter } from 'react-icons/fa';
import { contentAPI } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPanel = () => {
  const [content, setContent] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [filters, setFilters] = useState({ subject: '', difficulty: '', format: '' });
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'math',
    difficulty: 'beginner',
    format: 'text',
    duration: 10,
    points: 10,
    isActive: true
  });

  useEffect(() => {
    fetchContent();
  }, [filters]);

  const fetchContent = async () => {
    try {
      const response = await contentAPI.getAll(filters);
      setContent(response.data.content || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingContent(null);
    setFormData({
      title: '',
      description: '',
      subject: 'math',
      difficulty: 'beginner',
      format: 'text',
      duration: 10,
      points: 10,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingContent(item);
    setFormData({
      title: item.title,
      description: item.description,
      subject: item.subject,
      difficulty: item.difficulty,
      format: item.format,
      duration: item.duration || 10,
      points: item.points || 10,
      isActive: item.isActive !== false
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;

    try {
      await contentAPI.delete(id);
      toast.success('Content deleted successfully');
      fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingContent) {
        await contentAPI.update(editingContent._id, formData);
        toast.success('Content updated successfully');
      } else {
        await contentAPI.create(formData);
        toast.success('Content created successfully');
      }

      setIsModalOpen(false);
      fetchContent();
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FaBook />
                Content Management
              </h1>
              <p className="text-white text-opacity-90 mt-2">
                Create, edit, and manage learning content
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition font-semibold flex items-center gap-2"
            >
              <FaPlus />
              Add New Content
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <FaFilter className="mr-2 text-gray-600" />
            <h2 className="text-xl font-semibold">Filters</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Subjects</option>
              <option value="math">Math</option>
              <option value="science">Science</option>
              <option value="english">English</option>
              <option value="programming">Programming</option>
            </select>

            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              value={filters.format}
              onChange={(e) => setFilters({ ...filters, format: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Formats</option>
              <option value="text">Text</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="interactive">Interactive</option>
            </select>

            <button
              onClick={() => setFilters({ subject: '', difficulty: '', format: '' })}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Content Library ({content.length})</h2>
          {content.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.map((item) => (
                <ContentCard
                  key={item._id}
                  content={item}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => handleDelete(item._id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaBook className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">No content found</p>
              <button
                onClick={handleCreate}
                className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Create First Content
              </button>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <ContentModal
            isEdit={!!editingContent}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onClose={() => setIsModalOpen(false)}
          />
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

const ContentCard = ({ content, onEdit, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="border rounded-lg p-6 hover:shadow-lg transition"
  >
    <div className="flex items-start justify-between mb-3">
      <h3 className="font-bold text-lg text-gray-900 flex-1">{content.title}</h3>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
          title="Edit"
        >
          <FaEdit />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
          title="Delete"
        >
          <FaTrash />
        </button>
      </div>
    </div>

    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{content.description}</p>

    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
          {content.difficulty}
        </span>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
          {content.format}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{content.subject}</span>
        <span>{content.duration || 10} min</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-primary-600">{content.points} points</span>
        <span className={`text-xs ${content.isActive ? 'text-green-600' : 'text-gray-400'}`}>
          {content.isActive ? '● Active' : '○ Inactive'}
        </span>
      </div>
    </div>
  </motion.div>
);

const ContentModal = ({ isEdit, formData, onChange, onSubmit, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
    >
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {isEdit ? 'Edit Content' : 'Create New Content'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
          >
            <FaTimes size={24} />
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter content title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter content description"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={onChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="math">Math</option>
                <option value="science">Science</option>
                <option value="english">English</option>
                <option value="programming">Programming</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty *</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={onChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format *</label>
              <select
                name="format"
                value={formData.format}
                onChange={onChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="text">Text</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="interactive">Interactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (min)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={onChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
              <input
                type="number"
                name="points"
                value={formData.points}
                onChange={onChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={onChange}
              className="mr-2 text-primary-600 focus:ring-primary-500"
            />
            <label className="text-sm font-medium text-gray-700">Active (visible to students)</label>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold flex items-center justify-center gap-2"
          >
            <FaSave />
            {isEdit ? 'Update' : 'Create'} Content
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  </div>
);

export default AdminPanel;
