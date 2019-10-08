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
        var keys = Object.keys(body)
        var flag = true
        if(keys.length == 5){
            var properties = ['country', 'rating', 'place', 'description', 'activity']
            keys.forEach(element => {
                console.log(element)
                if(!properties.includes(element)){
                    flag = false
                }
            })
        } else {
            flag = false
        }

        console.log(flag)
        if(flag){
            var nextId = Math.max.apply(Math, data.map(function(item) { return item.id; }));
            body.id = nextId + 1
            body.rating = Number(body.rating.toFixed(2))
            data.push(body)
            res.status(201).json(data)
        }
        else{
            res.status(400).json("Check properties of object")
        }
    } catch(error){
        res.status(404).send('Error! Item not created')
    }
})

//UPDATE ROUTE
router.put('/:id', (req, res, next) => {
    try{
        const { params, body } = req
        var place = data.find(item => item.id.toString() === params.id)
        var keys = Object.keys(body)
        var properties = ['country', 'rating', 'place', 'description', 'activity']
        if(keys.length > 0) {
            var index = data.indexOf(place)
            keys.forEach(element => {
                if(properties.includes(element)){
                    data[index][element] = body[element]
                }
            });
            data[index].id = place.id
            res.status(204).end()
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
        const { params } = req
        console.log(params)
        var place = data.find(item => item.id.toString() === params.id)
        console.log(place)
        if(Object.keys(place).length > 0) {
            var index = data.indexOf(place)
            console.log(index)
            data.splice(index, 1)
            res.status(204).end()
        } else {
            res.status(404).send('Item not found!')
        }
    } catch(error) {
        res.status(404).send('Delete fail!')
    }
})

module.exports = router;
