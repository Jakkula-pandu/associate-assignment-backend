const userDbLayer = require("../../dblayer/user.dblayer");
const constants = require("../../constants");
const {
  handleException,
  errorHandle,
  exception,
  serviceLayerResponse,
} = require("../../utils");


exports.fetchAllUsers = async (role_id, limit, offset, search,user_id) => {
  let users = await userDbLayer.fetchAllUsers(role_id, limit, offset, search,user_id);
  console.log("users",users);
  serviceLayerResponse(users);
  return users;
 
};