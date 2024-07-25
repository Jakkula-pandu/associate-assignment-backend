const { serviceLayerResponse } = require('../../utils');
const assessmentDbLayer = require('../../dblayer//assessment.dblayer');
const constants = require("../../constants");

exports.addAssessment = async (payload) => {
    let addAssessment = await assessmentDbLayer.insertAssessment(payload)
    return serviceLayerResponse(addAssessment)
}
exports.fetchAssessments = async ( page, size, search) => {
  const limit = parseInt(size);
  const offset = (parseInt(page) - constants.NUMBERS.ONE) * limit;
  let assessment = await assessmentDbLayer.fetchAllAssessments(limit, offset, search);
  serviceLayerResponse(assessment);
  return assessment;
};