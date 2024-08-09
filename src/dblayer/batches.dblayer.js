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
    console.log("limit,offset",limit,offset);
    
    let whereCondition = { [Op.and]: [] };
    if (search && search.length >= constants.NUMBERS.ZERO) {
      whereCondition[Op.and].push({
        [Op.or]: [
          { batch_name: { [Op.iLike]: `%${search}%` } },
        ],
      });
    } 
    const totalBatches = await Batch.count({ where: whereCondition });
    // else if (search && search.length < constants.NUMBERS.THREE) {
    //    return { status: constants.STATUS.FALSE, message: constants.STRINGS.SEARCH_TERM_LENGTH };
    // }
    const allBatches = await Batch.findAndCountAll({
      where: whereCondition,
      limit: limit > 0 ? limit : undefined,
      offset: offset >= 0 ? offset : undefined,
      order: [[constants.VARIABLES.CREATED_DATE, constants.VARIABLES.DESC]],
    });
    console.log("allBatches",allBatches.rows.length);
    
    let filteredBatches = allBatches.rows;
    console.log("ffffffffff",filteredBatches.length);
    
  for (let batch of filteredBatches) {
      const userIds = batch.users || []; 
      const users = await User.findAll({
        where: {
          username: {
            [Op.in]: userIds
          }
        },
        attributes: ['user_id', 'username'] 
      });
      batch.users = users;
    }

    if (user_id) {
  const userIdInt = parseInt(user_id);
  filteredBatches = filteredBatches.filter(batch => {
    const hasUser = batch.users && Array.isArray(batch.users) && batch.users.some(user => {
      return user.user_id === userIdInt; 
    });
    return hasUser;
  });
}
console.log("filteredBatches.length",filteredBatches.length);

    return { status: constants.STATUS.TRUE, data: { count: totalBatches, rows: filteredBatches } };
  } catch (error) {
    console.log("Error fetching batches:", error);
    return { status: constants.STATUS.FALSE, data: error };
  }
};

