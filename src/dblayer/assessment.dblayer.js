const constants = require('../constants');
const {Assessment} = require('../models');
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

exports.fetchAllAssessments = async ( limit, offset, search) => {
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
      limit: limit,
      offset: offset,
      order: [[constants.VARIABLES.CREATED_DATE, constants.VARIABLES.DESC]],
    });
    return { status: constants.STATUS.TRUE, data: allAssessments };
  } catch (error) {
    return { status: constants.STATUS.FALSE, data: error };
  }
};