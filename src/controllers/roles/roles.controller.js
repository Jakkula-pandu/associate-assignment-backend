// roles.controller.js

const roleService = require('../roles/roles.service');
const constants = require('../../constants'); // Assuming constants file defines STATUS_CODES and STATUS

// Controller function to fetch all roles
exports.fetchAllRoles = async (req, res) => {
  try {
    const allRoles = await roleService.fetchAllRoles();

    if (allRoles.length > 0) {
      res.status(constants.STATUS_CODES.OK)
        .json({
          status: constants.STATUS.TRUE,
          code: constants.STATUS_CODES.OK,
          allRoles: allRoles
        });
    } else {
      const message = 'No roles found';
      res.status(constants.STATUS_CODES.NOT_FOUND)
        .json({
          status: constants.STATUS.FALSE,
          code: constants.STATUS_CODES.NOT_FOUND,
          message: message
        });
    }
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({
        status: constants.STATUS.FALSE,
        code: constants.STATUS_CODES.INTERNAL_SERVER_ERROR,
        error: error.message
      });
  }
};
