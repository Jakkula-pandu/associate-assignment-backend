const constants = require('../constants');
const batches_tbl = require('../models').Batch

const { all } = require("../controllers/batches/batches.router");
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { handleException, errorHandle, exception } = require("../utils");

exports.insertBatch = async (data) => {
    try {
        let batches = await batches_tbl.create({
            batch_name: data.batch_name,
            username:data.username,
            created_by:data.role_id
        });
        return ({ status: constants.STATUS.TRUE, data: batches });
    } catch (error) {
        return ({ status: constants.STATUS.FALSE, data: error });

    }
}