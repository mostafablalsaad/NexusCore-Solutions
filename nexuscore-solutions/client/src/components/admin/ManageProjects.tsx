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

  const { values, errors, isSubmitting, handleChange, handleSubmit, reset, setValues } = useForm({
    initialValues: {
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
    },
    onSubmit: async (values) => {
      try {
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
        fetchProjects();
      } catch (error: any) {
        showError(error.response?.data?.error || 'Operation failed');
      }
    },
  });

  const handleEdit = (project: Project) => {
    setEditingProject(project);
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
          <Button onClick={() => { reset(); setIsModalOpen(true); }} icon={<Plus />}>
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
            setIsModalOpen(false);
            reset();
            setEditingProject(null);
          }}
          title={editingProject ? 'Edit Project' : 'Add Project'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
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
                onClick={() => setIsModalOpen(false)}
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