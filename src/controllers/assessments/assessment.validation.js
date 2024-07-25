const Joi = require("joi")

exports.validateUserReqBody = () => {
    return Joi.object({
        assessment_name: Joi.string().required()
            .messages({ "any.required": 'assessment_name is required' }),
      
    });
};