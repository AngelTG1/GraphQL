const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect('mongodb://localhost/blogdb')
    console.log("mongoose conectado");
}

module.exports = { connectDB }