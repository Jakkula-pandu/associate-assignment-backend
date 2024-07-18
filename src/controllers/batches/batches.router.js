const express = require("express");
const router = express.Router();
const batchController = require('./batches.controller');
const commonController = require('../../common/common.controller')

router.post('/add-batch',commonController.roleIdValidation,batchController.validateRequestBody,batchController.addBatch);

module.exports = router;