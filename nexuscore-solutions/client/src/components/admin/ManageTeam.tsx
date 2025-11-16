import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Modal } from '@/components/common/Modal';
import { Loader } from '@/components/common/Loader';
import { Badge } from '@/components/common/Badge';
import { Plus, Edit, Trash2, User, Linkedin } from 'lucide-react';
import api from '@/utils/api';
import { TeamMember } from '@/types';
import { useToast } from '@/hooks/useToast';
import { useForm } from '@/hooks/useForm';

const ManageTeam: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [serverError, setServerError] = useState<string>('');
  const { showSuccess, showError } = useToast();

  const fetchTeamMembers = async () => {
    try {
      const response = await api.get('/team');
      setTeamMembers(response.data.data || []);
    } catch (error) {
      showError('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const getInitialValues = () => ({
    name: '',
    role: '',
    bio: '',
    photo: '',
    linkedin: '',
    email: '',
    order: 0,
    active: true,
  });

  const validateForm = (values: any) => {
    const errors: any = {};

    if (!values.name || values.name.trim() === '') {
      errors.name = 'Name is required';
    }

    if (!values.role || values.role.trim() === '') {
      errors.role = 'Role is required';
    }

    if (values.photo && values.photo.trim() && !/^https?:\/\/.+/.test(values.photo)) {
      errors.photo = 'Please enter a valid URL starting with http:// or https://';
    }

    if (values.linkedin && values.linkedin.trim() && !/^https?:\/\/.+/.test(values.linkedin)) {
      errors.linkedin = 'Please enter a valid URL starting with http:// or https://';
    }

    if (values.email && values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Please enter a valid email address';
    }

    return errors;
  };

  const { values, errors, isSubmitting, handleChange, handleSubmit, reset, setValues } = useForm({
    initialValues: getInitialValues(),
    validate: validateForm,
    onSubmit: async (values) => {
      try {
        setServerError('');

        if (editingMember) {
          await api.put(`/admin/team/${editingMember._id}`, values);
          showSuccess('Team member updated successfully');
        } else {
          await api.post('/admin/team', values);
          showSuccess('Team member created successfully');
        }

        setIsModalOpen(false);
        reset();
        setEditingMember(null);
        setServerError('');
        fetchTeamMembers();
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Operation failed. Please check your input and try again.';
        setServerError(errorMessage);
        showError(errorMessage);
      }
    },
  });

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setServerError('');
    setValues({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      photo: member.photo || '',
      linkedin: member.linkedin || '',
      email: member.email || '',
      order: member.order,
      active: member.active,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    try {
      await api.delete(`/admin/team/${id}`);
      showSuccess('Team member deleted successfully');
      fetchTeamMembers();
    } catch (error) {
      showError('Failed to delete team member');
    }
  };

  const handleAddNew = () => {
    setEditingMember(null);
    reset();
    setServerError('');
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loader size="lg" text="Loading team members..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Team</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Total team members: {teamMembers.length}
            </p>
          </div>
          <Button onClick={handleAddNew} icon={<Plus />}>
            Add Team Member
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <Card key={member._id} className="p-6">
              <div className="flex flex-col items-center text-center mb-4">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-primary-600 dark:text-primary-400 mb-2">{member.role}</p>
                {!member.active && <Badge variant="danger" size="sm">Inactive</Badge>}
              </div>
              {member.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {member.bio}
                </p>
              )}
              <div className="flex flex-col gap-2 mb-4">
                {member.email && (
                  <p className="text-xs text-gray-500 truncate">{member.email}</p>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Linkedin className="w-3 h-3" />
                    LinkedIn
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(member)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(member._id)}>
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
              setEditingMember(null);
              setServerError('');
            }
          }}
          title={editingMember ? 'Edit Team Member' : 'Add Team Member'}
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
              label="Name *"
              name="name"
              value={values.name}
              onChange={handleChange}
              error={errors.name}
            />
            <Input
              label="Role *"
              name="role"
              value={values.role}
              onChange={handleChange}
              error={errors.role}
              placeholder="e.g., Chief Technology Officer"
            />
            <Textarea
              label="Bio"
              name="bio"
              value={values.bio}
              onChange={handleChange}
              error={errors.bio}
              rows={4}
            />
            <Input
              label="Photo URL"
              name="photo"
              value={values.photo}
              onChange={handleChange}
              error={errors.photo}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Input
              label="LinkedIn URL"
              name="linkedin"
              value={values.linkedin}
              onChange={handleChange}
              error={errors.linkedin}
              placeholder="https://linkedin.com/in/..."
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
                name="active"
                checked={values.active}
                onChange={handleChange}
                className="rounded"
              />
              <span>Active</span>
            </label>
            <div className="flex gap-3">
              <Button type="submit" loading={isSubmitting} fullWidth>
                {editingMember ? 'Update' : 'Create'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
                    reset();
                    setEditingMember(null);
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

export default ManageTeam;
