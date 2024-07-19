const constants = require('../constants');
const {Batch} = require('../models');
const { all } = require("../controllers/batches/batches.router");
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { handleException, errorHandle, exception } = require("../utils");

exports.insertBatch = async (data) => {
    try {
        let existingBatch = await Batch.findAll({ where: { batch_name: data.batch_name } });
        if(existingBatch.length > constants.NUMBERS.ZERO){
            return { status: constants.STATUS.FALSE, data: constants.STRINGS.BATCH_EXIST};
        }
        let batch = await Batch.create({
            batch_name: data.batch_name,
            user_name: data.username,
            created_by: data.role_id
        });
        return ({ status: constants.STATUS.TRUE, data: batch });
    } catch (error) {
        return ({ status: constants.STATUS.FALSE, data: error });

    }
}

exports.fetchAllBatches = async ( limit, offset, search) => {
  try {
    let whereCondition = {
      [Op.and]: [],
    };

    if (search && search.length >= constants.NUMBERS.THREE) {
      whereCondition[Op.and].push({
        [Op.or]: [
          { batch_name: { [Op.iLike]: `%${search}%` } },
 
        ],
      });
    } else if (search && search.length < constants.NUMBERS.THREE) {
      return errorHandle({ status: constants.STATUS.FALSE }, res, message);
    }

    const allBatches = await Batch.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
      order: [[constants.VARIABLES.CREATED_DATE, constants.VARIABLES.DESC]],
    });
    return { status: constants.STATUS.TRUE, data: allBatches };
  } catch (error) {
    return { status: constants.STATUS.FALSE, data: error };
  }
};