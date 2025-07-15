import Joi from 'joi';

export const validateUser = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export const validatePost = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().max(200).required(),
    content: Joi.string().required(),
    excerpt: Joi.string().max(300),
    featuredImage: Joi.string().allow(''),
    category: Joi.string().required(),
    tags: Joi.array().items(Joi.string()),
    status: Joi.string().valid('draft', 'published', 'archived')
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export const validateCategory = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    description: Joi.string().max(200).allow(''),
    color: Joi.string().pattern(/^#[0-9A-F]{6}$/i)
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};