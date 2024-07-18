const constants = require('../constants');
const batches_tbl = require('../models').Batch

const { all } = require("../controllers/batches/batches.router");
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { handleException, errorHandle, exception } = require("../utils");

exports.insertBatch = async (data) => {
    try {
        let batches = await batches_tbl.create({
            batch_name: data.batch_name,
            username:data.username,
            created_by:data.role_id
        });
        return ({ status: constants.STATUS.TRUE, data: batches });
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

    const allBatches = await batches_tbl.findAndCountAll({
      where: whereCondition,
    
      limit: limit,
      offset: offset,
      order: [[constants.VARIABLES.CREATED_DATE, constants.VARIABLES.DESC]],
    });

    return { status: constants.STATUS.TRUE, data: allBatches };
  } catch (error) {
    console.log("error",error);
    return { status: constants.STATUS.FALSE, data: error };
  }
};