import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { Loader } from '@/components/common/Loader';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ArrowLeft, Download, TrendingUp } from 'lucide-react';
import api from '@/utils/api';
import { CaseStudy } from '@/types';
import { motion } from 'framer-motion';

const CaseStudyDetail: React.FC = () => {
  const { id } = useParams();
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseStudy = async () => {
      try {
        const response = await api.get(`/case-studies/${id}`);
        setCaseStudy(response.data.data);
      } catch (error) {
        console.error('Error fetching case study:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCaseStudy();
  }, [id]);

  if (loading) {
    return (
      <PublicLayout>
        <Loader size="lg" text="Loading case study..." />
      </PublicLayout>
    );
  }

  if (!caseStudy) {
    return (
      <PublicLayout>
        <div className="container-custom py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Case Study Not Found</h1>
          <Link to="/case-studies">
            <Button><ArrowLeft className="mr-2" /> Back to Case Studies</Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container-custom py-12">
        <Link to="/case-studies">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2" /> Back to Case Studies
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200 rounded-full text-sm">
              {caseStudy.client}
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-4">
              {caseStudy.title}
            </h1>
            {caseStudy.industry && (
              <p className="text-xl text-gray-600 dark:text-gray-400 capitalize">
                {caseStudy.industry} Industry
              </p>
            )}
          </div>

          {/* Thumbnail */}
          {caseStudy.thumbnail && (
            <img
              src={caseStudy.thumbnail}
              alt={caseStudy.title}
              className="w-full h-96 object-cover rounded-xl mb-8"
            />
          )}

          {/* Metrics */}
          {caseStudy.metrics && caseStudy.metrics.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {caseStudy.metrics.map((metric, index) => (
                <Card key={index} className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    {metric.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {metric.label}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Content Sections */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-semibold mb-4">The Challenge</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {caseStudy.challenge}
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-semibold mb-4">Our Solution</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {caseStudy.solution}
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-semibold mb-4">Results</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {caseStudy.results}
              </p>
            </div>
          </div>

          {/* PDF Download */}
          {caseStudy.pdfUrl && (
            <div className="mt-12 text-center">
              <a href={caseStudy.pdfUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="lg">
                  <Download className="mr-2" /> Download Full Case Study
                </Button>
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </PublicLayout>
  );
};

export default CaseStudyDetail;