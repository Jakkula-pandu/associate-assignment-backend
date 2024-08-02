const constants = require('../constants');
const {Batch,User} = require('../models');
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
            // user_ids:data.user_ids
         
        });
        return ({ status: constants.STATUS.TRUE, data: batch });
    } catch (error) {
        return ({ status: constants.STATUS.FALSE, data: error });

    }
}

// exports.fetchAllBatches = async (  page, size, search,user_id,limit, offset) => {
//   try {
//     let whereCondition = {
//       [Op.and]: [],
//     };
    
//   if (user_id) {
//     whereCondition[Op.and].push({
//       users: {
//         [Op.contains]: [parseInt(user_id)], 
//       },
//     });
//   }
//     if (search && search.length >= constants.NUMBERS.THREE) {
//       whereCondition[Op.and].push({
//         [Op.or]: [
//           { batch_name: { [Op.iLike]: `%${search}%` } },
 
//         ],
//       });
//     } else if (search && search.length < constants.NUMBERS.THREE) {
//       return errorHandle({ status: constants.STATUS.FALSE }, res, message);
//     }

//     const allBatches = await Batch.findAndCountAll({
//       where: whereCondition,
//        limit: limit > 0 ? limit : undefined, // If limit is 0, fetch all
//       offset: offset >= 0 ? offset : undefined, // If offset is negative, fetch all
//       order: [[constants.VARIABLES.CREATED_DATE, constants.VARIABLES.DESC]],
//     });
//       // Fetch users associated with each batch
//     for (let batch of allBatches.rows) {
//       console.log("batch",batch);
//       const userIds = batch.users; // Assuming user_ids is an array
//       const users = await User.findAll({
//         where: {
//           username: {
//             [Op.in]: userIds
//           }
//         },
//         attributes: ['user_id', 'username'] // Adjust attributes as needed
//       });
//       batch.users = users;
//     }

//     return { status: constants.STATUS.TRUE, data: allBatches };
//   } catch (error) {
//     console.log("eeeeeeee",error);
//     return { status: constants.STATUS.FALSE, data: error };
//   }
// };

// exports.fetchAllBatches = async (page, size, search, user_id, limit, offset) => {
//   try {
//     let whereCondition = { [Op.and]: [] };

//     // Handle search condition separately
//     if (search && search.length >= constants.NUMBERS.THREE) {
//       whereCondition[Op.and].push({
//         [Op.or]: [
//           { batch_name: { [Op.iLike]: `%${search}%` } },
//         ],
//       });
//     } else if (search && search.length < constants.NUMBERS.THREE) {
//       return { status: constants.STATUS.FALSE, data: constants.STRINGS.INVALID_SEARCH_TERM };
//     }

//     // Initial query to fetch all batches
//     const allBatches = await Batch.findAndCountAll({
//       where: whereCondition,
//       limit: limit > 0 ? limit : undefined,
//       offset: offset >= 0 ? offset : undefined,
//       order: [[constants.VARIABLES.CREATED_DATE, constants.VARIABLES.DESC]],
//     });

//     let filteredBatches = allBatches.rows;

//     // Filter batches by user_id
//     if (user_id) {
//       const userIdInt = parseInt(user_id);
//       filteredBatches = filteredBatches.filter(batch => 
//         batch.users && batch.users.some(user => user.user_id === userIdInt) // Check if users exist before filtering
//       );
//     }

//     // Fetch users associated with each batch
//     for (let batch of filteredBatches) {
//       const userIds = batch.user_ids; // Assuming user_ids is an array
//       const users = await User.findAll({
//         where: {
//           user_id: {
//             [Op.in]: userIds
//           }
//         },
//         attributes: ['user_id', 'username'] // Adjust attributes as needed
//       });
//       batch.users = users;
//     }

//     console.log("filteredBatches", filteredBatches);
//     return { status: constants.STATUS.TRUE, data: { count: filteredBatches.length, rows: filteredBatches } };
//   } catch (error) {
//     console.log("Error fetching batches:", error);
//     return { status: constants.STATUS.FALSE, data: error };
//   }
// };


exports.fetchAllBatches = async (page, size, search, user_id, limit, offset) => {
  try {
    let whereCondition = { [Op.and]: [] };

    // Handle search condition separately
    if (search && search.length >= constants.NUMBERS.THREE) {
      whereCondition[Op.and].push({
        [Op.or]: [
          { batch_name: { [Op.iLike]: `%${search}%` } },
        ],
      });
    } else if (search && search.length < constants.NUMBERS.THREE) {
      return { status: constants.STATUS.FALSE, data: constants.STRINGS.INVALID_SEARCH_TERM };
    }

    // Initial query to fetch all batches
    const allBatches = await Batch.findAndCountAll({
      where: whereCondition,
      limit: limit > 0 ? limit : undefined,
      offset: offset >= 0 ? offset : undefined,
      order: [[constants.VARIABLES.CREATED_DATE, constants.VARIABLES.DESC]],
    });
console.log("allbatch",allBatches);
    let filteredBatches = allBatches.rows;

  for (let batch of filteredBatches) {
      console.log("batch",batch);
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
  console.log("filter", filteredBatches);
  filteredBatches = filteredBatches.filter(batch => {
    console.log("batch", batch);
    const hasUser = batch.users && Array.isArray(batch.users) && batch.users.some(user => {
      console.log("user",user);
      console.log("Comparing user_id:", user.user_id, "with userIdInt:", userIdInt);
      return user.user_id === userIdInt; // Use strict equality
    });
    return hasUser;
  });
  console.log("Filtered Batches:", filteredBatches);
}

    // for (let batch of filteredBatches) {
    //   console.log("batch",batch);
    //   const userIds = batch.users || []; // Default to empty array if undefined
    //   const users = await User.findAll({
    //     where: {
    //       username: {
    //         [Op.in]: userIds
    //       }
    //     },
    //     attributes: ['user_id', 'username'] // Adjust attributes as needed
    //   });
    //   batch.users = users;
    // }

    console.log("filteredBatches", filteredBatches);
    return { status: constants.STATUS.TRUE, data: { count: filteredBatches.length, rows: filteredBatches } };
  } catch (error) {
    console.log("Error fetching batches:", error);
    return { status: constants.STATUS.FALSE, data: error };
  }
};

