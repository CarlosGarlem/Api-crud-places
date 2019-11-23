const mongoose = require('mongoose');
const config = require('config');

const mongoConfig = config.get('Mongo.dbConfig');
const server = mongoConfig.host + ':' + mongoConfig.port 
const database = mongoConfig.db

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