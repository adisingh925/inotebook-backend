const mongoose = require('mongoose')
const mongoUri = "mongodb+srv://adisingh925:4kWIDKec6jGaZeyX@cluster0.z54lmqn.mongodb.net/"

const connectToMongo = async() =>{
    await mongoose.connect(mongoUri)
    console.log("connected to mongo")
}

module.exports = connectToMongo