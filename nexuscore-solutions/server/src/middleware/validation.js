const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message,
      }));
      console.log('Validation errors:', errors);
      return res.status(400).json({ errors });
    }

    req.body = value;
    next();
  };
};

// Validation Schemas
const schemas = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  contact: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    company: Joi.string().max(100),
    phone: Joi.string().max(20),
    message: Joi.string().min(10).max(1000).required(),
  }),

  newsletter: Joi.object({
    email: Joi.string().email().required(),
  }),

  service: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().min(10).required(),
    industryTags: Joi.array().items(
      Joi.string().valid('renewable', 'medical', 'submarine', 'petroleum', 'automotive','home appliances')
    ),
    icon: Joi.string().uri(),
    order: Joi.number().integer().min(0),
    featured: Joi.boolean(),
  }),

  project: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    shortDesc: Joi.string().min(10).max(200).required(),
    fullDesc: Joi.string().min(50).required(),
    industry: Joi.string().valid('renewable', 'medical', 'submarine', 'petroleum', 'automotive','home appliances').required(),
    thumbnail: Joi.string().uri().required(),
    gallery: Joi.array().items(Joi.string().uri()),
    featured: Joi.boolean(),
    technologies: Joi.array().items(Joi.string()),
    completionDate: Joi.date(),
    clientName: Joi.string().max(100),
    order: Joi.number().integer().min(0),
  }),

  caseStudy: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    client: Joi.string().min(2).max(100).required(),
    industry: Joi.string().valid('renewable', 'medical', 'submarine', 'petroleum', 'automotive'),
    challenge: Joi.string().min(20).required(),
    solution: Joi.string().min(20).required(),
    results: Joi.string().min(20).required(),
    metrics: Joi.array().items(Joi.object({
      label: Joi.string().required(),
      value: Joi.string().required(),
    })),
    pdfUrl: Joi.string().uri(),
    relatedProject: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    thumbnail: Joi.string().uri(),
    featured: Joi.boolean(),
  }),

  whitepaper: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    excerpt: Joi.string().min(20).max(500).required(),
    pdfUrl: Joi.string().uri().required(),
    publishDate: Joi.date(),
    industryTags: Joi.array().items(
      Joi.string().valid('renewable', 'medical', 'submarine', 'petroleum', 'automotive')
    ),
    thumbnail: Joi.string().uri(),
    author: Joi.string().max(100),
    featured: Joi.boolean(),
  }),

  teamMember: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    role: Joi.string().min(2).max(100).required(),
    bio: Joi.string().max(1000),
    photo: Joi.string().uri(),
    linkedin: Joi.string().uri(),
    email: Joi.string().email(),
    order: Joi.number().integer().min(0),
    active: Joi.boolean(),
  }),

  achievement: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().max(500),
    date: Joi.date().required(),
    type: Joi.string().valid('award', 'certification', 'partnership', 'milestone').required(),
    logo: Joi.string().uri(),
    order: Joi.number().integer().min(0),
    featured: Joi.boolean(),
  }),
};

module.exports = { validate, schemas };
