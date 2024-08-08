const { User, Role } = require("../models");
const constants = require("../constants");
const { Op } = require("sequelize");
const { handleException, errorHandle, exception } = require("../utils");
const { all } = require("../controllers/users/users.router");


exports.fetchAllUsers = async (role_id, limit, offset, search, user_id) => {
  console.log("user_id", user_id);
  try {
    let whereCondition = {
      [Op.and]: [],
    };

    if (user_id) {
      whereCondition[Op.and].push({
        user_id: user_id,
      });
    }

    if (role_id) {
      whereCondition[Op.and].push({ role_id: role_id });
    } else {
      whereCondition[Op.and].push({
        role_id: { [Op.ne]: constants.NUMBERS.TWO },
      });
    }

    if (search && search.length >= constants.NUMBERS.ZERO) {
      whereCondition[Op.and].push({
        [Op.or]: [
          { username: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { empid: { [Op.iLike]: `%${search}%` } },
        ],
      });
    } 
    // else if (search && search.length < constants.NUMBERS.THREE) {
    //       return { status: constants.STATUS.FALSE, message: constants.STRINGS.SEARCH_TERM_LENGTH };
    // }

    console.log("whereCondition", whereCondition);
    const allUsers = await User.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: Role,
          as: constants.VARIABLES.ROLE,
          attributes: [
            constants.VARIABLES.ROLE_ID,
            constants.VARIABLES.ROLE_NAME,
            constants.VARIABLES.CREATED_DATE,
          ],
        },
      ],
      limit: limit > 0 ? limit : undefined, 
      offset: offset >= 0 ? offset : undefined, 
      order: [[constants.VARIABLES.CREATED_DATE, constants.VARIABLES.DESC]],
    });
    return { status: constants.STATUS.TRUE, data: allUsers };
  } catch (error) {
    return { status: constants.STATUS.FALSE, data: error };
  }
};


