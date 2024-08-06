const Schema = require("./questions.validation");
const { handleException, errorHandle, exception } = require("../../utils");
const { User ,Submission, AssessmentAnswer} = require('../../models'); 
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
//     // const submission = await Submission.create({
//     //   user_id: requestBody.user_id,
//     //   assessment_id: requestBody.assessment_id,
//     //   batch_id: requestBody.batch_id,
//     //   is_attempted: true,
//     //   submission_date: new Date(),
//     //   input_answers: requestBody.answers,
//     //   created_by:requestBody.user_id

//     // });
// console.log("submission",submission);

//     for (const answer of  requestBody.answers) {
//       if (!answer.question_id) {
//         throw new Error(`Missing question_id for answer: ${JSON.stringify(answer)}`);
//       }
      
//       await AssessmentAnswer.create({
//         user_id: requestBody.user_id,
//         submission_id: submission.submission_id,
//         question_id: answer.question_id, // Ensure this is populated
//         answer_text: answer.answer,
//         is_correct: false // Replace with actual logic to determine correctness
//       });
//     }

    res.status(201).json({ message: 'Assessment submitted successfully', submission: submission });


    // res.status(201).json({ message: 'Assessment submitted successfully!' });
}catch(e){
    console.log("eeeee",e);
    return exception(res); 
}
}