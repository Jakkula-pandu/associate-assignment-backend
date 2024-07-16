const batchService = require("./batches.service");
const constants = require("../../constants");
const Schema = require('./batches.validation');
const { handleException, errorHandle, exception } = require("../../utils");


exports.validateRequestBody = async (req, res, next) => {
    let schema = Schema.validateUserReqBody();
    let { error } = schema.validate(req.body);
    if (error) {
      const statusCode = constants.STATUS_CODES.BAD_REQUEST;
        const message = error.details.map(detail => detail.message).join(', ');
        handleException(statusCode, message, res);
    }
    else {
        next();
    }
}

exports.addBatch = async (req, res) => {
    try {
        const requestBody = req.body;
        requestBody.role_id = req.header("role_id");

        let insertBatch = await batchService.addBatch(requestBody);
        return res.status(200).json(insertBatch);
    } catch (e) {
     return exception(res)
    }
};
