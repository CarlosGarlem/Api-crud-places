const mongoose = require('mongoose');

const server = 'mongodb:27017'; // REPLACE WITH YOUR DB SERVER
const database = 'DB_Trips';      // REPLACE WITH YOUR DB NAME

class Database {
  constructor() {
    this._connect()
  }
  
_connect() {
     mongoose.connect('mongodb://'.concat(server,'/',database), {
       useNewUrlParser: true,
      useUnifiedTopology: true
    })
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }
}

module.exports = new Database()