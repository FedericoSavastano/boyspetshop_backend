import express from 'express';
import colors from 'colors';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import router from './router';
import db from './config/db';
import swaggerSpec, { swaggerUiOptions } from './config/swagger';

//Connect to DataBase
async function connectDB() {
    try {
        await db.authenticate();
        db.sync();
    } catch (error) {
        console.log(colors.red.bold('Error in connecting to DataBase'));
        console.log(error);
    }
}

connectDB();

//Instance of express
const server = express();

//MIDDLEWARES

//Allow frontend connection
//Set CORS options configurations
//include it in CORS middleware
//DESCOMENTAR DESPUES, PORQUE ACA NO VA A ANDAR CON EL POSTMAN
const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if (
            origin === process.env.FRONTEND_URL ||
            origin === process.env.DOCS_URL
        ) {
            callback(null, true);
        } else {
            callback(new Error('CORS error'));
        }
    },
};

server.use(cors(corsOptions));

//Helps reading form information
server.use(express.json());

//Logger for HTTP requests. The "dev" is the setting for the style of info shown in console
server.use(morgan('dev'));

//Route with products
server.use('/api/products', router);

//Generates documentation of endpoints in swagger platform
server.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

export default server;
