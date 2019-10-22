const mongoose = require('mongoose');
const server = 'localhost:27017'; 
const database = 'DB_Trips';     
  
before((done) => {
    mongoose.connect('mongodb://'.concat(server,'/',database), {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Database connection successful')
        done()
    })
    .catch(err => {
        console.error('Database connection error')
    })
});
