var express = require('express');
//var data = require('../data/localStorage');
const {getAllPlaces, getOnePlace, createPlace, updatePlace, deletePlace} = require('../managers/places')
var router = express.Router();

//READ ROUTES
router.get('/', getAllPlaces);
router.get('/:id', getOnePlace)

//CREATE ROUTE
router.post('/', createPlace)

//UPDATE ROUTE
router.put('/:id', updatePlace)

//DELETE ROUTE
router.delete('/:id', deletePlace)

module.exports = router;
