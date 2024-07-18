const { serviceLayerResponse } = require('../../utils');
const batchDbLayer = require('../../dblayer/batches.dblayer');
const constants = require("../../constants");

exports.addBatch = async (payload) => {
    let addBatch = await batchDbLayer.insertBatch(payload)
    return serviceLayerResponse(addBatch)
}
exports.fetchBatches = async ( page, size, search) => {
  const limit = parseInt(size);
  const offset = (parseInt(page) - constants.NUMBERS.ONE) * limit;
  let users = await batchDbLayer.fetchAllBatches(limit, offset, search);
  serviceLayerResponse(users);
  return users;

};