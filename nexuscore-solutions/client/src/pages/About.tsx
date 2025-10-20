import React, { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { Card } from '@/components/common/Card';
import { Loader } from '@/components/common/Loader';
import { Linkedin, Mail } from 'lucide-react';
import api from '@/utils/api';
import { TeamMember } from '@/types';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await api.get('/team');
        setTeam(response.data.data || []);
      } catch (error) {
        console.error('Error fetching team:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <PublicLayout>
      <div className="container-custom py-12">
        {/* Company Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            About NexusCore Solutions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto mb-8">
            We are a leading B2B software engineering firm specializing in simulation 
            and embedded systems for critical industries. With over a decade of experience, 
            we deliver innovative solutions that drive operational excellence.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400">
              To empower critical industries with cutting-edge simulation and embedded 
              systems that enhance safety, efficiency, and innovation.
            </p>
          </Card>
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-400">
              To be the global leader in engineering excellence, transforming how 
              industries approach complex technical challenges through innovation and expertise.
            </p>
          </Card>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Industry experts committed to your success
            </p>
          </div>

          {loading ? (
            <Loader size="lg" text="Loading team..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 text-center h-full">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-primary-600 flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary-600 mb-3">{member.role}</p>
                    {member.bio && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                        {member.bio}
                      </p>
                    )}
                    <div className="flex justify-center gap-3">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Mail className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Values */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Excellence',
                description: 'We strive for perfection in every project, ensuring the highest standards of quality and reliability.',
              },
              {
                title: 'Innovation',
                description: 'We embrace cutting-edge technologies and methodologies to solve complex engineering challenges.',
              },
              {
                title: 'Integrity',
                description: 'We maintain transparency, honesty, and ethical practices in all our business relationships.',
              },
            ].map((value, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default About;
