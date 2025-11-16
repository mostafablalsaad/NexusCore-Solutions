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
import { Plus, Edit, Trash2, FileText, X } from 'lucide-react';
import api from '@/utils/api';
import { CaseStudy, Project } from '@/types';
import { useToast } from '@/hooks/useToast';
import { useForm } from '@/hooks/useForm';
import { INDUSTRIES } from '@/utils/constants';

interface MetricInput {
  label: string;
  value: string;
}

const ManageCaseStudies: React.FC = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(null);
  const [metrics, setMetrics] = useState<MetricInput[]>([{ label: '', value: '' }]);
  const [serverError, setServerError] = useState<string>('');
  const { showSuccess, showError } = useToast();

  const fetchCaseStudies = async () => {
    try {
      const response = await api.get('/case-studies');
      setCaseStudies(response.data.data || []);
    } catch (error) {
      showError('Failed to fetch case studies');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch projects');
    }
  };

  useEffect(() => {
    fetchCaseStudies();
    fetchProjects();
  }, []);

  const getInitialValues = () => ({
    title: '',
    client: '',
    industry: 'renewable',
    challenge: '',
    solution: '',
    results: '',
    pdfUrl: '',
    relatedProject: '',
    thumbnail: '',
    featured: false,
  });

  const validateForm = (values: any) => {
    const errors: any = {};

    if (!values.title || values.title.trim() === '') {
      errors.title = 'Title is required';
    }

    if (!values.client || values.client.trim() === '') {
      errors.client = 'Client name is required';
    }

    if (!values.challenge || values.challenge.trim() === '') {
      errors.challenge = 'Challenge is required';
    }

    if (!values.solution || values.solution.trim() === '') {
      errors.solution = 'Solution is required';
    }

    if (!values.results || values.results.trim() === '') {
      errors.results = 'Results are required';
    }

    if (values.thumbnail && values.thumbnail.trim() && !/^https?:\/\/.+/.test(values.thumbnail)) {
      errors.thumbnail = 'Please enter a valid URL starting with http:// or https://';
    }

    if (values.pdfUrl && values.pdfUrl.trim() && !/^https?:\/\/.+/.test(values.pdfUrl)) {
      errors.pdfUrl = 'Please enter a valid URL starting with http:// or https://';
    }

    return errors;
  };

  const { values, errors, isSubmitting, handleChange, handleSubmit, reset, setValues } = useForm({
    initialValues: getInitialValues(),
    validate: validateForm,
    onSubmit: async (values) => {
      try {
        setServerError('');

        // Filter out empty metrics
        const validMetrics = metrics.filter(m => m.label.trim() && m.value.trim());

        const payload = {
          ...values,
          metrics: validMetrics,
          relatedProject: values.relatedProject || undefined,
        };

        if (editingCaseStudy) {
          await api.put(`/admin/case-studies/${editingCaseStudy._id}`, payload);
          showSuccess('Case study updated successfully');
        } else {
          await api.post('/admin/case-studies', payload);
          showSuccess('Case study created successfully');
        }

        setIsModalOpen(false);
        reset();
        setEditingCaseStudy(null);
        setMetrics([{ label: '', value: '' }]);
        setServerError('');
        fetchCaseStudies();
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Operation failed. Please check your input and try again.';
        setServerError(errorMessage);
        showError(errorMessage);
      }
    },
  });

  const handleEdit = (caseStudy: CaseStudy) => {
    setEditingCaseStudy(caseStudy);
    setServerError('');
    setValues({
      title: caseStudy.title,
      client: caseStudy.client,
      industry: caseStudy.industry || 'renewable',
      challenge: caseStudy.challenge,
      solution: caseStudy.solution,
      results: caseStudy.results,
      pdfUrl: caseStudy.pdfUrl || '',
      relatedProject: typeof caseStudy.relatedProject === 'string' ? caseStudy.relatedProject : caseStudy.relatedProject?._id || '',
      thumbnail: caseStudy.thumbnail || '',
      featured: caseStudy.featured,
    });
    setMetrics(caseStudy.metrics.length > 0 ? caseStudy.metrics : [{ label: '', value: '' }]);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case study?')) return;

    try {
      await api.delete(`/admin/case-studies/${id}`);
      showSuccess('Case study deleted successfully');
      fetchCaseStudies();
    } catch (error) {
      showError('Failed to delete case study');
    }
  };

  const handleAddMetric = () => {
    setMetrics([...metrics, { label: '', value: '' }]);
  };

  const handleRemoveMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const handleMetricChange = (index: number, field: 'label' | 'value', value: string) => {
    const newMetrics = [...metrics];
    newMetrics[index][field] = value;
    setMetrics(newMetrics);
  };

  const handleAddNew = () => {
    setEditingCaseStudy(null);
    reset();
    setMetrics([{ label: '', value: '' }]);
    setServerError('');
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loader size="lg" text="Loading case studies..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Case Studies</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Total case studies: {caseStudies.length}
            </p>
          </div>
          <Button onClick={handleAddNew} icon={<Plus />}>
            Add Case Study
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((caseStudy) => (
            <Card key={caseStudy._id} className="overflow-hidden">
              {caseStudy.thumbnail && (
                <img
                  src={caseStudy.thumbnail}
                  alt={caseStudy.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  {caseStudy.industry && <Badge variant="primary" size="sm">{caseStudy.industry}</Badge>}
                  {caseStudy.featured && <Badge variant="warning" size="sm">Featured</Badge>}
                </div>
                <h3 className="font-semibold mb-1">{caseStudy.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{caseStudy.client}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {caseStudy.challenge}
                </p>
                {caseStudy.metrics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {caseStudy.metrics.slice(0, 2).map((metric, index) => (
                      <div key={index} className="text-xs bg-gray-100 dark:bg-gray-800 rounded px-2 py-1">
                        <span className="font-semibold">{metric.value}</span> {metric.label}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(caseStudy)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(caseStudy._id)}>
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
              setEditingCaseStudy(null);
              setMetrics([{ label: '', value: '' }]);
              setServerError('');
            }
          }}
          title={editingCaseStudy ? 'Edit Case Study' : 'Add Case Study'}
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
              label="Client Name *"
              name="client"
              value={values.client}
              onChange={handleChange}
              error={errors.client}
            />
            <Select
              label="Industry"
              name="industry"
              value={values.industry}
              onChange={handleChange}
              options={INDUSTRIES.map(ind => ({ value: ind.value, label: ind.label }))}
            />
            <Textarea
              label="Challenge *"
              name="challenge"
              value={values.challenge}
              onChange={handleChange}
              error={errors.challenge}
              rows={3}
            />
            <Textarea
              label="Solution *"
              name="solution"
              value={values.solution}
              onChange={handleChange}
              error={errors.solution}
              rows={3}
            />
            <Textarea
              label="Results *"
              name="results"
              value={values.results}
              onChange={handleChange}
              error={errors.results}
              rows={3}
            />

            {/* Metrics */}
            <div>
              <label className="block text-sm font-medium mb-2">Metrics</label>
              {metrics.map((metric, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Label (e.g., FDA Clearance Time)"
                    value={metric.label}
                    onChange={(e) => handleMetricChange(index, 'label', e.target.value)}
                  />
                  <Input
                    placeholder="Value (e.g., 8 months)"
                    value={metric.value}
                    onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                  />
                  {metrics.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveMetric(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={handleAddMetric}>
                <Plus className="w-4 h-4 mr-1" /> Add Metric
              </Button>
            </div>

            <Select
              label="Related Project"
              name="relatedProject"
              value={values.relatedProject}
              onChange={handleChange}
              options={[
                { value: '', label: 'None' },
                ...projects.map(project => ({ value: project._id, label: project.title }))
              ]}
            />
            <Input
              label="Thumbnail URL"
              name="thumbnail"
              value={values.thumbnail}
              onChange={handleChange}
              error={errors.thumbnail}
            />
            <Input
              label="PDF URL"
              name="pdfUrl"
              value={values.pdfUrl}
              onChange={handleChange}
              error={errors.pdfUrl}
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
                {editingCaseStudy ? 'Update' : 'Create'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
                    reset();
                    setEditingCaseStudy(null);
                    setMetrics([{ label: '', value: '' }]);
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

export default ManageCaseStudies;
