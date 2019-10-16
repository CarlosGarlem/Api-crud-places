var data = require('../../data/localStorage');

const getAllPlaces = (req, res, next) => {  
    try{
        res.status(200)
        res.json(data)
    } catch(error) {
        res.status(404)
        //res.send('No items found in data!')
    }
}
  
const getOnePlace = (req, res, next) => {
    try{
        const { params } = req
        var place = data.find(item => item.id.toString() === params.id)
        if(Object.keys(place).length > 0) {
            res.status(200)
            res.json(place)
        } else {
            res.status(404)
            //res.send('Item not found!')
        }
    } catch(error) {
        res.status(404)
        //res.send('Item not found!')
    }
}

const createPlace = (req, res, next) => {
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
            res.status(201)
            res.json(data)
        }
        else{
            res.status(400)
            res.json("Check properties of object")
        }
    } catch(error){
        res.status(404)
        //res.send('Error! Item not created')
    }
}

const updatePlace = (req, res, next) => {
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
            res.status(204)
            res.end()
        } else {
            res.status(404)
            //res.send('Item not found!')
        }
    } catch(error) {
        res.status(404)
        //res.send('Update fail!')
    }
}

const deletePlace = (req, res, next) => {
    try {
        const { params } = req
        console.log(params)
        var place = data.find(item => item.id.toString() === params.id)
        console.log(place)
        if(Object.keys(place).length > 0) {
            var index = data.indexOf(place)
            console.log(index)
            data.splice(index, 1)
            res.status(204)
            res.end()
        } else {
            res.status(404)
            //res.send('Item not found!')
        }
    } catch(error) {
        res.status(404)
        //res.send('Delete fail!')
    }
}

module.exports = {
    getAllPlaces,
    getOnePlace,
    createPlace,
    updatePlace,
    deletePlace
}