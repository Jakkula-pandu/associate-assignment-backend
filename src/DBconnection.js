const Sequelize  = require('sequelize');
require('dotenv').config();

sequelizeconnection = new Sequelize(process.env.DB_NAME,process.env.DB_USERNAME,process.env.DB_PASSWORD,{
  host:process.env.DB_HOSTNAME,
  dialect:"postgres",
  //operatorsAliases:false,

  pool:{
    max:10,
    min:0,
    acquire:30000,
    idle:10000
  }
})


module.exports = sequelizeconnection;
