const Joi = require("joi")
console.log("pppppp");
exports.validateUserReqBody = () => {
    return Joi.object({
        batch_name: Joi.string().required()
            .messages({ "any.required": 'batch_name is required' }),
        username: Joi.array().items(
            Joi.string().required().messages({ "any.required": 'username is required' })
        ).required().messages({ "any.required": 'username array is required' })
    });
};