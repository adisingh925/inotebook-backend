const mongoose = require('mongoose')
const mongoUri = "mongodb://0.0.0.0:27017"

const connectToMongo = async() =>{
    await mongoose.connect(mongoUri)
    console.log("connected to mongo")
}

module.exports = connectToMongo