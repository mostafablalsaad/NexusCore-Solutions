require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Service = require('../models/Service');
const Project = require('../models/Project');
const CaseStudy = require('../models/CaseStudy');
const Whitepaper = require('../models/Whitepaper');
const TeamMember = require('../models/TeamMember');
const Achievement = require('../models/Achievement');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Service.deleteMany();
    await Project.deleteMany();
    await CaseStudy.deleteMany();
    await Whitepaper.deleteMany();
    await TeamMember.deleteMany();
    await Achievement.deleteMany();

    // Seed Services
    console.log('📦 Seeding services...');
    const services = await Service.insertMany([
      {
        title: 'Simulation Solutions',
        description: 'Advanced simulation and modeling for critical systems in renewable energy, medical devices, and more.',
        industryTags: ['renewable', 'medical'],
        icon: 'simulation',
        order: 1,
        featured: true,
      },
      {
        title: 'Embedded Systems',
        description: 'Custom embedded software solutions for submarine systems, petroleum, and automotive industries.',
        industryTags: ['submarine', 'petroleum', 'automotive'],
        icon: 'embedded',
        order: 2,
        featured: true,
      },
      {
        title: 'System Integration',
        description: 'Seamless integration of complex systems across multiple platforms and industries.',
        industryTags: ['renewable', 'medical', 'submarine'],
        icon: 'integration',
        order: 3,
        featured: false,
      },
    ]);

    // Seed Projects
    console.log('🏗️  Seeding projects...');
    const projects = await Project.insertMany([
      {
        title: 'Renewable Energy Grid Simulation',
        shortDesc: 'Advanced simulation platform for renewable energy grid optimization',
        fullDesc: 'Developed a comprehensive simulation platform that models renewable energy grid behavior under various conditions. The system helps optimize energy distribution and predict potential issues.',
        industry: 'renewable',
        thumbnail: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
        featured: true,
        relatedProject: projects[0]._id,
      },
      {
        title: 'FDA-Compliant Medical Device Development',
        client: 'MedTech Solutions',
        industry: 'medical',
        challenge: 'Developing a safety-critical medical imaging device that meets FDA 510(k) and CE Mark requirements.',
        solution: 'Implemented a robust embedded system with multiple redundancy layers, comprehensive testing, and full compliance documentation.',
        results: 'Successfully achieved FDA clearance in record time with zero post-market safety issues.',
        metrics: [
          { label: 'FDA Clearance Time', value: '8 months' },
          { label: 'Safety Incidents', value: '0' },
          { label: 'Reliability Rating', value: '99.98%' },
        ],
        thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
        featured: true,
        relatedProject: projects[1]._id,
      },
    ]);

    // Seed Whitepapers
    console.log('📄 Seeding whitepapers...');
    await Whitepaper.insertMany([
      {
        title: 'The Future of Renewable Energy Simulation',
        excerpt: 'An in-depth analysis of simulation technologies transforming the renewable energy sector.',
        pdfUrl: 'https://example.com/whitepapers/renewable-energy-simulation.pdf',
        publishDate: new Date('2023-08-15'),
        industryTags: ['renewable'],
        author: 'Dr. Sarah Johnson',
        thumbnail: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800',
        featured: true,
      },
      {
        title: 'Embedded Systems in Medical Devices: Best Practices',
        excerpt: 'A comprehensive guide to developing safe and effective embedded systems for medical applications.',
        pdfUrl: 'https://example.com/whitepapers/medical-embedded-systems.pdf',
        publishDate: new Date('2023-10-20'),
        industryTags: ['medical'],
        author: 'Dr. Michael Chen',
        thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800',
        featured: true,
      },
      {
        title: 'Automotive Software Safety Standards',
        excerpt: 'Understanding ISO 26262 and ASPICE requirements for automotive embedded software.',
        pdfUrl: 'https://example.com/whitepapers/automotive-safety.pdf',
        publishDate: new Date('2023-07-10'),
        industryTags: ['automotive'],
        author: 'James Rodriguez',
        featured: false,
      },
    ]);

    // Seed Team Members
    console.log('👥 Seeding team members...');
    await TeamMember.insertMany([
      {
        name: 'Dr. Sarah Johnson',
        role: 'Chief Technology Officer',
        bio: '15+ years of experience in simulation and renewable energy systems. PhD in Electrical Engineering from MIT.',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
        linkedin: 'https://linkedin.com/in/sarah-johnson',
        email: 'sarah.johnson@nexuscore.com',
        order: 1,
        active: true,
      },
      {
        name: 'Dr. Michael Chen',
        role: 'Head of Medical Systems',
        bio: 'Expert in medical device development with 12+ years in FDA-regulated environments. PhD in Biomedical Engineering.',
        photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
        linkedin: 'https://linkedin.com/in/michael-chen',
        email: 'michael.chen@nexuscore.com',
        order: 2,
        active: true,
      },
      {
        name: 'James Rodriguez',
        role: 'Director of Embedded Systems',
        bio: 'Specialist in safety-critical embedded software for automotive and submarine applications. 18+ years of experience.',
        photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
        linkedin: 'https://linkedin.com/in/james-rodriguez',
        email: 'james.rodriguez@nexuscore.com',
        order: 3,
        active: true,
      },
    ]);

    // Seed Achievements
    console.log('🏆 Seeding achievements...');
    await Achievement.insertMany([
      {
        title: 'ISO 9001:2015 Certified',
        description: 'Achieved ISO 9001:2015 certification for quality management systems.',
        date: new Date('2022-03-15'),
        type: 'certification',
        logo: 'https://example.com/logos/iso9001.png',
        order: 1,
        featured: true,
      },
      {
        title: 'Best Innovation Award 2023',
        description: 'Received the Best Innovation Award at the International Embedded Systems Conference.',
        date: new Date('2023-06-20'),
        type: 'award',
        logo: 'https://example.com/logos/innovation-award.png',
        order: 2,
        featured: true,
      },
      {
        title: 'Strategic Partnership with MIT',
        description: 'Established research partnership with MIT for advanced simulation technologies.',
        date: new Date('2023-09-01'),
        type: 'partnership',
        logo: 'https://example.com/logos/mit.png',
        order: 3,
        featured: true,
      },
      {
        title: '100+ Projects Completed',
        description: 'Successfully delivered over 100 projects across five critical industries.',
        date: new Date('2023-11-15'),
        type: 'milestone',
        order: 4,
        featured: false,
      },
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`
    📊 Summary:
    - Services: ${services.length}
    - Projects: ${projects.length}
    - Case Studies: 2
    - Whitepapers: 3
    - Team Members: 3
    - Achievements: 4
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
