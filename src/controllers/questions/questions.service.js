const { serviceLayerResponse } = require('../../utils');
const questionDbLayer = require('../../dblayer/questions.dblayer');
const constants = require("../../constants");



exports.submitTest = async (payload) => {
    console.log("payload",payload);
    const addQuestion = await questionDbLayer.submitTest(payload);
    console.log("addQuestion");
    return serviceLayerResponse(addQuestion)
};


exports.addQuestion = async (payload) => {
  console.log("payload", payload);
  const addQuestion = await questionDbLayer.insertQuestion(payload);
  console.log("addQuestion");
  return serviceLayerResponse(addQuestion);
};
exports.fetchQuestions = async ( page, size, search,limit,offset,assessment_id) => {
  let assessment = await questionDbLayer.fetchAllQuestions( page, size, search,limit,offset,assessment_id);
  serviceLayerResponse(assessment);
  return assessment;
};