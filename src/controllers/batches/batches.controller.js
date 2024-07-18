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
    exception(res)
    }
};

exports.fetchBatch = async (req, res) => {
  try {
    const {
      size = process.env.page_Size || constants.NUMBERS.TEN,
      search,
    } = req.query;
    const page = req.query.page || constants.NUMBERS.ONE;
    const result = await batchService.fetchBatches( page, size, search);
    if (result.status === constants.STATUS.TRUE) {
      const { count, rows } = result.data;
      if (rows.length > constants.NUMBERS.ZERO) {
        res.status(constants.STATUS_CODES.OK).json({
          status: constants.STATUS.TRUE,
          code: constants.STATUS_CODES.OK,
          totalItems: count,
          totalPages: Math.ceil(count / size),
          currentPage: parseInt(page),
          Batches: rows,
        });
        return;
      } else {
        handleException(
          constants.STATUS_CODES.DOES_NOT_EXIST,
           constants.STRINGS.NO_RECORDS,
          res
        );
        return;
      }
    } else {
      const message = constants.STRINGS.ERROR_FETCHING_USERS;
      return errorHandle(result.data, res, message);
    }
  } catch(e) {
    return exception(res);
  }
};