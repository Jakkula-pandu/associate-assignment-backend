const { serviceLayerResponse } = require('../../utils');
const batchDbLayer = require('../../dblayer/batches.dblayer');
const constants = require("../../constants");

exports.addBatch = async (payload) => {
    let addBatch = await batchDbLayer.insertBatch(payload)
    return serviceLayerResponse(addBatch)
}

exports.fetchBatches = async ( page, size, search,user_id,limit, offset) => {
  let users = await batchDbLayer.fetchAllBatches( page, size, search,user_id,limit, offset);
  serviceLayerResponse(users);
  return users;
};


