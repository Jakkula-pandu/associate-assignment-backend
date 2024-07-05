

const express = require('express');
const router = express.Router();
const rolesController = require('../roles/roles.controller');


router.get('/roles', rolesController.fetchAllRoles);

module.exports = router;
