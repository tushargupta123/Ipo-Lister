const mongoose = require('mongoose');

const ipoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    shares: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
    },
    startDate: {
        type: Date,
        required: true
    },
});

const Ipo = mongoose.model('Ipo', ipoSchema);
module.exports = Ipo;