const express = require("express");
const router = express.Router();
const questionController = require('./questions.controller');
const commonController = require('../../common/common.controller');

router.post('/add-questions',commonController.roleIdValidation,questionController.validateRequestBody,questionController.addQuestions);
router.get('/fetch-questions',questionController.fetchQuestions);
router.post('/submit-test',questionController.validateRequest,questionController.submitTest);
router.get('/fetchUserAssessmentAnswers',questionController.fetchUserAnswers);
module.exports = router;