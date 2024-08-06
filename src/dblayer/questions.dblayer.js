const constants = require('../constants');
const {questions,User} = require('../models');
const { all } = require("../controllers/questions/questions.router");
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

exports.submitTest = async (data) => {
    try {
        //    let existingQuestions = await questions.findAll({ where: { question_text: data.question_text } });
        // if(existingQuestions.length > constants.NUMBERS.ZERO){
        //     return { status: constants.STATUS.TRUE, data: constants.STRINGS.QUESTIONS_EXIST};
        // }
        console.log("data",data);
        let question = await questions.update({
             is_pending:false,           
        });
        return ({ status: constants.STATUS.TRUE, data: question });
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