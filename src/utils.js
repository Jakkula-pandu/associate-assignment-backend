const constants = require("../src/constants");

exports.handleException = (statusCode, message, res) => {
  const customError = {
    status: constants.STATUS.FALSE,
    statusCode: statusCode,
    message: message,
  };
  res.status(statusCode).send(customError);
};

exports.errorHandle = (dataResult, res, msg) => {
  if (dataResult.status === constants.STATUS.FALSE) {
    statusCode = constants.STATUS_CODES.SOMETHING_WENT_WRONG;
    message = constants.MESSAGES[statusCode];
    exports.handleException(statusCode, message, res);
    return;
  }

  if (dataResult.data.rows >= 0 || dataResult.data.length === 0) {
    statusCode = constants.STATUS_CODES.DOES_NOT_EXIST;
    message = msg + " " + constants.MESSAGES[statusCode];
    exports.handleException(statusCode, message, res);
    return;
  }
};

exports.exception = (res) => {
  const statusCode = constants.STATUS_CODES.INTERNAL_SERVER_ERROR;
  const message = constants.MESSAGES[statusCode];
  exports.handleException(statusCode, message, res);
};
exports.serviceLayerResponse = (responseData) => {
  if (responseData.status === constants.STATUS.TRUE) {
    return { status: constants.STATUS.TRUE, data: responseData.data };
  } else {
    return { status: constants.STATUS.FALSE, data: responseData.data };
  }
};
