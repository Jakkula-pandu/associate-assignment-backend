const userService = require("./users.service");
const constants = require("../../constants");
const cacheProvider = require("../../cache/cache");
const { handleException, errorHandle, exception } = require("../../utils");

exports.fetchUsers = async (req, res) => {
  try {
    const {
      role_id,
      page = process.env.page || constants.NUMBERS.ONE,
      size = process.env.page_Size || constants.NUMBERS.TEN,
      search,
    } = req.query;

    const result = await userService.fetchAllUsers(role_id, page, size, search);

    if (result.status === constants.STATUS.TRUE) {
      const { count, rows } = result.data;

      if (rows.length > constants.NUMBERS.ZERO) {
        res.status(constants.STATUS_CODES.OK).json({
          status: constants.STATUS.TRUE,
          code: constants.STATUS_CODES.OK,
          totalItems: count,
          totalPages: Math.ceil(count / size),
          currentPage: parseInt(page),
          allUsers: rows,
        });
        return;
      } else {
        handleException(
          constants.STATUS_CODES.DOES_NOT_EXIST,
          constants.MESSAGES[constants.STATUS_CODES.DOES_NOT_EXIST],
          res
        );
        return;
      }
    } else {
      const message = constants.STRINGS.ERROR_FETCHING_USERS;
      return errorHandle(result.data, res, message);
    }
  } catch {
    return exception(res);
  }
};
