const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const userRoutes = require('./routes/user');
const ipoRoutes = require('./routes/ipo');
const allocationRoutes = require('./routes/allocation');

const isAuth = require('./middlewares/auth');

const {allocate} = require('./allocate')

const db = process.env.mongodb;

async function main() {
    await mongoose.connect("mongodb+srv://tushargupta2k3:tUshar%40123@twitter.fzbvq5v.mongodb.net/ipo");
}
main().catch((err) => console.log(err));

app.use(express.json());
app.use(cors());

app.use('/api/user',userRoutes);
app.use('/api/ipo',isAuth,ipoRoutes);
app.use('/api/allocation',isAuth,allocationRoutes);

app.get('/',(req, res) => {
    return res.json({message : "Api is working"})
})

app.listen(8000, () => {
    console.log("Server is running on port 8000");
    allocate.start();
})