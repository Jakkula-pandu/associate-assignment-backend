const constants = require('../constants');
const {questions,User,Submission,AssessmentAnswer,Assessment} = require('../models');
const { all } = require("../controllers/questions/questions.router");
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

exports.submitTest = async (data) => {
    try {
      let dataResult;
if(data.assessment_id){
   dataResult=await Assessment.findAll({ where: { assessment_id: data.assessment_id } })
  if(dataResult.length > constants.NUMBERS.ZERO){
  }
}
if(data.user_id){
  let userData=await Submission.findAll({where:{user_id:data.user_id,assessment_id:data.assessment_id}});
  if(userData.length > constants.NUMBERS.ZERO){
      return { status: constants.STATUS.TRUE, data: constants.STRINGS.ASSESSMENT_ALREADY_SUBMIT };
  }
}
        const submission = await Submission.create({
      user_id: data.user_id,
      assessment_id: data.assessment_id,
      batch_id: data.batch_id,
      is_attempted: true,
      submission_date: new Date(),
      input_answers: data.answers,
      created_by:data.user_id,
      assessment_name:dataResult[0]?.dataValues.assessment_name

    });


    for (const answer of  data.answers) {
      if (!answer.question_id) {
        throw new Error(`Missing question_id for answer: ${JSON.stringify(answer)}`);
      }
      
      await AssessmentAnswer.create({
        user_id: data.user_id,
        submission_id: submission.submission_id,
        question_id: answer.question_id, 
        answer_text: answer.answer,
        is_correct: false 
      });
    }
        return ({ status: constants.STATUS.TRUE,data:constants.STRINGS.ASSESSMENT_SUBMIT});
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
      await Assessment.update(
      { is_questions: true },
      { where: { assessment_id: data.assessment_id } } 
    );
    let question = await questions.create({
      question_text: data.question_text,
      question_type: data.question_type,
      options: data.options,
      correct_answers: data.correct_answers,
      userAnswer : false,
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
 

    const allAssessments = await questions.findAndCountAll({
      where: whereCondition,
      limit: limit > 0 ? limit : undefined, 
      offset: offset >= 0 ? offset : undefined, 
      order: [[constants.VARIABLES.CREATED_DATE, constants.VARIABLES.DESC]],
    });
    return { status: constants.STATUS.TRUE, data: allAssessments };
  } catch (error) {
    return { status: constants.STATUS.FALSE, data: error };
  }
};



// exports.fetchAllUserAnswers = async (userId, batchId, assessmentId) => {
//   try {
//     const userAnswers = await Submission.findAll({
//       where: {
//         user_id: userId,
//         batch_id: batchId,
//         assessment_id: assessmentId,
//       },
//     });

//     console.log("userAnswers", JSON.stringify(userAnswers, null, 2));

//     const response = await Promise.all(userAnswers.map(async (answer) => {
//       console.log("answer",answer);

//       const questionDetails = await questions.findOne({
//         where: { quns_id: answer.input_answers[0].question_id },
//       });

//       console.log("questionDetails", JSON.stringify(questionDetails, null, 2));

//       if (questionDetails) {
//         console.log("qqqqqqqqqq");

//         const result = {
//           question_id: questionDetails.quns_id,
//           question_text: questionDetails.question_text,
//           question_type: questionDetails.question_type,
//           // user_answer: answer.input_answers,
//            user_answer: answer.input_answers.map(input => ({
//             question_id: input.question_id, // Assuming input contains question_id
//             answer: input.answer, // Assuming input contains the user's answer
//           })),
//           correct_answers: questionDetails.correct_answers,
//         };
// console.log("resulttttttttt",result);
//         if (questionDetails.question_type === 'multiple_choice') {
//           result.options = questionDetails.options
//             ? questionDetails.options.map(option => ({
//                 option: option.option,
//                 isCorrect: option.isCorrect,
//               }))
//             : [];
//         }

//         return result;
//       } else {
//         console.log(`Question with id ${answer.input_answers[0].question_id} not found`);
//         return null;
//       }
//     }));

//     console.log("response", JSON.stringify(response, null, 2));

//     // Log each item in the response array
//     response.forEach(item => {
//       console.log("item********", item);
//     });

//     const filteredResponse = response.filter(item => item !== null);

//     console.log("filteredResponse", JSON.stringify(filteredResponse, null, 2));

//     return { status: constants.STATUS.TRUE, data: filteredResponse };
//   } catch (error) {
//     console.log("Error fetching user answers", error);
//     return { status: constants.STATUS.FALSE, data: error };
//   }
// };


exports.fetchAllUserAnswers = async (userId, batchId, assessmentId) => {
  try {
    const userAnswers = await Submission.findAll({
      where: {
        user_id: userId,
        batch_id: batchId,
        assessment_id: assessmentId,
      },
    });

    console.log("userAnswers", JSON.stringify(userAnswers, null, 2));

    const response = [];

    for (const answer of userAnswers) {
      console.log("answer", JSON.stringify(answer, null, 2));

      for (const input of answer.input_answers) {
        const questionDetails = await questions.findOne({
          where: { quns_id: input.question_id },
        });

        console.log("questionDetails", JSON.stringify(questionDetails, null, 2));

        if (questionDetails) {
          console.log("qqqqqqqqqq");

          const result = {
            question_id: questionDetails.quns_id,
            question_text: questionDetails.question_text,
            question_type: questionDetails.question_type,
            user_answer: {
              question_id: input.question_id,
              answer: input.answer, // Assuming input contains the user's answer
            },
            correct_answers: questionDetails.correct_answers,
          };

          // Include options only if the question type is multiple_choice
          if (questionDetails.question_type === 'multiple_choice') {
            result.options = questionDetails.options
              ? questionDetails.options.map(option => ({
                  option: option.option,
                  isCorrect: option.isCorrect,
                }))
              : [];
          }

          response.push(result); // Add the result to the response array
        } else {
          console.log(`Question with id ${input.question_id} not found`);
        }
      }
    }

    console.log("response", JSON.stringify(response, null, 2));
    const finalResponse = {
response,
  
    };

    console.log("finalResponse", JSON.stringify(finalResponse, null, 2));
 return { status: constants.STATUS.TRUE, data: finalResponse.response };
 
  } catch (error) {
    console.log("Error fetching user answers", error);
    return { status: false, statusCode: 500, message: error }; // Return an error structure
  }
};
