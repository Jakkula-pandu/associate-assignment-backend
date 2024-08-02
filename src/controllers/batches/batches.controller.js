const batchService = require("./batches.service");
const constants = require("../../constants");
const Schema = require("./batches.validation");
const { handleException, errorHandle, exception } = require("../../utils");
const { User } = require('../../models'); 

exports.validateRequestBody = async (req, res, next) => {
  let schema = Schema.validateUserReqBody();
  let { error } = schema.validate(req.body);
  if (error) {
    const statusCode = constants.STATUS_CODES.BAD_REQUEST;
    const message = error.details.map((detail) => detail.message).join(", ");
    handleException(statusCode, message, res);
  } else {
    next();
  }
};

// exports.addBatch = async (req, res) => {
//   try {
//     const requestBody = req.body;
//     requestBody.role_id = req.header("role_id");
//     let insertBatch = await batchService.addBatch(requestBody);
//     if (insertBatch.status === constants.STATUS.TRUE) {
//       if (insertBatch.data === constants.STRINGS.BATCH_EXIST) {
//         res.status(constants.STATUS_CODES.CONFLICT).json({
//           status: constants.STATUS.FALSE,
//           statusCode: constants.STATUS_CODES.CONFLICT,
//           message: insertBatch.data,
//         });
//       } else {
//         res.status(constants.STATUS_CODES.OK).json({
//           status: constants.STATUS.TRUE,
//           statusCode: constants.STATUS_CODES.OK,
//           message: constants.STRINGS.ADD_BATCH,
//         });
//       }
//     } else {
//       handleException(
//         constants.STATUS_CODES.SOMETHING_WENT_WRONG,
//         constants.MESSAGES[constants.STATUS_CODES.SOMETHING_WENT_WRONG],
//         res
//       );
//     }
//   } catch (e) {
//     exception(res);
//   }
// };


exports.addBatch = async (req, res) => {
  try {
    const requestBody = req.body;
    const userNames = requestBody.users; // Get the array of user names

    // Fetch user IDs from the database
    const userIds = await getUserIdsFromNames(userNames); // Function to fetch user IDs from names

    // Get the role ID and set it to created_by
    const roleId = req.header("role_id");
    requestBody.created_by = roleId; // Store the role ID in created_by
    requestBody.user_ids = userIds; // Store the user IDs in user_ids

    // Proceed with inserting the batch
    let insertBatch = await batchService.addBatch(requestBody);
    if (insertBatch.status === constants.STATUS.TRUE) {
      if (insertBatch.data === constants.STRINGS.BATCH_EXIST) {
        res.status(constants.STATUS_CODES.CONFLICT).json({
          status: constants.STATUS.FALSE,
          statusCode: constants.STATUS_CODES.CONFLICT,
          message: insertBatch.data,
        });
      } else {
        res.status(constants.STATUS_CODES.OK).json({
          status: constants.STATUS.TRUE,
          statusCode: constants.STATUS_CODES.OK,
          message: constants.STRINGS.ADD_BATCH,
        });
      }
    } else {
      handleException(
        constants.STATUS_CODES.SOMETHING_WENT_WRONG,
        constants.MESSAGES[constants.STATUS_CODES.SOMETHING_WENT_WRONG],
        res
      );
    }
  } catch (e) {
    console.log("eeeeeeeeee",e);
    exception(res);
  }
};


const getUserIdsFromNames = async (userNames) => {
  console.log("userNames",userNames);
  const users = await User.findAll({
    where: {
      username: userNames, 
    },
  
  });
    console.log("users",users);
  return users.map(user => user.user_id); // Return an array of user IDs
};

exports.fetchBatch = async (req, res) => {
  try {
    const { size = process.env.page_Size || constants.NUMBERS.TEN, search,user_id } =
      req.query;
    const page = req.query.page || constants.NUMBERS.ONE;
     let limit, offset;
 
    if (page && parseInt(page) > 0) {
      limit = parseInt(size);
      offset = (parseInt(page) - constants.NUMBERS.ONE) * limit;
    } else {
      limit = undefined; // When fetching all records
      offset = undefined; // When fetching all records
    }
    const result = await batchService.fetchBatches(page, size, search,user_id,limit, offset,);
    console.log("result",result);
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
  } catch (e) {
    console.log("eeeeee",e);
    return exception(res);
  }
};


