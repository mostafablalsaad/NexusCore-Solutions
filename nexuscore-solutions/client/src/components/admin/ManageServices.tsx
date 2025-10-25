import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Modal } from '@/components/common/Modal';
import { Loader } from '@/components/common/Loader';
import { Badge } from '@/components/common/Badge';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import api from '@/utils/api';
import { Service } from '@/types';
import { useToast } from '@/hooks/useToast';
import { useForm } from '@/hooks/useForm';

const ManageServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { showSuccess, showError } = useToast();

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data.data || []);
    } catch (error) {
      showError('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const { values, errors, isSubmitting, handleChange, handleSubmit, reset, setValues } = useForm({
    initialValues: {
      title: '',
      description: '',
      industryTags: '',
      icon: '',
      imageUpdated: '',
      order: 0,
      featured: false,
    },
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          industryTags: values.industryTags.split(',').map(tag => tag.trim()).filter(Boolean),
        };

        if (editingService) {
          
          await api.put(`/admin/services/${editingService._id}`, payload);
          showSuccess('Service updated successfully');
        } else {
          await api.post('/admin/services', payload);
          showSuccess('Service created successfully');
        }

        setIsModalOpen(false);
        reset();
        setEditingService(null);
        fetchServices();
      } catch (error: any) {
        showError(error.response?.data?.error || 'Operation failed');
      }
    },
  });

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setValues({
      title: service.title,
      description: service.description,
      industryTags: service.industryTags.join(', '),
      icon: service.icon || '',
      imageUpdated: service.imageUpdated || '',
      order: service.order,
      featured: service.featured,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await api.delete(`/admin/services/${id}`);
      showSuccess('Service deleted successfully');
      fetchServices();
    } catch (error) {
      showError('Failed to delete service');
    }
  };

  const handleAddNew = () => {
    setEditingService(null);
    reset();
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loader size="lg" text="Loading services..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Services</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Add, edit, or remove services
            </p>
          </div>
          <Button onClick={handleAddNew} icon={<Plus />}>
            Add Service
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service._id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Package className="w-8 h-8 text-primary-600" />
                {service.featured && <Badge variant="warning">Featured</Badge>}
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {service.industryTags.map((tag) => (
                  <Badge key={tag} variant="primary" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(service._id)}>
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
            setIsModalOpen(false);
            reset();
            setEditingService(null);
          }}
          title={editingService ? 'Edit Service' : 'Add Service'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title *"
              name="title"
              value={values.title}
              onChange={handleChange}
              error={errors.title}
            />
            <Textarea
              label="Description *"
              name="description"
              value={values.description}
              onChange={handleChange}
              error={errors.description}
              rows={4}
            />
            <Input
              label="Industry Tags (comma separated)"
              name="industryTags"
              value={values.industryTags}
              onChange={handleChange}
              placeholder="renewable, medical, submarine"
            />
            <Input
              label="Icon"
              name="icon"
              value={values.icon}
              onChange={handleChange}
            />
            <Input
              label="imageUpload"
              name="imageUpload"
              value={values.imageUpdated}
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
                className="rounded"
              />
              <span>Featured</span>
            </label>
            <div className="flex gap-3">
              <Button type="submit" loading={isSubmitting} fullWidth>
                {editingService ? 'Update' : 'Create'}
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

export default ManageServices;