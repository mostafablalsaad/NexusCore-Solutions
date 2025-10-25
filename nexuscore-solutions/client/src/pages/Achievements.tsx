import React, { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { Card } from '@/components/common/Card';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { Badge } from '@/components/common/Badge';
import { Award, Calendar } from 'lucide-react';
import api from '@/utils/api';
import { Achievement } from '@/types';
// import { formatDate } from '@/utils/helpers';
import { motion } from 'framer-motion';
import { ACHIEVEMENT_TYPES } from '@/utils/constants';

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const params = filter !== 'all' ? `?type=${filter}` : '';
        const response = await api.get(`/achievements${params}`);
        setAchievements(response.data.data || []);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, [filter]);

  if (loading) {
    return (
      <PublicLayout>
        <Loader size="lg" text="Loading achievements..." />
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
            Our Achievements
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Recognition, certifications, and milestones in our journey
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All
          </button>
          {ACHIEVEMENT_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setFilter(type.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === type.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {type.icon} {type.label}
            </button>
          ))}
        </div>

        {achievements.length === 0 ? (
          <EmptyState
            icon={<Award className="w-16 h-16" />}
            title="No achievements found"
            description="Try selecting a different filter"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full">
                  {achievement.logo && (
                    <img
                      src={achievement.logo}
                      alt={achievement.title}
                      className="w-20 h-20 object-contain mx-auto mb-4"
                    />
                  )}
                  
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Badge variant="primary" className="capitalize">
                      {achievement.type}
                    </Badge>
                    {achievement.featured && (
                      <Badge variant="warning">Featured</Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-center mb-3">
                    {achievement.title}
                  </h3>

                  {achievement.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                      {achievement.description}
                    </p>
                  )}

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {/* <span>{formatDate(achievement.date, 'MMMM yyyy')}</span> */}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default Achievements;