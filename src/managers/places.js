var data = require('../../data/localStorage');
var destinationModel = require('../models/destination');


const nextIndex = () =>{
    destinationModel.findOne({}.sort(id,1), (err,doc) =>{
        if(err) throw err;
        console.log("pase")
        var max = doc.id + 1;
        return max
    })
}

const getAllPlaces = (req, res, next) => {  
    destinationModel.find({}, {_id:0, __v:0}, (err, docs) => {
        if (err) throw err;
        res.status(200)
        res.json(docs)
    });
}
  
const getOnePlace = (req, res, next) => {
    const { params } = req
    place = destinationModel.find({ id: Number(params.id) }, { _id: 0, __v: 0 }, (err, doc) => {
        if (err) throw err;
        var place = doc

        if(place.length > 0) {
            res.status(200)
            res.json(place)
        }
        else
        {
            res.status(404)
            res.send('Item not found')
        }
    });
}

const createPlace = (req, res, next) => {
    try{
        const {body} = req
        var keys = Object.keys(body)
        var flag = true
        if(keys.length == 5){
            var properties = ['country', 'rating', 'place', 'description', 'activity']
            keys.forEach(element => {
                if(!properties.includes(element)){
                    flag = false
                }
            })
        } else {
            flag = false
        }

        if(flag){
            var nextId = nextIndex()
            var newPlace = destinationModel({
                id: nextId,
                country: body.country,
                rating: Number(body.rating.toFixed(2)),
                place: body.place,
                description: body.description,
                activity: body.activity
            });

            newPlace.save((err) => {
                if (err) throw err;
                console.log('Place created!');
                res.status(201)
                res.json(data)
            })
        }
        else
        {
            res.status(400)
            res.send('Check properties of object sent')
        }
    } catch(error){
        res.status(400)
        res.send('Missing params, item not created')
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
        } else {
            res.status(400)
            res.send('Check body properties')
        }
    } catch(error) {
        res.status(400)
        res.send('Missing body on request')
    }
}

const deletePlace = (req, res, next) => {
        const { params } = req
        var place = data.find(item => item.id.toString() === params.id)
        if(typeof(place) === 'object') {
            var index = data.indexOf(place)
            data.splice(index, 1)
            res.status(204)
        } else {
            res.status(404)
            res.send('Item not found')
        }
}

module.exports = {
    getAllPlaces,
    getOnePlace,
    createPlace,
    updatePlace,
    deletePlace
}