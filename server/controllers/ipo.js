const Ipo = require('../models/ipo');

const createIpo = async(req,res) => {
    try{
        const ipo = await Ipo.create(req.body);
        return res.status(200).json(ipo);
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
}
const updateIpo = async(req,res) => {
    try{
        const {id,...data} = req.body;
        let ipo = await Ipo.findById(id);
        if(ipo.startDate <= Date.now()){
            return res.status(500).json({message: 'Ipo cannot be updated after arrival'})
        }
        ipo = await Ipo.findByIdAndUpdate(id,data,{new:true});
        return res.status(200).json(ipo);
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
}
const getAllIpo = async(req,res) => {
    try{
        const condition = req.query.condition;
        let whereClause;
        let today = new Date();
        let pastDate = new Date();
        pastDate.setDate(today.getDate() - 5);

        if (condition == "listed") {
            whereClause = { "startDate": { $lt: pastDate } };
        } else if (condition == "open") {
            whereClause = { "startDate": { $lte: today, $gte: pastDate } };
        } else if (condition == "upcoming") {
            whereClause = { "startDate": { $gt: today } };
        } else {
            whereClause = {};
        }
        const ipo = await Ipo.find(whereClause);
        return res.status(200).json(ipo);
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
}
const deleteIpo = async(req,res) => {
    try{
        await Ipo.findByIdAndDelete(req.params.id);
        return res.status(200).json({message:"Ipo deleted successfully!"});
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
}
const getIpo = async(req,res) => {
    try{
        const ipo = await Ipo.findById(req.params.id);
        return res.status(200).json(ipo);
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
}

module.exports = {
    createIpo,
    updateIpo,
    deleteIpo,
    getAllIpo,
    getIpo
}