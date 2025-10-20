import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { Card } from '@/components/common/Card';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { FileText, ArrowRight } from 'lucide-react';
import api from '@/utils/api';
import { CaseStudy } from '@/types';
import { motion } from 'framer-motion';

const CaseStudies: React.FC = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const response = await api.get('/case-studies');
        setCaseStudies(response.data.data || []);
      } catch (error) {
        console.error('Error fetching case studies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCaseStudies();
  }, []);

  if (loading) {
    return (
      <PublicLayout>
        <Loader size="lg" text="Loading case studies..." />
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
            Case Studies
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Real-world success stories demonstrating measurable impact
          </p>
        </motion.div>

        {caseStudies.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-16 h-16" />}
            title="No case studies available"
            description="Check back soon for detailed success stories"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/case-studies/${study._id}`}>
                  <Card className="p-6 h-full" hoverable>
                    {study.thumbnail && (
                      <img
                        src={study.thumbnail}
                        alt={study.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200 rounded-full text-sm">
                        {study.client}
                      </span>
                      {study.featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-semibold mb-3">{study.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {study.challenge}
                    </p>

                    {study.metrics && study.metrics.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {study.metrics.slice(0, 3).map((metric, i) => (
                          <div key={i} className="text-center">
                            <div className="text-2xl font-bold text-primary-600">
                              {metric.value}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center text-primary-600 font-medium">
                      Read Case Study <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default CaseStudies;