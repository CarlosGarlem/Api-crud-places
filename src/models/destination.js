const mongoose = require('mongoose')

let destinationSchema= new mongoose.Schema({
    id: Number,
    country: String,
    rating: Number,
    place: String,
    description: String,
    activity: String
})

module.exports = mongoose.model('destinations', destinationSchema)