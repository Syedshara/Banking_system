import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path'
import auth from './routes/auth.js'
import lend from './routes/lending.js'

dotenv.config();
const __dirname = path.resolve()
const app = express();
app.use(express.json());


mongoose.connect(process.env.URL_DB)
    .then(() => {
        app.listen(3000, () => {
            console.log("server is running on port 3000! ")
        })
    })
    .catch((err) => {
        console.log(err)
    })
app.use('/auth', auth)
app.use('/lend',lend)



