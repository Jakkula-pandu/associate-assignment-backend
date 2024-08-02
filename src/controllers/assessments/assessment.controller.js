const assessmentService = require("./assessment.service");
const constants = require("../../constants");
const Schema = require('./assessment.validation');
const { handleException, errorHandle, exception } = require("../../utils");
const moment = require('moment-timezone');
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

exports.addAssessment=async(req,res)=>{
      try {
        const requestBody = req.body;
        requestBody.role_id = req.header("role_id");
        requestBody.batch_id = req.header("batch_id");
        let insertAssessment = await assessmentService.addAssessment(requestBody);

        // return res.status(200).json(insertAssessment);
           if (insertAssessment.status === constants.STATUS.TRUE) {
      if (insertAssessment.data === constants.STRINGS.BATCH_EXIST) {
        res.status(constants.STATUS_CODES.CONFLICT).json({
          status: constants.STATUS.FALSE,
          statusCode: constants.STATUS_CODES.CONFLICT,
          message: insertAssessment.data,
        });
      } else {
        res.status(constants.STATUS_CODES.OK).json({
          status: constants.STATUS.TRUE,
          statusCode: constants.STATUS_CODES.OK,
          message: constants.STRINGS.ADD_ASSESSMENT,
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
    exception(res)
    }
}

exports.fetchAssessment = async (req, res) => {
  try {
    const {page,
      size = process.env.page_Size || constants.NUMBERS.TEN,
      search,
    } = req.query;
     let limit, offset;
 
    if (page && parseInt(page) > 0) {
      limit = parseInt(size);
      offset = (parseInt(page) - constants.NUMBERS.ONE) * limit;
    } else {
      limit = undefined; // When fetching all records
      offset = undefined; // When fetching all records
    }

    const result = await assessmentService.fetchAssessments( page, size, search,limit,offset);
    console.log("result",result);
     result.data.rows.forEach(result => {
    if (result.created_date) {
      // Add 5 hours and 30 minutes using moment
      result.created_date = moment(result.created_date)
        .add(5, 'hours')
        .add(30, 'minutes')
        .format('YYYY-MM-DD HH:mm:ss'); // Adjust the format as needed
    }
  });
    if (result.status === constants.STATUS.TRUE) {
      const { count, rows } = result.data;
      if (rows.length > constants.NUMBERS.ZERO) {
        res.status(constants.STATUS_CODES.OK).json({
          status: constants.STATUS.TRUE,
          code: constants.STATUS_CODES.OK,
          totalItems: count,
          totalPages: Math.ceil(count / size),
          currentPage: parseInt(page),
          Assessments: rows,
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
    console.log("eeeee",e);
    return exception(res);
  }
};