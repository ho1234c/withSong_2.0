import express from 'express';
import configExpress from './config/express';
import routeIndex from './routes/index';
import routeList from './routes/list';
import db from './models';
import dummy from './dummy';

db.sequelize.sync()
    .then(() => {
        // dummy(30, console.log);
        console.log('Connect database');
    })
    .catch(() => {
        console.log('Fail to database connection');
    });

const app = express();
const route = configExpress(app);

routeIndex(route);
routeList(route);

export default app;