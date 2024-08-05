const userService = require("./users.service");
const constants = require("../../constants");
const cacheProvider = require("../../cache/cache");
const { handleException, errorHandle, exception } = require("../../utils");
const moment = require('moment-timezone');
// exports.fetchUsers = async (req, res) => {
//   try {
//     const {
//       role_id,
//       page,
//       size = process.env.page_Size || constants.NUMBERS.TEN,
//       search,
//     } = req.query;

//     let limit, offset;

//     if (page && parseInt(page) > 0) {
//       limit = parseInt(size);
//       offset = (parseInt(page) - constants.NUMBERS.ONE) * limit;
//     } else {
//       limit = undefined; // When fetching all records
//       offset = undefined; // When fetching all records
//     }

//     const result = await userService.fetchAllUsers(role_id, limit, offset, search);
//     if (result.status === constants.STATUS.TRUE) {
//       const { count, rows } = result.data;

//       if (rows.length > constants.NUMBERS.ZERO) {
//         res.status(constants.STATUS_CODES.OK).json({
//           status: constants.STATUS.TRUE,
//           code: constants.STATUS_CODES.OK,
//           totalItems: count,
//           totalPages: limit ? Math.ceil(count / limit) : 1, // Calculate total pages based on limit
//           currentPage: limit ? parseInt(page) : 1, // Current page based on the limit
//           allUsers: rows,
//         });
//         return;
//       } else {
//         handleException(
//           constants.STATUS_CODES.DOES_NOT_EXIST,
//           constants.MESSAGES[constants.STATUS_CODES.DOES_NOT_EXIST],
//           res
//         );
//         return;
//       }
//     } else {
//       const message = constants.STRINGS.ERROR_FETCHING_USERS;
//       return errorHandle(result.data, res, message);
//     }
//   } catch (e) {
//     return exception(res);
//   }
// };
exports.fetchUsers = async (req, res) => {
  try {
    const {
      role_id,
      page,
      size = process.env.page_Size || constants.NUMBERS.TEN,
      search,user_id
    } = req.query;
 
    let limit, offset;
 
    if (page && parseInt(page) > 0) {
      limit = parseInt(size);
      offset = (parseInt(page) - constants.NUMBERS.ONE) * limit;
    } else {
      limit = undefined; // When fetching all records
      offset = undefined; // When fetching all records
    }
 
    const result = await userService.fetchAllUsers(role_id, limit, offset, search,user_id);
    console.log("result",result);
     result.data.rows.forEach(result => {
    if (result.created_date) {
      // Add 5 hours and 30 minutes using moment
      result.created_date = moment(result.created_date)
        .add(5, 'hours')
        .add(30, 'minutes')
        .format('YYYY-MM-DD HH:mm:ss'); 
    }
  });
    console.log("result",result);
    if (result.status === constants.STATUS.TRUE) {
      const { count, rows } = result.data;
 
      if (rows.length > constants.NUMBERS.ZERO) {
 
        res.status(constants.STATUS_CODES.OK).json({
          status: constants.STATUS.TRUE,
          code: constants.STATUS_CODES.OK,
          totalItems: count,
          totalPages: limit ? Math.ceil(count / limit) : 1, // Calculate total pages based on limit
          currentPage: limit ? parseInt(page) : 1, // Current page based on the limit
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
  } catch (e) {
    console.log("eeeeeeeeee",e);
    return exception(res);
  }
};

