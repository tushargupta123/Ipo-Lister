const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/user');
const ipoRoutes = require('./routes/ipo');
const allocationRoutes = require('./routes/allocation');

const isAuth = require('./middlewares/auth');

const {allocate} = require('./allocate')

const db = async () => {
    try {
        const mongodb = process.env.mongodb;
        await mongoose.connect(mongodb);
        console.log("Connected to MongoDB");
    } catch (e) {
        console.log("Error while connecting to db: ", e);
    }
}

app.use(express.json());

app.use('/api/user',userRoutes);
app.use('/api/ipo',isAuth,ipoRoutes);
app.use('/api/allocation',isAuth,allocationRoutes);

app.listen(8000, async () => {
    console.log("Server is running on port 8000");
    await db();
    await allocate.start();
})