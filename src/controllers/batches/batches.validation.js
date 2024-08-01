const Joi = require("joi")

exports.validateUserReqBody = () => {
    return Joi.object({
        batch_name: Joi.string().required()
            .messages({ "any.required": 'batch_name is required' }),
        users: Joi.array().items(
            Joi.string().required().messages({ "any.required": 'username is required' })
        ).required().messages({ "any.required": 'username array is required' }),

    });
};