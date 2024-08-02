const constants = require('../constants');
const {Assessment,Batch} = require('../models');
const { all } = require('../controllers/batches/batches.router');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { handleException, errorHandle, exception } = require('../utils');

exports.insertAssessment = async (data) => {
    try {
        let existingAssessment = await Assessment.findAll({ where: { assessment_name: data.assessment_name, batch_id: data.batch_id } });
        if(existingAssessment.length > constants.NUMBERS.ZERO){
            return { status: constants.STATUS.FALSE, data: constants.STRINGS.ASSESSMENT_EXIST};
        }
        let assessment = await Assessment.create({
            assessment_name: data.assessment_name,
            batch_id: data.batch_id,
            created_by: data.role_id
        });
        return ({ status: constants.STATUS.TRUE, data: assessment });
    } catch (error) {
        return ({ status: constants.STATUS.FALSE, data: error });

    }
}

exports.fetchAllAssessments = async (page, size, search,limit,offset) => {
  try {
    let whereCondition = {
      [Op.and]: [],
    };

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
    return { status: constants.STATUS.TRUE, data: allAssessments };
  } catch (error) {
    console.log("eeeeeee",error);
    return { status: constants.STATUS.FALSE, data: error };
  }
};