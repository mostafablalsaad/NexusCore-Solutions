import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { Loader } from '@/components/common/Loader';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import api from '@/utils/api';
import { Project } from '@/types';
import { formatDate } from '@/utils/helpers';
import { motion } from 'framer-motion';

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        setProject(response.data.data);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <PublicLayout>
        <Loader size="lg" text="Loading project..." />
      </PublicLayout>
    );
  }

  if (!project) {
    return (
      <PublicLayout>
        <div className="container-custom py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Link to="/projects">
            <Button><ArrowLeft className="mr-2" /> Back to Projects</Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container-custom py-12">
        <Link to="/projects">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2" /> Back to Projects
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200 rounded-full text-sm capitalize">
              {project.industry}
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-4">
              {project.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {project.shortDesc}
            </p>

            <div className="flex flex-wrap gap-4 mt-6 text-gray-600 dark:text-gray-400">
              {project.completionDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(project.completionDate)}</span>
                </div>
              )}
              {project.clientName && (
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{project.clientName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail */}
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-96 object-cover rounded-xl mb-8"
          />

          {/* Description */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <p className="whitespace-pre-wrap">{project.fullDesc}</p>
          </div>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Project Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.gallery.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </PublicLayout>
  );
};

export default ProjectDetail;
