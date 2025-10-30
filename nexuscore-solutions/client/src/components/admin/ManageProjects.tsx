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
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '@/utils/api';
import { Project } from '@/types';
import { useToast } from '@/hooks/useToast';
import { useForm } from '@/hooks/useForm';
import { INDUSTRIES } from '@/utils/constants';

const ManageProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [serverError, setServerError] = useState<string>('');
  const { showSuccess, showError } = useToast();

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data.data || []);
    } catch (error) {
      showError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const getInitialValues = () => ({
    title: '',
    shortDesc: '',
    fullDesc: '',
    industry: 'renewable',
    thumbnail: '',
    gallery: '',
    technologies: '',
    clientName: '',
    completionDate: '',
    featured: false,
    order: 0,
  });

  const validateForm = (values: any) => {
    const errors: any = {};

    if (!values.title || values.title.trim() === '') {
      errors.title = 'Title is required';
    }

    if (!values.shortDesc || values.shortDesc.trim() === '') {
      errors.shortDesc = 'Short description is required';
    }

    if (!values.fullDesc || values.fullDesc.trim() === '') {
      errors.fullDesc = 'Full description is required';
    }

    if (!values.thumbnail || values.thumbnail.trim() === '') {
      errors.thumbnail = 'Thumbnail URL is required';
    } else if (!/^https?:\/\/.+/.test(values.thumbnail)) {
      errors.thumbnail = 'Please enter a valid URL starting with http:// or https://';
    }

    if (values.gallery && values.gallery.trim()) {
      const urls = values.gallery.split(',').map((url: string) => url.trim());
      const invalidUrls = urls.filter((url: string) => url && !/^https?:\/\/.+/.test(url));
      if (invalidUrls.length > 0) {
        errors.gallery = 'All gallery URLs must be valid and start with http:// or https://';
      }
    }

    return errors;
  };

  const { values, errors, isSubmitting, handleChange, handleSubmit, reset, setValues } = useForm({
    initialValues: getInitialValues(),
    validate: validateForm,
    onSubmit: async (values) => {
      try {
        setServerError(''); // Clear previous server errors
        const payload = {
          ...values,
          gallery: values.gallery ? values.gallery.split(',').map(url => url.trim()).filter(Boolean) : [],
          technologies: values.technologies ? values.technologies.split(',').map(t => t.trim()).filter(Boolean) : [],
        };

        if (editingProject) {
          await api.put(`/admin/projects/${editingProject._id}`, payload);
          showSuccess('Project updated successfully');
        } else {
          await api.post('/admin/projects', payload);
          showSuccess('Project created successfully');
        }

        setIsModalOpen(false);
        reset();
        setEditingProject(null);
        setServerError('');
        fetchProjects();
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Operation failed. Please check your input and try again.';
        setServerError(errorMessage);
        showError(errorMessage);
        // Form data will be preserved due to the error
      }
    },
  });


  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setServerError('');
    setValues({
      title: project.title,
      shortDesc: project.shortDesc,
      fullDesc: project.fullDesc,
      industry: project.industry,
      thumbnail: project.thumbnail,
      gallery: project.gallery?.join(', ') || '',
      technologies: project.technologies?.join(', ') || '',
      clientName: project.clientName || '',
      completionDate: project.completionDate || '',
      featured: project.featured,
      order: project.order,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await api.delete(`/admin/projects/${id}`);
      showSuccess('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      showError('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loader size="lg" text="Loading projects..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Projects</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Total projects: {projects.length}
            </p>
          </div>
          <Button onClick={() => { reset(); setEditingProject(null); setServerError(''); setIsModalOpen(true); }} icon={<Plus />}>
            Add Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project._id} className="overflow-hidden">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="primary" size="sm">{project.industry}</Badge>
                  {project.featured && <Badge variant="warning" size="sm">Featured</Badge>}
                </div>
                <h3 className="font-semibold mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {project.shortDesc}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(project._id)}>
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
              setEditingProject(null);
              setServerError('');
            }
          }}
          title={editingProject ? 'Edit Project' : 'Add Project'}
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
            <Input
              label="Short Description *"
              name="shortDesc"
              value={values.shortDesc}
              onChange={handleChange}
              error={errors.shortDesc}
            />
            <Textarea
              label="Full Description *"
              name="fullDesc"
              value={values.fullDesc}
              onChange={handleChange}
              error={errors.fullDesc}
              rows={4}
            />
            <Select
              label="Industry *"
              name="industry"
              value={values.industry}
              onChange={handleChange}
              options={INDUSTRIES.map(ind => ({ value: ind.value, label: ind.label }))}
            />
            <Input
              label="Thumbnail URL *"
              name="thumbnail"
              value={values.thumbnail}
              onChange={handleChange}
              error={errors.thumbnail}
            />
            <Input
              label="Gallery URLs (comma separated)"
              name="gallery"
              value={values.gallery}
              onChange={handleChange}
              error={errors.gallery}
            />
            <Input
              label="Technologies (comma separated)"
              name="technologies"
              value={values.technologies}
              onChange={handleChange}
            />
            <Input
              label="Client Name"
              name="clientName"
              value={values.clientName}
              onChange={handleChange}
            />
            <Input
              label="Completion Date"
              name="completionDate"
              type="date"
              value={values.completionDate}
              onChange={handleChange}
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
              />
              <span>Featured</span>
            </label>
            <div className="flex gap-3">
              <Button type="submit" loading={isSubmitting} fullWidth>
                {editingProject ? 'Update' : 'Create'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
                    reset();
                    setEditingProject(null);
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

export default ManageProjects;