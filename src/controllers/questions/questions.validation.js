const Joi = require('joi');

// exports.validateUserReqBody = () => {
//     return Joi.object({
//         question_text: Joi.string().required()
//             .messages({ "any.required": 'question_text is required' }),
//         question_type: Joi.string().required()
//             .messages({ "any.required": 'question_type is required' }),
//         options: Joi.array().items(
//             Joi.object({
//                 option: Joi.string().required()
//                     .messages({ "any.required": 'Each option must have an option text' }),
//                 isCorrect: Joi.boolean().required()
//                     .messages({ "any.required": 'Each option must have an isCorrect value' })
//             })
//         ).optional(),
//         correct_answers: Joi.array().items(
//             Joi.string().required().messages({ "any.required": 'correct_answers is required' })
//         ).required().messages({ "any.required": 'correct_answers array is required' })
//     });
// };




// exports.validateUserReqBody = () => {
//     return Joi.array().items(Joi.object({
//         question_text: Joi.string().required()
//             .messages({ "any.required": 'question_text is required' }),
//         question_type: Joi.string().valid('multiple_choice', 'text') // Adjust valid types as needed
//             .required().messages({ "any.required": 'question_type is required' }),
//         options: Joi.array().items(
//             Joi.object({
//                 option: Joi.string().required()
//                     .messages({ "any.required": 'Each option must have an option text' }),
//                 isCorrect: Joi.boolean().required()
//                     .messages({ "any.required": 'Each option must have an isCorrect value' }),
                  
//             })
//         ).optional(),
      
//         correct_answers=multiple_choice? Joi.array().items(
//             Joi.string().required().messages({ "any.required": 'correct_answers is required' })
//         ).required().messages({ "any.required": 'correct_answers array is required' }):Joi.string().required()
//                     .messages({ "any.required": 'Each option must have an option text' }),
//           userAnswer:Joi.boolean().optional()
//                     .messages({ "any.required": 'useranswer is required' }),
//     }));
// };



exports.validateUserReqBody = () => {
    return Joi.array().items(Joi.object({
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
    }));
};

// exports.validateReqBody = () => {
//     return Joi.array().items(Joi.object({
//         user_id: Joi.string().required()
//             .messages({ "any.required": 'user_id is required' }),
//       batch_id: Joi.string().required()
//             .messages({ "any.required": 'batch_id is required' }),
//            assessment_id: Joi.string().required()
//             .messages({ "any.required": 'assessment_id is required' }),
//         answers: Joi.array().items(
//             Joi.string().required().messages({ "any.required": 'answers is required' })
//         ).required().messages({ "any.required": 'answers array is required' })
//     }));
// };




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
