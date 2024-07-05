const userDbLayer = require("../../dblayer/user.dblayer");
const constants = require("../../constants");
const {
  handleException,
  errorHandle,
  exception,
  serviceLayerResponse,
} = require("../../utils");

exports.fetchAllUsers = async (role_id, page, size, search) => {
  
  const limit = parseInt(size);
  const offset = (parseInt(page) - constants.NUMBERS.ONE) * limit;
  let users = await userDbLayer.fetchAllUsers(role_id, limit, offset, search);
  serviceLayerResponse(users);
  return users;

};
