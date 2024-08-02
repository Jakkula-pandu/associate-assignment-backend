const constants = require('../constants');
const {Batch} = require('../models');
const { all } = require("../controllers/batches/batches.router");
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { handleException, errorHandle, exception } = require("../utils");
const {Training} = require('../models');
exports.insertBatch = async (data) => {
  console.log("data",data);
    try {
        let existingBatch = await Batch.findAll({ where: { batch_name: data.batch_name } });
        if(existingBatch.length > constants.NUMBERS.ZERO){
            return { status: constants.STATUS.TRUE, data: constants.STRINGS.BATCH_EXIST};
        }
        let batch = await Batch.create({
            batch_name: data.batch_name,
            users: data.users,
            created_by: data.created_by,
            user_ids:data.user_ids
         
        });
        return ({ status: constants.STATUS.TRUE, data: batch });
    } catch (error) {
        return ({ status: constants.STATUS.FALSE, data: error });

    }
}

exports.fetchAllBatches = async (  page, size, search,user_id,limit, offset) => {
  try {
    let whereCondition = {
      [Op.and]: [],
    };
  if (user_id) {
    whereCondition[Op.and].push({
      user_ids: {
        [Op.contains]: [parseInt(user_id)], 
      },
    });
  }
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
       limit: limit > 0 ? limit : undefined, // If limit is 0, fetch all
      offset: offset >= 0 ? offset : undefined, // If offset is negative, fetch all
      order: [[constants.VARIABLES.CREATED_DATE, constants.VARIABLES.DESC]],
    });
    return { status: constants.STATUS.TRUE, data: allBatches };
  } catch (error) {
    return { status: constants.STATUS.FALSE, data: error };
  }
};

