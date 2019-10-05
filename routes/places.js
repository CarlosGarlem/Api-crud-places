var express = require('express');
var data = require('../data/localStorage');
var router = express.Router();

//READ ROUTES
router.get('/', (req, res, next) => {  
    try{
        res.status(200).json(data)
    } catch(error) {
        res.status(404).send('No items found in data!')
    }
});

router.get('/:id', (req, res, next) => {
    try{
        const { params } = req
        var place = data.find(item => item.id.toString() === params.id)
        if(Object.keys(place).length > 0) {
            res.status(200).json(place)
        } else {
            res.status(404).send('Item not found!')
        }
    } catch(error) {
        res.status(404).send('Item not found!')
    }
})

//CREATE ROUTE
router.post('/', (req, res, next) => {
    try{
        const {body} = req
        var nextId = Math.max.apply(Math, data.map(function(item) { return item.id; }));
        body.id = nextId + 1
        body.rating = Number(body.rating.toFixed(2))
        data.push(body)
        res.status(201).json(data)
    } catch(error){
        res.status(404).send('Error! Item not created')
    }
})

//UPDATE ROUTE
router.put('/:id', (req, res, next) => {
    try{
        const { params, body } = req
        var place = data.find(item => item.id.toString() === params.id)
        console.log(place)
        if(Object.keys(place).length > 0) {
            var index = data.indexOf(place)
            data[index] = body
            res.status(204)
        } else {
            res.status(404).send('Item not found!')
        }
    } catch(error) {
        res.status(404).send('Update fail!')
    }
})

//DELETE ROUTE
router.delete('/:id', (req, res, next) => {
    try {
        console.log(params)
        var place = data.find(item => item.id.toString() === params.id)
        if(Object.keys(place).length > 0) {
            var index = data.indexOf(place)
            data.splice(index, 1)
            res.status(204)
        } else {
            res.status(404).send('Item not found!')
        }
    } catch(error) {
        res.status(404).send('Delete fail!')
    }
})

module.exports = router;
