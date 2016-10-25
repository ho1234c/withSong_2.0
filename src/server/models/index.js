import Sequelize from 'sequelize';
import path from 'path';
import fs from 'fs';
import config from '../config/index'

const sequelize = new Sequelize(config.localhost.uri, {logging: false});

let db = [];

fs.readdirSync(__dirname)
    .filter(file => {
        return file.indexOf('.js') && file !== 'index.js'
    })
    .forEach(file => {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db
