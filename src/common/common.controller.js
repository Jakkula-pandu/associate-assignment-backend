const {
  handleException,
  tokenGenerate,
  exception,
  constructResponse,
} = require("../utils");
const constants = require("../constants");

exports.roleIdValidation = async (req, res, next) => {
  if (
    !req.header("role_id") ||
    req.header("role_id") === constants.STRING_COMPARE.NULL ||
    !Number.isInteger(Number(req.header("role_id")))
  ) {
    handleException(
      constants.STATUS_CODES.BAD_REQUEST,
      "role_id is " + constants.MESSAGES[constants.STATUS_CODES.BAD_REQUEST],
      res
    );
    return;
  } else {
    if (req.header("role_id") === constants.NUMBERS.FOUR) {
      handleException(
        constants.STATUS_CODES.UNAUTHORIZED,
        constants.STRINGS.NOT_AUTHORIZED,
        res
      );
      return;
    }
    next();
  }
};
