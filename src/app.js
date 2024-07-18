// const client=require('./dbConnection')
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors=require('cors')
const jwt = require('jsonwebtoken'); 
var log4js = require("log4js");
var sessionStorage = require('sessionstorage');
const cacheProvider = require('./cache/cache');
const user = require("./controllers/users/users.router");
const batch =  require("./controllers/batches/batches.router");
const { sequelize } = require('./models'); 
var logger = log4js.getLogger();
 app.use(cors());
sessionStorage.setItem("srcFolderPath",__dirname);
 app.use(bodyParser.json());
 app.use(bodyParser.json({ limit: '300mb' }));
 app.use(bodyParser.urlencoded({ limit: '300mb', extended: true, parameterLimit: 90000 }));
 const models = require('./models');
models.sequelize.sync();
cacheProvider.start((err) => {
    if (err) console.log("error while starting cache provider " + err);
});
sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Database & tables created!');
  });
app.use("/v0.1/users",user);
app.use("/v0.1/batches",batch);
module.exports = app;