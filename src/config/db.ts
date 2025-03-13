import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

//Allows importing environment variables
dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const db = new Sequelize(process.env.DATABASE_URL, {
    models: [__dirname + '/../models/**/*'],
    logging: false, // Disables logging
});

export default db;
