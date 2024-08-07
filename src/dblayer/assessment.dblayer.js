const constants = require('../constants');
const {Assessment,Batch,questions} = require('../models');
const { all } = require('../controllers/batches/batches.router');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { handleException, errorHandle, exception } = require('../utils');

exports.insertAssessment = async (data) => {
    try {
        let existingAssessment = await Assessment.findAll({ where: { assessment_name: data.assessment_name, batch_id: data.batch_id } });
        if(existingAssessment.length > constants.NUMBERS.ZERO){
            return { status: constants.STATUS.TRUE, data: constants.STRINGS.ASSESSMENT_EXIST};
        }
        let assessment = await Assessment.create({
            assessment_name: data.assessment_name,
            no_of_questions:data.no_of_questions,
            batch_id: data.batch_id,
            created_by: data.role_id,
            is_questions:false
        });
        console.log("assessment",assessment);
        return ({ status: constants.STATUS.TRUE, data: assessment });
    } catch (error) {
        return ({ status: constants.STATUS.FALSE, data: error });
    }
}

exports.fetchAllAssessments = async (page,size,search,limit,offset,batch_id,assessment_id) => {
  try {
    let whereCondition = {
      [Op.and]: [],
    };
if(batch_id){
     whereCondition[Op.and].push({
        batch_id: batch_id,
      });
}

// if(batch_id && assessment_id){
// let data = await questions.findAll({assessment_id:data.assessment_id})
// console.log("data",data);
// if(data)
// }
    if (search && search.length >= constants.NUMBERS.THREE) {
      whereCondition[Op.and].push({
        [Op.or]: [
          { assessment_name: { [Op.iLike]: `%${search}%` } },
 
        ],
      });
    } else if (search && search.length < constants.NUMBERS.THREE) {
      return errorHandle({ status: constants.STATUS.FALSE }, res, message);
    }

    const allAssessments = await Assessment.findAndCountAll({
      where: whereCondition,
      include: [
  {
    model: Batch,
    as: constants.VARIABLES.ROLE, 
    attributes: [
      constants.VARIABLES.BATCH_ID,
      constants.VARIABLES.BATCH_NAME,
      constants.VARIABLES.CREATED_DATE,
    ],
  },
],
      limit: limit > 0 ? limit : undefined, 
      offset: offset >= 0 ? offset : undefined, 
      order: [[constants.VARIABLES.CREATED_DATE, constants.VARIABLES.DESC]],
    });
    console.log("allAssessments",allAssessments);
    return { status: constants.STATUS.TRUE, data: allAssessments };
  } catch (error) {
    return { status: constants.STATUS.FALSE, data: error };
  }
};