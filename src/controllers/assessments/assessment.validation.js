const Joi = require("joi")

exports.validateUserReqBody = () => {
    return Joi.object({
         no_of_questions:Joi.string().required().messages({ "any.required": 'no of questions is required'}),
        assessment_name: Joi.string().required()
            .messages({ "any.required": 'assessment_name is required' }),
      
    });
};