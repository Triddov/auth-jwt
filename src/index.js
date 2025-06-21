import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config( {path: '.dev.env'} );
const PORT = process.env.PORT || 80;
const DB_CONNECT_URL = process.env.DB_URL || '';


const app = express();

const start = async () => {
    try {
        await mongoose.connect(DB_CONNECT_URL, {
            dbName: "auth2",
            serverSelectionTimeoutMS: 70000,
            socketTimeoutMS: 60000,  // максимально время ответа от базы при уже установленном соединении
        })
        app.listen(PORT, () => console.log(` === SERVER STARTED ON PORT ${PORT} === `));

    } catch (err) {
        console.log(err);
    }
}


start();

