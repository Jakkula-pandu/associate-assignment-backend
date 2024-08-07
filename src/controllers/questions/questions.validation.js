const Joi = require('joi');

exports.validateUserReqBody = () => {
    return Joi.array().items(
        Joi.object({
            question_text: Joi.string().required()
                .messages({ "any.required": 'question_text is required' }),
            question_type: Joi.string().valid('multiple_choice', 'text') // Adjust valid types as needed
                .required().messages({ "any.required": 'question_type is required' }),
            options: Joi.array().items(
                Joi.object({
                    option: Joi.string().required()
                        .messages({ "any.required": 'Each option must have an option text' }),
                    isCorrect: Joi.boolean().required()
                        .messages({ "any.required": 'Each option must have an isCorrect value' }),
                })
            ).optional(),
            correct_answers: Joi.alternatives().conditional('question_type', {
                is: 'multiple_choice',
                then: Joi.array().items(
                    Joi.string().required().messages({ "any.required": 'correct_answers is required' })
                ).required().messages({ "any.required": 'correct_answers array is required' }),
                otherwise: Joi.string().required()
                    .messages({ "any.required": 'correct_answers is required' })
            }),
            userAnswer: Joi.boolean().optional()
                .messages({ "any.required": 'userAnswer is required' }),
        })
    ).min(1).messages({
        'array.min': 'The array must contain at least one question object'
    });
};




exports.validateReqBody = () => {
  return Joi.object({
    user_id: Joi.string().required(),
    batch_id: Joi.string().required(),
    assessment_id: Joi.string().required(),
    answers: Joi.array().items(
      Joi.object({
        question_id: Joi.number().required(),
        answer: Joi.string().required(),
      })
    ).required(),  // Ensure this property is marked as required
  });
};
