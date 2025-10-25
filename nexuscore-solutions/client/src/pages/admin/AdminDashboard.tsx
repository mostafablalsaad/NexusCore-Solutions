import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card } from '@/components/common/Card';
import { Loader } from '@/components/common/Loader';
import { 
  FolderOpen, 
  FileText, 
  BookOpen, 
  Mail, 
  UserPlus, 
  TrendingUp,
  Clock
} from 'lucide-react';
import api from '@/utils/api';
import { DashboardStats } from '@/types';
import { formatDate } from '@/utils/helpers';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <Loader size="lg" text="Loading dashboard..." />
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load dashboard data</p>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.counts.projects,
      icon: FolderOpen,
      color: 'bg-blue-500',
      link: '/admin/projects',
    },
    {
      title: 'Case Studies',
      value: stats.counts.caseStudies,
      icon: FileText,
      color: 'bg-green-500',
      link: '/admin/case-studies',
    },
    {
      title: 'Whitepapers',
      value: stats.counts.whitepapers,
      icon: BookOpen,
      color: 'bg-purple-500',
      link: '/admin/whitepapers',
    },
    {
      title: 'Unread Messages',
      value: stats.counts.unreadMessages,
      icon: Mail,
      color: 'bg-red-500',
      link: '/admin/messages',
    },
    {
      title: 'Total Messages',
      value: stats.counts.messages,
      icon: Mail,
      color: 'bg-orange-500',
      link: '/admin/messages',
    },
    {
      title: 'Subscribers',
      value: stats.counts.subscribers,
      icon: UserPlus,
      color: 'bg-teal-500',
      link: '/admin/subscribers',
    },
  ];

  return (
    <AdminLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={stat.link}>
                <Card className="p-6" hoverable>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-4 ${stat.color} rounded-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Messages */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Messages</h2>
              <Link
                to="/admin/messages"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {stats.recentMessages.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No messages yet</p>
              ) : (
                stats.recentMessages.map((message) => (
                  <div
                    key={message._id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${message.read ? 'bg-gray-300' : 'bg-primary-600'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium truncate">{message.name}</p>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {/* {formatDate(message.createdAt, 'MMM dd')} */}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {message.email}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {message.message}
                      </p>
                    </div>
                  </div>
              ))
              )}
            </div>
          </Card>

          {/* Recent Subscribers */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Subscribers</h2>
              <Link
                to="/admin/subscribers"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {stats.recentSubscribers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No subscribers yet</p>
              ) : (
                stats.recentSubscribers.map((subscriber) => (
                  <div
                    key={subscriber._id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">
                          {subscriber.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{subscriber.email}</p>
                        <p className="text-xs text-gray-500">
                          {subscriber.confirmedAt && formatDate(subscriber.confirmedAt)}
                        </p>
                      </div>
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Top Whitepapers */}
        {stats.topWhitepapers && stats.topWhitepapers.length > 0 && (
          <Card className="p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Top Downloaded Whitepapers</h2>
            <div className="space-y-3">
              {stats.topWhitepapers.map((paper, index) => (
                <div
                  key={paper._id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-300">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{paper.title}</p>
                      <p className="text-sm text-gray-500">
                        {paper.downloadCount} downloads
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;