import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Loader } from '@/components/common/Loader';
import { Badge } from '@/components/common/Badge';
import { SearchBar } from '@/components/common/SearchBar';
import { Pagination } from '@/components/common/Pagination';
import { UserPlus, Trash2, Mail, CheckCircle, XCircle, Download } from 'lucide-react';
import api from '@/utils/api';
import { NewsletterSubscriber } from '@/types';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/utils/helpers';

const ManageNewsletter: React.FC = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'unconfirmed'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { showSuccess, showError } = useToast();

  const fetchSubscribers = async () => {
    try {
      const response = await api.get('/newsletter/subscribers');
      setSubscribers(response.data.data || []);
    } catch (error) {
      showError('Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;

    try {
      await api.delete(`/admin/newsletter/${id}`);
      showSuccess('Subscriber deleted successfully');
      fetchSubscribers();
    } catch (error) {
      showError('Failed to delete subscriber');
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Email', 'Confirmed', 'Confirmed At', 'Subscribed At'].join(','),
      ...filteredSubscribers.map(sub => [
        sub.email,
        sub.confirmed ? 'Yes' : 'No',
        sub.confirmedAt ? new Date(sub.confirmedAt).toISOString() : '',
        new Date(sub.createdAt).toISOString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    showSuccess('Subscribers exported successfully');
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'confirmed' && subscriber.confirmed) ||
      (filter === 'unconfirmed' && !subscriber.confirmed);
    return matchesSearch && matchesFilter && !subscriber.unsubscribed;
  });

  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const paginatedSubscribers = filteredSubscribers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: subscribers.filter(s => !s.unsubscribed).length,
    confirmed: subscribers.filter(s => s.confirmed && !s.unsubscribed).length,
    unconfirmed: subscribers.filter(s => !s.confirmed && !s.unsubscribed).length,
    unsubscribed: subscribers.filter(s => s.unsubscribed).length,
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loader size="lg" text="Loading subscribers..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Newsletter Subscribers</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Total subscribers: {stats.total} ({stats.confirmed} confirmed)
            </p>
          </div>
          <Button onClick={handleExportCSV} icon={<Download />}>
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <UserPlus className="w-8 h-8 text-primary-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Confirmed</p>
                <p className="text-2xl font-bold">{stats.confirmed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unconfirmed</p>
                <p className="text-2xl font-bold">{stats.unconfirmed}</p>
              </div>
              <Mail className="w-8 h-8 text-orange-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unsubscribed</p>
                <p className="text-2xl font-bold">{stats.unsubscribed}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by email..."
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'confirmed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('confirmed')}
            >
              Confirmed
            </Button>
            <Button
              variant={filter === 'unconfirmed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('unconfirmed')}
            >
              Unconfirmed
            </Button>
          </div>
        </div>

        {/* Subscribers Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Subscribed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Confirmed
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {paginatedSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No subscribers found
                    </td>
                  </tr>
                ) : (
                  paginatedSubscribers.map((subscriber) => (
                    <tr key={subscriber._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium">{subscriber.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {subscriber.confirmed ? (
                          <Badge variant="success" size="sm">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Confirmed
                          </Badge>
                        ) : (
                          <Badge variant="warning" size="sm">
                            <XCircle className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(subscriber.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subscriber.confirmedAt ? formatDate(subscriber.confirmedAt) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(subscriber._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageNewsletter;
