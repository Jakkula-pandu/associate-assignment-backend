const constants = require('../constants');
const {questions,User,Submission} = require('../models');
const { all } = require("../controllers/questions/questions.router");
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

exports.submitTest = async (data) => {
    try {
        const submission = await Submission.create({
      user_id: requestBody.user_id,
      assessment_id: requestBody.assessment_id,
      batch_id: requestBody.batch_id,
      is_attempted: true,
      submission_date: new Date(),
      input_answers: requestBody.answers,
      created_by:requestBody.user_id

    });
console.log("submission",submission);

    for (const answer of  requestBody.answers) {
      if (!answer.question_id) {
        throw new Error(`Missing question_id for answer: ${JSON.stringify(answer)}`);
      }
      
      await AssessmentAnswer.create({
        user_id: requestBody.user_id,
        submission_id: submission.submission_id,
        question_id: answer.question_id, // Ensure this is populated
        answer_text: answer.answer,
        is_correct: false // Replace with actual logic to determine correctness
      });
    }
        return ({ status: constants.STATUS.TRUE});
    } catch (error) {
        return ({ status: constants.STATUS.FALSE, data: error });

    }
};






exports.insertQuestion = async (data) => {
  try {
    let existingQuestions = await questions.findAll({ where: { question_text: data.question_text } });
    if (existingQuestions.length > constants.NUMBERS.ZERO) {
      return { status: constants.STATUS.TRUE, data: constants.STRINGS.QUESTIONS_EXIST };
    }
    
    console.log("data", data);
    let question = await questions.create({
      question_text: data.question_text,
      question_type: data.question_type,
      options: data.options,
      correct_answers: data.correct_answers,
      is_pending: true,
      created_by:data.created_by,
      assessment_id: data.assessment_id,
    });
    
    return { status: constants.STATUS.TRUE, data: question };
  } catch (error) {
    return { status: constants.STATUS.FALSE, data: error };
  }
};
exports.fetchAllQuestions = async (page,size,search,limit,offset,assessment_id) => {
  try {
    let whereCondition = {
      [Op.and]: [],
    };
if(assessment_id){
     whereCondition[Op.and].push({
        assessment_id: assessment_id,
      });
}
    // if (search && search.length >= constants.NUMBERS.THREE) {
    //   whereCondition[Op.and].push({
    //     [Op.or]: [
    //       { assessment_name: { [Op.iLike]: `%${search}%` } },
 
    //     ],
    //   });
    // } else if (search && search.length < constants.NUMBERS.THREE) {
    //   return errorHandle({ status: constants.STATUS.FALSE }, res, message);
    // }

    const allAssessments = await questions.findAndCountAll({
      where: whereCondition,
//       include: [
//   {
//     model: Batch,
//     as: constants.VARIABLES.ROLE, 
//     attributes: [
//       constants.VARIABLES.BATCH_ID,
//       constants.VARIABLES.BATCH_NAME,
//       constants.VARIABLES.CREATED_DATE,
//     ],
//   },
// ],
      limit: limit > 0 ? limit : undefined, 
      offset: offset >= 0 ? offset : undefined, 
      order: [[constants.VARIABLES.CREATED_DATE, constants.VARIABLES.DESC]],
    });
    return { status: constants.STATUS.TRUE, data: allAssessments };
  } catch (error) {
    return { status: constants.STATUS.FALSE, data: error };
  }
};