const Schema = require("./questions.validation");
const { handleException, errorHandle, exception } = require("../../utils");
const { User ,Submission, questions,Assessment} = require('../../models'); 
const moment = require('moment-timezone');
const questionService = require('./questions.service');
const constants = require('../../constants');

exports.addQuestions = async (req, res) => {
  try {
    const assessment_id = req.query.assessment_id;
    const requestBody = req.body;

    if (!Array.isArray(requestBody)) {
      return res.status(constants.STATUS_CODES.BAD_REQUEST).json({
        status: constants.STATUS.FALSE,
        message: "Request body must be an array of questions.",
      });
    }

    const roleId = req.header("role_id");

    const questionsToInsert = requestBody.map(question => ({
      ...question,
      created_by: roleId,
      assessment_id: assessment_id,
    }));


    const assessment = await Assessment.findOne({ where: { assessment_id: assessment_id } });
    if (!assessment) {
      return res.status(constants.STATUS_CODES.NOT_FOUND).json({
        status: constants.STATUS.FALSE,
        message: "Assessment not found.",
      });
    }
    console.log("assessment",assessment);

    const currentQuestionCount = await questions.count({ where: { assessment_id: assessment_id } });
    const newQuestionsCount = questionsToInsert.length;

  
    const MAX_QUESTIONS = assessment.no_of_questions;

    if (currentQuestionCount + newQuestionsCount > MAX_QUESTIONS) {
      return res.status(constants.STATUS_CODES.BAD_REQUEST).json({
        status: constants.STATUS.FALSE,
        message: `Cannot add questions. Maximum limit of ${MAX_QUESTIONS} questions exceeded.`,
      });
    }

    console.log("questionsToInsert", questionsToInsert);

    const insertResults = await Promise.all(questionsToInsert.map(question => questionService.addQuestion(question)));
    const duplicates = insertResults.filter(result => result.data === constants.STRINGS.QUESTIONS_EXIST);
    const allSuccessful = insertResults.every(result => result.status === constants.STATUS.TRUE);

    if (duplicates.length > 0) {
      res.status(constants.STATUS_CODES.CONFLICT).json({
        status: constants.STATUS.FALSE,
        statusCode: constants.STATUS_CODES.CONFLICT,
        message: `${duplicates.length} questions already exist.`,
      });
    } else if (allSuccessful) {
      res.status(constants.STATUS_CODES.OK).json({
        status: constants.STATUS.TRUE,
        statusCode: constants.STATUS_CODES.OK,
        message: constants.STRINGS.ADD_QUESTIONS,
      });
    } else {
      res.status(constants.STATUS_CODES.CONFLICT).json({
        status: constants.STATUS.FALSE,
        statusCode: constants.STATUS_CODES.CONFLICT,
        message: constants.STRINGS.QUESTIONS_EXIST,
      });
    }
  } catch (e) {
    console.log("Error:", e);
    exception(res);
  }
};


exports.validateRequestBody = async (req, res, next) => {
  let schema = Schema.validateUserReqBody();
  let { error } = schema.validate(req.body);
  if (error) {
    console.log("errr",error);
    const statusCode = constants.STATUS_CODES.BAD_REQUEST;
    const message = error.details.map((detail) => detail.message).join(", ");
    handleException(statusCode, message, res);
  } else {
    console.log("next");
    next();
  }
};

exports.validateRequest = async (req, res, next) => {
  let schema = Schema.validateReqBody();
  let { error } = schema.validate(req.body);
  if (error) {
    console.log("errr",error);
    const statusCode = constants.STATUS_CODES.BAD_REQUEST;
    const message = error.details.map((detail) => detail.message).join(", ");
    handleException(statusCode, message, res);
  } else {
    console.log("next");
    next();
  }
};
exports.fetchQuestions = async (req, res) => {
  try {
    const {page,
      size = process.env.page_Size || constants.NUMBERS.TEN,
      search,assessment_id
    } = req.query;
     let limit, offset;
 
    if (page && parseInt(page) > 0) {
      limit = parseInt(size);
      offset = (parseInt(page) - constants.NUMBERS.ONE) * limit;
    } else {
      limit = undefined; 
      offset = undefined; 
    }

    const result = await questionService.fetchQuestions( page, size, search,limit,offset,assessment_id);
    console.log("result",result);
     result.data.rows.forEach(result => {
    if (result.created_date) {
      result.created_date = moment(result.created_date)
        .add(5, 'hours')
        .add(30, 'minutes')
        .format('YYYY-MM-DD HH:mm:ss'); 
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

exports.submitTest = async(req,res) => {

try{
      const requestBody = req.body;
      console.log("requestBody",requestBody.input_answers);
      let submission = await questionService.assessmentSubmit(requestBody);
console.log("submission",submission);

   if (submission.status === constants.STATUS.TRUE) {
      if (submission.data === constants.STRINGS.ASSESSMENT_ALREADY_SUBMIT) {
        res.status(constants.STATUS_CODES.CONFLICT).json({
          status: constants.STATUS.FALSE,
          statusCode: constants.STATUS_CODES.CONFLICT,
          message: submission.data,
        });
      } else {
        res.status(constants.STATUS_CODES.OK).json({
          status: constants.STATUS.TRUE,
          statusCode: constants.STATUS_CODES.OK,
          message: constants.STRINGS.ASSESSMENT_SUBMIT,
        });
      }
    } else {
      handleException(
        constants.STATUS_CODES.SOMETHING_WENT_WRONG,
        constants.MESSAGES[constants.STATUS_CODES.SOMETHING_WENT_WRONG],
        res
      );
    }

  
}catch(e){
    console.log("eeeee",e);
    return exception(res); 
}
}

exports.fetchUserAnswers = async (req, res) => {
  try {
    const userId = req.query.user_id;
    const batchId = req.query.batch_id;
    const assessmentId = req.query.assessment_id;
    let userAnswers = await questionService.userAnswers(userId,batchId,assessmentId);
    if (userAnswers.status === constants.STATUS.TRUE) {
       res.status(constants.STATUS_CODES.OK).json({
          status: constants.STATUS.TRUE,
          statusCode: constants.STATUS_CODES.OK,
          userAnswers: userAnswers.data,
        });
    }
  } catch (e) {
    console.log("Error fetching user answers", e);
    return exception(res);
  }
};
