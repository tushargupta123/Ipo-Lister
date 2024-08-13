const Allocation = require('../models/allocation');
const stripe = require("stripe")(process.env.stripe_key);
const Ipo = require('../models/ipo');

const createAllocation = async(req,res) => {
    try{
        const {ipoId,shares} = req.body;
        const ipo = await Ipo.findById(ipoId);
        const amount = ipo.price * shares;
        const userId = req.user.userId;
        const email = req.user.email;
        const customer = await stripe.customers.create({
            email: email,
            source: userId
        });
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency:"inr",
            customer:customer.id,
            payment_method_type:["card"],
            receipt_email:email,
            description:"Token has been assigned to allocation"
        });
        const transactionId = paymentIntent.id;
        const allocation = await Allocation.create({
            ipo:ipoId,
            user:userId,
            shares
        });
        return res.status(200).json({allocation,transactionId});
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
}
const listOfIposOfUser = async(req,res) => {
    try{
        const ipos = await Allocation.find({user:req.user.userId}).populate({path:'ipo',select:['name','price']});
        return res.status(200).json(ipos);
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
}

module.exports = {
    createAllocation,
    listOfIposOfUser
}