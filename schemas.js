// Joi for server-side validation
const Joi = require("joi");

module.exports.catSchema = Joi.object({
  cat: Joi.object({
    name: Joi.string().required(),
    // image: Joi.string().required(),
    breed: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    body: Joi.string().required(),
  }).required(),
});
