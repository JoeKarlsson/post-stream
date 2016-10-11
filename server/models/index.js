'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
require('sequelize-hierarchy')(Sequelize);
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var db        = {};

if (process.env.HEROKU_POSTGRESQL_PURPLE_URL) {
    // the application is executed on Heroku ... use the postgres database
    console.log('process.env.HEROKU_POSTGRESQL_BRONZE_URL: ', typeof process.env.HEROKU_POSTGRESQL_PURPLE_URL);
    sequelize = new Sequelize(process.env.HEROKU_POSTGRESQL_PURPLE_URL, {
      dialect:  'postgres',
      protocol: 'postgres'
    })
  } else {
  var config    = require(__dirname + '/../config/config.json')[env];
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
