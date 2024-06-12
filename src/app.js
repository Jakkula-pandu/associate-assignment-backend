const client=require('./DBconnection')
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors=require('cors')
const jwt = require('jsonwebtoken'); 
var log4js = require("log4js");
var sessionStorage = require('sessionstorage');

var logger = log4js.getLogger();


 app.use(cors());
sessionStorage.setItem("srcFolderPath",__dirname);
 app.use(bodyParser.json());
 app.use(bodyParser.json({ limit: '300mb' }));
 app.use(bodyParser.urlencoded({ limit: '300mb', extended: true, parameterLimit: 90000 }));

    client.connect((err) => {
    if (err) {
      logger.error('Error connecting to PostgreSQL:', err.message);
      console.error('Error connecting to PostgreSQL:', err.message);
    } else {
      console.log('PostgreSQL connected');
    }
})
module.exports = app;