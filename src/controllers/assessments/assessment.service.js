const { serviceLayerResponse } = require('../../utils');
const assessmentDbLayer = require('../../dblayer//assessment.dblayer');
const constants = require("../../constants");

exports.addAssessment = async (payload) => {
    let addAssessment = await assessmentDbLayer.insertAssessment(payload)
    return serviceLayerResponse(addAssessment)
}
exports.fetchAssessments = async ( page, size, search,limit,offset) => {
  let assessment = await assessmentDbLayer.fetchAllAssessments( page, size, search,limit,offset);
  serviceLayerResponse(assessment);
  return assessment;
};