import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Users, TrendingUp } from 'lucide-react';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Loader } from '@/components/common/Loader';
import api from '@/utils/api';
import { Project, Service } from '@/types';
import { ROUTES } from '@/utils/constants';

const Home: React.FC = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, servicesRes] = await Promise.all([
          api.get('/projects?featured=true&limit=3'),
          api.get('/services?featured=true'),
        ]);
        setFeaturedProjects(projectsRes.data.data || []);
        setServices(servicesRes.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader size="lg" />;

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-[url(/assets/home.png)] bg-cover bg-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container-custom relative py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Engineering Excellence for Critical Industries
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Leading provider of simulation and embedded systems solutions for renewable energy, medical devices, submarine systems, petroleum, and automotive industries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" onClick={() => window.location.href = ROUTES.PROJECTS}>
                View Our Work <ArrowRight className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.location.href = ROUTES.CONTACT}>
                Get In Touch
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Why Choose NexusCore?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Delivering mission-critical solutions with proven expertise
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: 'Innovation', desc: 'Cutting-edge technology solutions' },
              { icon: Shield, title: 'Reliability', desc: 'Safety-critical systems expertise' },
              { icon: Users, title: 'Experience', desc: '100+ successful projects' },
              { icon: TrendingUp, title: 'Results', desc: 'Proven ROI for clients' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center h-full" hoverable>
                  <item.icon className="w-12 h-12 mx-auto mb-4 text-primary-600" />
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 relative" id="services">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 "></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Specialized solutions for critical industries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm overflow-hidden relative" hoverable>
                  {/* Background Image for Card */}
                  {service.imageUpdated && (
                    <div 
                      className="absolute inset-0 opacity-10 bg-cover bg-center"
                      style={{ backgroundImage: `url(${service.imageUpdated})` }}
                    />
                  )}
                  
                  <div className="flex flex-col items-center text-center relative z-10">
                    {/* Service Icon */}
                    {service.icon ? (
                      <div className="mb-4">
                        <img 
                          src={service.icon} 
                          alt={`${service.title} icon`}
                          className="w-16 h-16 object-contain"
                          onError={(e) => {
                            // Fallback to default icon if image fails to load
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        {/* Fallback icon */}
                        <div className="hidden w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                          <Zap className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                        </div>
                      </div>
                    ) : (
                      // Default icon if no icon is uploaded
                      <div className="mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                          <Zap className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    )}

                    <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {service.description}
                    </p>
                    
                    {/* Industry Tags */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {service.industryTags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to={ROUTES.SERVICES}>
              <Button variant="primary" size="lg">
                View All Services <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Showcasing our best work across industries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden" hoverable onClick={() => window.location.href = `/projects/${project._id}`}>
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200 rounded-full text-sm">
                      {project.industry}
                    </span>
                    <h3 className="text-xl font-semibold mt-3 mb-2">{project.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{project.shortDesc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to={ROUTES.PROJECTS}>
              <Button variant="primary" size="lg">
                View All Projects <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to Transform Your Project?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help you achieve your engineering goals
          </p>
          <Link to={ROUTES.CONTACT}>
            <Button variant="secondary" size="lg">
              Get Started Today <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Home;