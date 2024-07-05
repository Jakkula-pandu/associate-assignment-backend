// roles.router.js

const express = require('express');
const router = express.Router();
const rolesController = require('../roles/roles.controller');

// Route to fetch all roles
router.get('/roles', rolesController.fetchAllRoles);

module.exports = router;
