const constants = require('../constants');
const {Batch,User} = require('../models');
const { all } = require("../controllers/batches/batches.router");
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

exports.insertBatch = async (data) => {
    try {
        let existingBatch = await Batch.findAll({ where: { batch_name: data.batch_name } });
        if(existingBatch.length > constants.NUMBERS.ZERO){
            return { status: constants.STATUS.TRUE, data: constants.STRINGS.BATCH_EXIST};
        }
        let batch = await Batch.create({
            batch_name: data.batch_name,
            users: data.users,
            created_by: data.created_by,
        });
        return ({ status: constants.STATUS.TRUE, data: batch });
    } catch (error) {
        return ({ status: constants.STATUS.FALSE, data: error });

    }
}

exports.fetchAllBatches = async (page, size, search, user_id, limit, offset) => {
  try {
    let whereCondition = { [Op.and]: [] };
    if (search && search.length >= constants.NUMBERS.THREE) {
      whereCondition[Op.and].push({
        [Op.or]: [
          { batch_name: { [Op.iLike]: `%${search}%` } },
        ],
      });
    } else if (search && search.length < constants.NUMBERS.THREE) {
      return { status: constants.STATUS.FALSE, data: constants.STRINGS.INVALID_SEARCH_TERM };
    }
    const allBatches = await Batch.findAndCountAll({
      where: whereCondition,
      limit: limit > 0 ? limit : undefined,
      offset: offset >= 0 ? offset : undefined,
      order: [[constants.VARIABLES.CREATED_DATE, constants.VARIABLES.DESC]],
    });
    let filteredBatches = allBatches.rows;
  for (let batch of filteredBatches) {
      const userIds = batch.users || []; // Default to empty array if undefined
      const users = await User.findAll({
        where: {
          username: {
            [Op.in]: userIds
          }
        },
        attributes: ['user_id', 'username'] // Adjust attributes as needed
      });
      batch.users = users;
    }

    if (user_id) {
  const userIdInt = parseInt(user_id);
  filteredBatches = filteredBatches.filter(batch => {
    const hasUser = batch.users && Array.isArray(batch.users) && batch.users.some(user => {
      return user.user_id === userIdInt; // Use strict equality
    });
    return hasUser;
  });
}
    return { status: constants.STATUS.TRUE, data: { count: filteredBatches.length, rows: filteredBatches } };
  } catch (error) {
    console.log("Error fetching batches:", error);
    return { status: constants.STATUS.FALSE, data: error };
  }
};

