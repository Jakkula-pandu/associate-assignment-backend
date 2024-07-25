const express = require("express");
const router = express.Router();
const assessmentController = require('./assessment.controller');
const commonController = require('../../common/common.controller');

router.post('/add-assessment',commonController.roleIdValidation,assessmentController.validateRequestBody,assessmentController.addAssessment);
router.get('/fetch-assessment',assessmentController.fetchAssessment);

module.exports = router;