// role.service.js

const db = require('../../models/index'); // Correct path to your database/index.js

// Example usage to fetch all roles
db.Role.findAll().then(roles => {
  console.log(roles);
}).catch(err => {
  console.error('Error fetching roles:', err);
});

