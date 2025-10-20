import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { Card } from '@/components/common/Card';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { FolderOpen } from 'lucide-react';
import api from '@/utils/api';
import { Project, Industry } from '@/types';
import { motion } from 'framer-motion';
import { INDUSTRIES } from '@/utils/constants';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | 'all'>('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const params = selectedIndustry !== 'all' ? `?industry=${selectedIndustry}` : '';
        const response = await api.get(`/projects${params}`);
        setProjects(response.data.data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [selectedIndustry]);

  if (loading) {
    return (
      <PublicLayout>
        <Loader size="lg" text="Loading projects..." />
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
            Our Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Explore our portfolio of successful implementations
          </p>
        </motion.div>

        {/* Industry Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedIndustry('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedIndustry === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All Industries
          </button>
          {INDUSTRIES.map((industry) => (
            <button
              key={industry.value}
              onClick={() => setSelectedIndustry(industry.value as Industry)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedIndustry === industry.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {industry.label}
            </button>
          ))}
        </div>

        {projects.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="w-16 h-16" />}
            title="No projects found"
            description="Try selecting a different industry filter"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/projects/${project._id}`}>
                  <Card className="overflow-hidden h-full" hoverable>
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200 rounded-full text-sm capitalize">
                          {project.industry}
                        </span>
                        {project.featured && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {project.shortDesc}
                      </p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
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

export default Projects;