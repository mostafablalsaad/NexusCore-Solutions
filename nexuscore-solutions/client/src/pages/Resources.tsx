import React, { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { BookOpen, Download, Calendar, User } from 'lucide-react';
import api from '@/utils/api';
import { Whitepaper } from '@/types';
import { formatDate } from '@/utils/helpers';
import { useToast } from '@/hooks/useToast';
import { motion } from 'framer-motion';

const Resources: React.FC = () => {
  const [whitepapers, setWhitepapers] = useState<Whitepaper[]>([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const fetchWhitepapers = async () => {
      try {
        const response = await api.get('/whitepapers');
        setWhitepapers(response.data.data || []);
      } catch (error) {
        console.error('Error fetching whitepapers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWhitepapers();
  }, []);

  const handleDownload = async (id: string, title: string) => {
    try {
      const response = await api.get(`/whitepapers/${id}/download`);
      window.open(response.data.data.pdfUrl, '_blank');
      showSuccess('Download started!');
    } catch (error) {
      showError('Failed to download whitepaper');
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <Loader size="lg" text="Loading resources..." />
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container-custom py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Resources & Whitepapers
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            In-depth technical resources and industry insights
          </p>
        </motion.div>

        {whitepapers.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-16 h-16" />}
            title="No resources available"
            description="Check back soon for technical whitepapers and guides"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whitepapers.map((paper, index) => (
              <motion.div
                key={paper._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full flex flex-col">
                  {paper.thumbnail && (
                    <img
                      src={paper.thumbnail}
                      alt={paper.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200 rounded-full text-sm">
                      Whitepaper
                    </span>
                    {paper.featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold mb-3">{paper.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                    {paper.excerpt}
                  </p>

                  <div className="space-y-2 mb-4 text-sm text-gray-500">
                    {paper.author && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{paper.author}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(paper.publishDate)}</span>
                    </div>
                    {paper.downloadCount > 0 && (
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        <span>{paper.downloadCount} downloads</span>
                      </div>
                    )}
                  </div>

                  {paper.industryTags && paper.industryTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {paper.industryTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs capitalize"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => handleDownload(paper._id, paper.title)}
                  >
                    <Download className="mr-2 w-4 h-4" /> Download PDF
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default Resources;