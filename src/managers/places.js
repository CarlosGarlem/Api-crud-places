var data = require('../../data/localStorage');
var destinationModel = require('../models/destination');

const getAllPlaces = async (req, res, next) => {  
    destinationModel.find({}, {_id:0, __v:0}, (err, docs) => {
        res.status(200)
        res.json(docs)    
    });
}
  
const getOnePlace = async(req, res, next) => {
    const { params } = req
    place = destinationModel.find({ id: Number(params.id) }, { _id: 0, __v: 0 }, (err, doc) => {
        if (!err) {
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
        }
        else{
            res.status(400)
            res.send('Bad request id')
        }
    });
}

const nextIndex = (body, res) => {
    destinationModel.find({}, {_id: 0, id: 1}).sort({id:-1}).limit(1).exec((err, doc) => {
        if(doc.length > 0) {
            var nextId = doc[0].id + 1
            body.id = nextId
            insertItem(body, res)
        } else {
            var nextId = 1
            body.id = nextId
            insertItem(body, res)
        }
    })
}

const insertItem = (body, res) => {
    var newPlace = destinationModel({
        id: body.id,
        country: body.country,
        rating: Number(body.rating.toFixed(2)),
        place: body.place,
        description: body.description,
        activity: body.activity
    });

    newPlace.save((err) => {
        //if(!err) {
            res.status(201)
            res.send('Place created')
        //} else {
           // res.status(400)
            //res.send("Error")
        //}
    })
}

const createPlace = async(req, res, next) => {
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
            nextIndex(body, res) 
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

const updatePlace = async(req, res, next) => {
    try{
        const { params, body } = req
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
            var query = destinationModel.updateOne({ id: Number(params.id) }, 
                { country: body.country, rating: body.rating, place: body.place, description: body.description, activity: body.activity })
            query.then(function (result) {
                //{ n: 1, nModified: 1, ok: 1 }
                if(result.ok === 1 && result.n > 0){
                    res.status(204)
                    res.send('Updated')
                }
                else {
                    res.status(404)
                    res.send('Item not found')
                }
            });
        } else {
            res.status(400)
            res.send('Check body properties')
        }
    } catch(error) {
        res.status(400)
        res.send('Missing body on request')
    }
}

const deletePlace = async(req, res, next) => {
    const { params } = req
    var query = destinationModel.deleteOne({ id: Number(params.id) }) 
    query.then(function (result) {
        if(result.ok === 1 && result.deletedCount > 0){
            res.status(204)
            res.send('Item deleted')
        }
        else {
            res.status(404)
            res.send('Item not found')
        }
    });
}

module.exports = {
    getAllPlaces,
    getOnePlace,
    createPlace,
    updatePlace,
    deletePlace
}