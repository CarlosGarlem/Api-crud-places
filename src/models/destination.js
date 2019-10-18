const mongoose = require('mongoose')
//const validator = require('validator')

let destinationSchema= new mongoose.Schema({
    id: Number,
    country: String,
    rating: Number,
    place: String,
    description: String,
    activity: String
})

module.exports = mongoose.model('destinations', destinationSchema)