// const mongoose = require('mongoose');
const mongoose = require ('mongoose');
const colors = require ('colors');


const connectDB = async () => {
    try {
    await mongoose.connect(`mongodb+srv://ramjai0787:b7hvtvGN5Koou4gu@attendance.zkelynn.mongodb.net/mp360?retryWrites=true&w=majority&appName=attendance`) 

    console.log(colors.red.bold('Connected to MongoDB'.bgWhite));
     } catch(err){
    console.log('MongoDB connection error:', err, colors.red );
    };
}

module.exports = { connectDB }

