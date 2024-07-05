const express = require("express");
const router = express.Router();
const userController = require('./users.controller');
/**
 * @author [Divya]
 * @email [Divya.Ragi@bilvantis.io]
 * @create date 2024-07-03 18:30:24
 * @modify date 2024-07-03 18:30:24
 * @desc [This route fetch the users from DB ]
 */
router.get('/fetch-users', userController.fetchUsers)
module.exports = router;