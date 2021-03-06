var data = require('../../data/localStorage');
var destinationModel = require('../models/destination');
const config = require('config');
var redis = require('redis');

const redisConfig = config.get('Redis.dbConfig');
var client = redis.createClient({host : redisConfig.host, port : redisConfig.port})
var redisOn = false
client.on('ready',function() {
    console.log("Redis is ready");
    redisOn = true
});
client.on('error', function (err) {
    console.log('Something went wrong ' + err);
    redisOn = false
})

const getAllPlaces = async (req, res, next) => { 
    const key = 'get_place_all'

    if(redisOn) 
    {
        client.exists(key, function(err, reply) { 
            if (reply === 0) {
                destinationModel.find({}, {_id:0, __v:0}, (err, docs) => {
                    console.log("set")
                    const obj = JSON.stringify(docs)
                    client.set(key, obj);
                    client.expire(key, 60);
                    res.status(200)
                    res.json(docs)    
                });
            } else {
                console.log("get")
                client.get(key, function(err, place) {
                    res.status(200)
                    res.json(JSON.parse(place))
                });
            }
        });
    } else {
        destinationModel.find({}, {_id:0, __v:0}, (err, docs) => {
            res.status(200)
            res.json(docs)    
        });
    }
    
}
  
const getOnePlace = async(req, res, next) => {
    const { params } = req

    if(redisOn){
        const key = 'get_place_' + params.id
        client.exists(key, function(err, reply) {
            if (reply === 0) {
                place = destinationModel.find({ id: Number(params.id) }, { _id: 0, __v: 0 }, (err, doc) => {
                    if (!err) {
                        const place = doc
                        if(place.length > 0) {
                            console.log("set1")
                            client.set(key, JSON.stringify(place))
                            client.expire(key, 60);
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
            } else {
                console.log("get1")
                client.get(key, function(err, place) {
                    res.status(200)
                    res.json(JSON.parse(place))
                });
            }
        });
    } else {
        place = destinationModel.find({ id: Number(params.id) }, { _id: 0, __v: 0 }, (err, doc) => {
            if (!err) {
                const place = doc
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
}

const nextIndex = (body, res) => {
    destinationModel.find({}, {_id: 0, id: 1}).sort({id:-1}).limit(1).exec((err, doc) => {
        if(doc.length > 0) {
            const nextId = doc[0].id + 1
            body.id = nextId
            insertItem(body, res)
        } else {
            const nextId = 1
            body.id = nextId
            insertItem(body, res)
        }
    })
}

const insertItem = (body, res) => {
    const newPlace = destinationModel({
        id: body.id,
        country: body.country,
        rating: Number(body.rating.toFixed(2)),
        place: body.place,
        description: body.description,
        activity: body.activity
    });

    newPlace.save((err) => {
        res.status(201)
        res.end()
    })
}

const createPlace = async(req, res, next) => {
    try{
        const {body} = req
        const keys = Object.keys(body)
        let flag = true
        if(keys.length == 5){
            const properties = ['country', 'rating', 'place', 'description', 'activity']
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
        const keys = Object.keys(body)
        let flag = true
        if(keys.length == 5){
            const properties = ['country', 'rating', 'place', 'description', 'activity']
            keys.forEach(element => {
                if(!properties.includes(element)){
                    flag = false
                }
            })
        } else {
            flag = false
        }

        if(flag){
            const query = destinationModel.updateOne({ id: Number(params.id) }, 
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
    const key = 'get_place_all'
    const query = destinationModel.deleteOne({ id: Number(params.id) }) 
    query.then(function (result) {
        if(result.ok === 1 && result.deletedCount > 0){
            if(redisOn){
                client.exists(key, function(err, reply) { 
                    if (reply === 1) {
                        client.del(key,function(err, place) {
                            console.log("Key places_all deleted from cache")
                        });
                    }
                });
            }
           
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