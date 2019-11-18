require('mocha')
const sinon = require('sinon')
const { expect } = require('chai')
const  {getAllPlaces, getOnePlace, createPlace, updatePlace, deletePlace}  = require('../../src/managers/places')
const mongoose = require('mongoose');
const storage = require('../../data/localStorage')
var destinationModel = require('../../src/models/destination');

describe("Places Manager", function() {
  
  let lista
  before((done)=>{
    mongoose.connect('mongodb://localhost:27017/DB_Trips', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => {
      console.log("DB connection success")
      done()
    }).catch(err => {})
  })
  
  beforeEach(async() => {
      lista = storage
      await destinationModel.insertMany(lista)
  })

  afterEach(async() => {
    await destinationModel.collection.drop()
  })

  it('will get all the places', async () => {
      const sandbox = sinon.createSandbox()
      const statusMock = sandbox.stub()
      const jsonMock = sandbox.stub()
      const reqMock = sandbox.stub()
      const nextMock = sandbox.stub()
      const sendMock = sandbox.stub()

      const resMock = {
        status: statusMock,
        json: jsonMock,
        send: sendMock
      }

      await getAllPlaces(reqMock, resMock, nextMock).then( () =>{
        sinon.assert.calledWith(statusMock, 200) 
        sinon.assert.calledWith(jsonMock, lista)
      })

  })


  it('will get one place with a correct id input', async () => {
      const sandbox = sinon.createSandbox()
      const statusMock = sandbox.stub()
      const jsonMock = sandbox.stub()
      const nextMock = sandbox.stub()
      const sendMock = sandbox.stub()

      const reqMock = {
          params: {
              id: "1"
          }
      }

      const resMock = {
        status: statusMock,
        json: jsonMock,
        send: sendMock
      }

      await getOnePlace(reqMock, resMock, nextMock).then( ()=>{
        sinon.assert.calledWith(statusMock, 200)
        sinon.assert.calledWith(jsonMock, lista[0]) //index = 0 --> id = 1
      })

  })
  
  it('won\'t get place, bad id input', async() => {
    const sandbox = sinon.createSandbox()
    const statusMock = sandbox.stub()
    const jsonMock = sandbox.stub()
    const nextMock = sandbox.stub()
    const sendMock = sandbox.stub()

    const reqMock = {
        params: {
            id: "-1"
        }
    }

    const resMock = {
      status: statusMock,
      json: jsonMock,
      send: sendMock
    }

    await getOnePlace(reqMock, resMock, nextMock).then( ()=>{
      sinon.assert.calledWith(statusMock, 404)
      sinon.assert.calledWith(sendMock, 'Item not found')
    })

  })

  /*it('won\'t get place, id input not numeric', async() => {
    const sandbox = sinon.createSandbox()
    const statusMock = sandbox.stub()
    const jsonMock = sandbox.stub()
    const nextMock = sandbox.stub()
    const sendMock = sandbox.stub()

    const reqMock = {
        params: {
            id: "a"
        }
    }

    const resMock = {
      status: statusMock,
      json: jsonMock,
      send: sendMock
    }

    await getOnePlace(reqMock, resMock, nextMock).then( ()=>{
      sinon.assert.calledWith(statusMock, 400)
      sinon.assert.calledWith(sendMock, 'Bad id request')
    })

  })*/
       
  
  it('will create a place', async() => {
    const sandbox = sinon.createSandbox()
    const statusMock = sandbox.stub()
    const jsonMock = sandbox.stub()
    const nextMock = sandbox.stub()
    const sendMock = sandbox.stub()

    const reqMock = {
        body: {
          "country": "Belice",
          "rating": 4.1,
          "place": "Cayos de Belice",
          "description": "Islands",
          "activity": "snorkling"
        }
    }

    lista.push({
      "id": 1,
      "country": "Belice",
      "rating": 4.1,
      "place": "Cayos de Belice",
      "description": "Islands",
      "activity": "snorkling"
    })

    const resMock = {
      status: statusMock,
      json: jsonMock,
      send: sendMock
    }

    await createPlace(reqMock, resMock, nextMock).then( ()=>{
      sinon.assert.calledWith(statusMock, 201)
      sinon.assert.calledWith(sendMock, 'Place created')
    })

  })

  
  it('will create a place, even if the db is empty', async() => {
    const sandbox = sinon.createSandbox()
    const statusMock = sandbox.stub()
    const jsonMock = sandbox.stub()
    const nextMock = sandbox.stub()
    const sendMock = sandbox.stub()

    const reqMock = {
        body: {
          "country": "Belice",
          "rating": 4.1,
          "place": "Cayos de Belice",
          "description": "Islands",
          "activity": "snorkling"
        }
    }

    const resMock = {
      status: statusMock,
      json: jsonMock,
      send: sendMock
    }

    await destinationModel.deleteMany({}).then( async() => {
      await createPlace(reqMock, resMock, nextMock).then( ()=>{
        sinon.assert.calledWith(statusMock, 201)
        sinon.assert.calledWith(sendMock, 'Place created')
      })
    })
   
  })

  it('won\'t create a place, less input properties', async() => {
    const sandbox = sinon.createSandbox()
    const statusMock = sandbox.stub()
    const jsonMock = sandbox.stub()
    const nextMock = sandbox.stub()
    const sendMock = sandbox.stub()

    const reqMock = {
        body: {
          "country": "Belice",
        }
    }

    const resMock = {
      status: statusMock,
      json: jsonMock,
      send: sendMock
    }

    await createPlace(reqMock, resMock, nextMock).then( ()=>{
      sinon.assert.calledWith(statusMock, 400)
    sinon.assert.calledWith(sendMock, 'Check properties of object sent')
    })

  })

  it('won\'t create a place, wrong input properties', async() => {
    const sandbox = sinon.createSandbox()
    const statusMock = sandbox.stub()
    const jsonMock = sandbox.stub()
    const nextMock = sandbox.stub()
    const sendMock = sandbox.stub()

    const reqMock = {
        body: {
          "country": "Belice",
          "rating": 4.1,
          "place": "Cayos de Belice",
          "description": "Islands",
          "review": "good"
        }
    }

    const resMock = {
      status: statusMock,
      json: jsonMock,
      send: sendMock
    }

    await createPlace(reqMock, resMock, nextMock).then( ()=>{
      sinon.assert.calledWith(statusMock, 400)
    sinon.assert.calledWith(sendMock, 'Check properties of object sent')
    })
    
  })
    
  it('won\'t create a place, missing params', async() => {
    const sandbox = sinon.createSandbox()
    const statusMock = sandbox.stub()
    const jsonMock = sandbox.stub()
    const nextMock = sandbox.stub()
    const sendMock = sandbox.stub()
    const reqMock = sandbox.stub()

    const resMock = {
      status: statusMock,
      json: jsonMock,
      send: sendMock
    }

    await createPlace(reqMock, resMock, nextMock).then( ()=>{
      sinon.assert.calledWith(statusMock, 400)
      sinon.assert.calledWith(sendMock, 'Missing params, item not created')
    })
    
  })
    
  it('will update a place', async() => {
    const sandbox = sinon.createSandbox()
    const statusMock = sandbox.stub()
    const jsonMock = sandbox.stub()
    const nextMock = sandbox.stub()
    const sendMock = sandbox.stub()

    const reqMock = {
        params: {
          'id': '1'
        },
        body: {
          'country': 'Guate',
          'rating': 4.8,
          'place': 'Tikal National Park',
          'description': 'Archeologic ruins and temples',
          'activity': 'Archeologic site tour'
        }
    }

    const resMock = {
      status: statusMock,
      json: jsonMock,
      send: sendMock
    }
    
    await updatePlace(reqMock, resMock, nextMock).then( ()=>{
      sinon.assert.calledWith(statusMock, 204)
      sinon.assert.calledWith(sendMock, 'Updated')
    })
  })

  
  it('won\'t update a place, item not found', async() => {
    const sandbox = sinon.createSandbox()
    const statusMock = sandbox.stub()
    const jsonMock = sandbox.stub()
    const nextMock = sandbox.stub()
    const sendMock = sandbox.stub()

    const reqMock = {
        params: {
          'id': '-1'
        },
        body: {
          'country': 'Guate',
          'rating': 4.9,
          'place': 'Tikal National Park',
          'description': 'Archeologic ruins and temples',
          'activity': 'Archeologic site tour'
        }
    }

    const resMock = {
      status: statusMock,
      json: jsonMock,
      send: sendMock
    }
    
    await updatePlace(reqMock, resMock, nextMock).then( ()=>{
      sinon.assert.calledWith(statusMock, 404)
      sinon.assert.calledWith(sendMock, 'Item not found')
    })

  })

  it('won\'t update a place, wrong properties on body', async() => {
    const sandbox = sinon.createSandbox()
    const statusMock = sandbox.stub()
    const jsonMock = sandbox.stub()
    const nextMock = sandbox.stub()
    const sendMock = sandbox.stub()

    const reqMock = {
        params: {
          'id': '1'
        },
        body: {
          'country': 'Guate',
          'rating': 4.9,
          'place': 'Tikal National Park',
          'description': 'Archeologic ruins and temples',
          'review':'good'
        }
    }

    const resMock = {
      status: statusMock,
      json: jsonMock,
      send: sendMock
    }

    await updatePlace(reqMock, resMock, nextMock).then( ()=>{
      sinon.assert.calledWith(statusMock, 400)
      sinon.assert.calledWith(sendMock, 'Check body properties')
    })
    
  })

  
  it('won\'t update a place, less properties on body', async() => {
    const sandbox = sinon.createSandbox()
    const statusMock = sandbox.stub()
    const jsonMock = sandbox.stub()
    const nextMock = sandbox.stub()
    const sendMock = sandbox.stub()

    const reqMock = {
        params: {
          'id': '1'
        },
        body: {
          'review':'good'
        }
    }


    const resMock = {
      status: statusMock,
      json: jsonMock,
      send: sendMock
    }

    await updatePlace(reqMock, resMock, nextMock).then( ()=>{
      sinon.assert.calledWith(statusMock, 400)
      sinon.assert.calledWith(sendMock, 'Check body properties')
    })
    
  })
    
  it('won\'t update a place, missing body on request', async() => {
    const sandbox = sinon.createSandbox()
    const statusMock = sandbox.stub()
    const jsonMock = sandbox.stub()
    const nextMock = sandbox.stub()
    const sendMock = sandbox.stub()

    const reqMock = {
        params: {
          'id': '1'
        }
    }


    const resMock = {
      status: statusMock,
      json: jsonMock,
      send: sendMock
    }

    await updatePlace(reqMock, resMock, nextMock).then( ()=>{
      sinon.assert.calledWith(statusMock, 400)
      sinon.assert.calledWith(sendMock, 'Missing body on request')
    })
    
  })
    
  it('will delete a place', async() => {
    const sandbox = sinon.createSandbox()
    const statusMock = sandbox.stub()
    const jsonMock = sandbox.stub()
    const nextMock = sandbox.stub()
    const sendMock = sandbox.stub()

    const reqMock = {
        params: {
          'id': '1'
        }
    }

    const resMock = {
      status: statusMock,
      json: jsonMock,
      send: sendMock
    }

    await deletePlace(reqMock, resMock, nextMock).then( ()=>{
      sinon.assert.calledWith(statusMock, 204)
      sinon.assert.calledWith(sendMock, 'Item deleted')
    })

  })

  it('won\'t delete a place, wrong id', async() => {
    const sandbox = sinon.createSandbox()
    const statusMock = sandbox.stub()
    const jsonMock = sandbox.stub()
    const nextMock = sandbox.stub()
    const sendMock = sandbox.stub()

    const reqMock = {
        params: {
          'id': '-1'
        }
    }

    const resMock = {
      status: statusMock,
      json: jsonMock,
      send: sendMock
    }

    await deletePlace(reqMock, resMock, nextMock).then( ()=>{
      sinon.assert.calledWith(statusMock, 404)
      sinon.assert.calledWith(sendMock, 'Item not found')
    })

  })
});
