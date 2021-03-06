const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const config = require('../config');


// Init db
const sequelize = new Sequelize(config.db.URI);

const db = {};

fs
  .readdirSync(__dirname)
  .filter(file => file.includes('.model.js'))
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
