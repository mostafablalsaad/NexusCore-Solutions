import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Modal } from '@/components/common/Modal';
import { Loader } from '@/components/common/Loader';
import { Badge } from '@/components/common/Badge';
import { Plus, Edit, Trash2, BookOpen, Download } from 'lucide-react';
import api from '@/utils/api';
import { Whitepaper } from '@/types';
import { useToast } from '@/hooks/useToast';
import { useForm } from '@/hooks/useForm';

const ManageWhitepapers: React.FC = () => {
  const [whitepapers, setWhitepapers] = useState<Whitepaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWhitepaper, setEditingWhitepaper] = useState<Whitepaper | null>(null);
  const [serverError, setServerError] = useState<string>('');
  const { showSuccess, showError } = useToast();

  const fetchWhitepapers = async () => {
    try {
      const response = await api.get('/whitepapers');
      setWhitepapers(response.data.data || []);
    } catch (error) {
      showError('Failed to fetch whitepapers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWhitepapers();
  }, []);

  const getInitialValues = () => ({
    title: '',
    excerpt: '',
    pdfUrl: '',
    publishDate: '',
    industryTags: '',
    author: '',
    thumbnail: '',
    featured: false,
  });

  const validateForm = (values: any) => {
    const errors: any = {};

    if (!values.title || values.title.trim() === '') {
      errors.title = 'Title is required';
    }

    if (!values.excerpt || values.excerpt.trim() === '') {
      errors.excerpt = 'Excerpt is required';
    }

    if (!values.pdfUrl || values.pdfUrl.trim() === '') {
      errors.pdfUrl = 'PDF URL is required';
    } else if (!/^https?:\/\/.+/.test(values.pdfUrl)) {
      errors.pdfUrl = 'Please enter a valid URL starting with http:// or https://';
    }

    if (values.thumbnail && values.thumbnail.trim() && !/^https?:\/\/.+/.test(values.thumbnail)) {
      errors.thumbnail = 'Please enter a valid URL starting with http:// or https://';
    }

    return errors;
  };

  const { values, errors, isSubmitting, handleChange, handleSubmit, reset, setValues } = useForm({
    initialValues: getInitialValues(),
    validate: validateForm,
    onSubmit: async (values) => {
      try {
        setServerError('');

        const payload = {
          ...values,
          industryTags: values.industryTags ? values.industryTags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        };

        if (editingWhitepaper) {
          await api.put(`/admin/whitepapers/${editingWhitepaper._id}`, payload);
          showSuccess('Whitepaper updated successfully');
        } else {
          await api.post('/admin/whitepapers', payload);
          showSuccess('Whitepaper created successfully');
        }

        setIsModalOpen(false);
        reset();
        setEditingWhitepaper(null);
        setServerError('');
        fetchWhitepapers();
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Operation failed. Please check your input and try again.';
        setServerError(errorMessage);
        showError(errorMessage);
      }
    },
  });

  const handleEdit = (whitepaper: Whitepaper) => {
    setEditingWhitepaper(whitepaper);
    setServerError('');
    setValues({
      title: whitepaper.title,
      excerpt: whitepaper.excerpt,
      pdfUrl: whitepaper.pdfUrl,
      publishDate: whitepaper.publishDate ? new Date(whitepaper.publishDate).toISOString().split('T')[0] : '',
      industryTags: whitepaper.industryTags?.join(', ') || '',
      author: whitepaper.author || '',
      thumbnail: whitepaper.thumbnail || '',
      featured: whitepaper.featured,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this whitepaper?')) return;

    try {
      await api.delete(`/admin/whitepapers/${id}`);
      showSuccess('Whitepaper deleted successfully');
      fetchWhitepapers();
    } catch (error) {
      showError('Failed to delete whitepaper');
    }
  };

  const handleAddNew = () => {
    setEditingWhitepaper(null);
    reset();
    setServerError('');
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loader size="lg" text="Loading whitepapers..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Whitepapers</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Total whitepapers: {whitepapers.length}
            </p>
          </div>
          <Button onClick={handleAddNew} icon={<Plus />}>
            Add Whitepaper
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whitepapers.map((whitepaper) => (
            <Card key={whitepaper._id} className="overflow-hidden">
              {whitepaper.thumbnail && (
                <img
                  src={whitepaper.thumbnail}
                  alt={whitepaper.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="w-5 h-5 text-primary-600" />
                  {whitepaper.featured && <Badge variant="warning" size="sm">Featured</Badge>}
                </div>
                <h3 className="font-semibold mb-1">{whitepaper.title}</h3>
                {whitepaper.author && (
                  <p className="text-sm text-gray-500 mb-2">By {whitepaper.author}</p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {whitepaper.excerpt}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <Download className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">{whitepaper.downloadCount} downloads</span>
                </div>
                {whitepaper.industryTags && whitepaper.industryTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {whitepaper.industryTags.map((tag) => (
                      <Badge key={tag} variant="primary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(whitepaper)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(whitepaper._id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            if (confirm('Are you sure you want to close? All unsaved changes will be lost.')) {
              setIsModalOpen(false);
              reset();
              setEditingWhitepaper(null);
              setServerError('');
            }
          }}
          title={editingWhitepaper ? 'Edit Whitepaper' : 'Add Whitepaper'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Summary Banner */}
            {(Object.keys(errors).length > 0 || serverError) && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      {serverError ? 'Server Error' : 'Please fix the following errors:'}
                    </h3>
                    {serverError ? (
                      <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                        {serverError}
                      </div>
                    ) : (
                      <ul className="mt-2 text-sm text-red-700 dark:text-red-300 list-disc list-inside space-y-1">
                        {Object.entries(errors).map(([field, error]) => (
                          <li key={field}>{error as string}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            <Input
              label="Title *"
              name="title"
              value={values.title}
              onChange={handleChange}
              error={errors.title}
            />
            <Textarea
              label="Excerpt *"
              name="excerpt"
              value={values.excerpt}
              onChange={handleChange}
              error={errors.excerpt}
              rows={3}
            />
            <Input
              label="PDF URL *"
              name="pdfUrl"
              value={values.pdfUrl}
              onChange={handleChange}
              error={errors.pdfUrl}
              placeholder="https://example.com/whitepaper.pdf"
            />
            <Input
              label="Author"
              name="author"
              value={values.author}
              onChange={handleChange}
            />
            <Input
              label="Publish Date"
              name="publishDate"
              type="date"
              value={values.publishDate}
              onChange={handleChange}
            />
            <Input
              label="Industry Tags (comma separated)"
              name="industryTags"
              value={values.industryTags}
              onChange={handleChange}
              placeholder="renewable, medical, automotive"
            />
            <Input
              label="Thumbnail URL"
              name="thumbnail"
              value={values.thumbnail}
              onChange={handleChange}
              error={errors.thumbnail}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                checked={values.featured}
                onChange={handleChange}
                className="rounded"
              />
              <span>Featured</span>
            </label>
            <div className="flex gap-3">
              <Button type="submit" loading={isSubmitting} fullWidth>
                {editingWhitepaper ? 'Update' : 'Create'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
                    reset();
                    setEditingWhitepaper(null);
                    setServerError('');
                    setIsModalOpen(false);
                  }
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default ManageWhitepapers;
