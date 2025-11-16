import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Select } from '@/components/common/Select';
import { Modal } from '@/components/common/Modal';
import { Loader } from '@/components/common/Loader';
import { Badge } from '@/components/common/Badge';
import { Plus, Edit, Trash2, Award } from 'lucide-react';
import api from '@/utils/api';
import { Achievement } from '@/types';
import { useToast } from '@/hooks/useToast';
import { useForm } from '@/hooks/useForm';
import { ACHIEVEMENT_TYPES } from '@/utils/constants';

const ManageAchievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [serverError, setServerError] = useState<string>('');
  const { showSuccess, showError } = useToast();

  const fetchAchievements = async () => {
    try {
      const response = await api.get('/achievements');
      setAchievements(response.data.data || []);
    } catch (error) {
      showError('Failed to fetch achievements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const getInitialValues = () => ({
    title: '',
    description: '',
    date: '',
    type: 'award',
    logo: '',
    order: 0,
    featured: false,
  });

  const validateForm = (values: any) => {
    const errors: any = {};

    if (!values.title || values.title.trim() === '') {
      errors.title = 'Title is required';
    }

    if (!values.date || values.date.trim() === '') {
      errors.date = 'Date is required';
    }

    if (values.logo && values.logo.trim() && !/^https?:\/\/.+/.test(values.logo)) {
      errors.logo = 'Please enter a valid URL starting with http:// or https://';
    }

    return errors;
  };

  const { values, errors, isSubmitting, handleChange, handleSubmit, reset, setValues } = useForm({
    initialValues: getInitialValues(),
    validate: validateForm,
    onSubmit: async (values) => {
      try {
        setServerError('');

        if (editingAchievement) {
          await api.put(`/admin/achievements/${editingAchievement._id}`, values);
          showSuccess('Achievement updated successfully');
        } else {
          await api.post('/admin/achievements', values);
          showSuccess('Achievement created successfully');
        }

        setIsModalOpen(false);
        reset();
        setEditingAchievement(null);
        setServerError('');
        fetchAchievements();
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Operation failed. Please check your input and try again.';
        setServerError(errorMessage);
        showError(errorMessage);
      }
    },
  });

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setServerError('');
    setValues({
      title: achievement.title,
      description: achievement.description || '',
      date: achievement.date ? new Date(achievement.date).toISOString().split('T')[0] : '',
      type: achievement.type,
      logo: achievement.logo || '',
      order: achievement.order,
      featured: achievement.featured,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;

    try {
      await api.delete(`/admin/achievements/${id}`);
      showSuccess('Achievement deleted successfully');
      fetchAchievements();
    } catch (error) {
      showError('Failed to delete achievement');
    }
  };

  const handleAddNew = () => {
    setEditingAchievement(null);
    reset();
    setServerError('');
    setIsModalOpen(true);
  };

  const getTypeIcon = (type: string) => {
    const typeObj = ACHIEVEMENT_TYPES.find(t => t.value === type);
    return typeObj?.icon || '🏆';
  };

  const getTypeBadgeVariant = (type: string): 'primary' | 'success' | 'warning' | 'danger' => {
    switch (type) {
      case 'award': return 'warning';
      case 'certification': return 'primary';
      case 'partnership': return 'success';
      case 'milestone': return 'danger';
      default: return 'primary';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loader size="lg" text="Loading achievements..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Achievements</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Total achievements: {achievements.length}
            </p>
          </div>
          <Button onClick={handleAddNew} icon={<Plus />}>
            Add Achievement
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <Card key={achievement._id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {achievement.logo ? (
                    <img src={achievement.logo} alt={achievement.title} className="w-12 h-12 object-contain" />
                  ) : (
                    <div className="text-4xl">{getTypeIcon(achievement.type)}</div>
                  )}
                  <Badge variant={getTypeBadgeVariant(achievement.type)} size="sm">
                    {achievement.type}
                  </Badge>
                </div>
                {achievement.featured && <Badge variant="warning" size="sm">Featured</Badge>}
              </div>
              <h3 className="text-xl font-semibold mb-2">{achievement.title}</h3>
              {achievement.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {achievement.description}
                </p>
              )}
              <p className="text-xs text-gray-500 mb-4">
                {new Date(achievement.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(achievement)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(achievement._id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
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
              setEditingAchievement(null);
              setServerError('');
            }
          }}
          title={editingAchievement ? 'Edit Achievement' : 'Add Achievement'}
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
              label="Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              error={errors.description}
              rows={3}
            />
            <Select
              label="Type *"
              name="type"
              value={values.type}
              onChange={handleChange}
              options={ACHIEVEMENT_TYPES.map(type => ({
                value: type.value,
                label: `${type.icon} ${type.label}`
              }))}
            />
            <Input
              label="Date *"
              name="date"
              type="date"
              value={values.date}
              onChange={handleChange}
              error={errors.date}
            />
            <Input
              label="Logo URL"
              name="logo"
              value={values.logo}
              onChange={handleChange}
              error={errors.logo}
            />
            <Input
              label="Order"
              name="order"
              type="number"
              value={values.order}
              onChange={handleChange}
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
                {editingAchievement ? 'Update' : 'Create'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
                    reset();
                    setEditingAchievement(null);
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

export default ManageAchievements;
