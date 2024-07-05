const roles_tbl = require("../models").users_tbl;

exports.getAllUsers = async (result) => {
  try {
    let roles = await roles_tbl.findAll({
      where: { role_id: result },
      raw: true,
    });
    return { status: true, data: roles };
  } catch (error) {
    return { status: false, data: { error } };
  }
};
