const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema({
    ipo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ipo',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shares: {
        type: Number,
        required: true
    }
});

const Allocation = new mongoose.model('Allocation', allocationSchema);
module.exports = Allocation;