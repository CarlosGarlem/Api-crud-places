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

destinationSchema.methods.lastIndex = function() {
    // add some stuff to the users name
    this.id = this.id + 1; 
    return this.id;
  };
  

module.exports = mongoose.model('destinations', destinationSchema)