const cron = require('node-cron');
const Ipo = require('./models/ipo');
const Allocation = require('./models/allocation');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service:"Gmail",
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
    },
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const getAllocationDetails = async(allocation) => {
    const allocationData = await Allocation.findById(allocation.id)
    .populate({
        path: 'user',
        select: 'email'
    })
    .populate({
        path: 'ipo',
        select: 'name'
    });
    const to=allocationData.user.email;
    const company=allocationData.ipo.name;
    return {to,company};
}

const sendAllocationMail = async (allocation,shares) => {
    const {to,company} = await getAllocationDetails(allocation);
    await transporter.sendMail({
        from: "tushargupta2k3@gmail.com",
        to: to,
        subject: "Congratulations! You have allocated the Ipo.",
        html: `<b>You have been alloted ${shares} of ${company}</b>`
    });
} 

const sendNonAllocationMail = async (allocation,shares) => {
    const {to,company} = await getAllocationDetails(allocation);
    await transporter.sendMail({
        from: "tushargupta2k3@gmail.com",
        to: to,
        subject: "Sorry! You have not allocated the Ipo.",
        html: `<b>You have not alloted ${shares} of ${company}</b>
                You will be receiving your refund as soon as possible.`
    });
} 

const randomAllocation = async () => {
    let today = new Date();
    let allocationDate = new Date();
    allocationDate.setDate(today.getDate() - 6);
    allocationDate.setHours(0, 0, 0, 0);
    const ipos = await Ipo.find({
        startDate: {
            $gte: allocationDate,
            $lt: new Date(allocationDate.getTime() + 24 * 60 * 60 * 1000)
        }
    });
    for(let ipo of ipos){
        let allocations = await Allocation.find({ ipo: ipo.id });
        allocations = shuffleArray(allocations);
        let availableShares = ipo.shares;
        allocations.forEach(async (allocation) => {
            if(availableShares==0){
                await Allocation.findByIdAndDelete(allocation.id);
                await sendNonAllocationMail(allocation,allocation.shares);
            }else if(availableShares-allocation.shares >= 0){
                availableShares -= allocation.shares;
                await sendAllocationMail(allocation,allocation.shares);
            }else{
                const sharesAllocated = availableShares;
                availableShares=0;
                await Allocation.findByIdAndUpdate(allocation.id,{shares:sharesAllocated});
                await sendAllocationMail(allocation,sharesAllocated);
                await sendNonAllocationMail(allocation,allocation.shares-sharesAllocated);
            }
        });
    
    }
}

const allocate = cron.schedule('0 0 * * *', async () =>  {
    try{
        await randomAllocation();
    }catch(err){
        console.log(err);
    }
  }, {
    scheduled: false
});

module.exports = {
    allocate,
    randomAllocation
};
