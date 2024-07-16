const { serviceLayerResponse } = require('../../utils');
const batchDbLayer = require('../../dblayer/batches.dblayer');
const constants = require("../../constants");

exports.addBatch = async (payload) => {
    let addBatch = await batchDbLayer.insertBatch(payload)
    return serviceLayerResponse(addBatch)
}