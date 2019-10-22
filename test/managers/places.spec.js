require('mocha')
const sinon = require('sinon')
const { expect } = require('chai')
const server = 'http://localhost:3000'
const storage = require('../../data/localStorage')
const  {getAllPlaces, getOnePlace, createPlace,  updatePlace, deletePlace}  = require('../../src/managers/places')

describe("Places Manager", function() {
    let lista
    beforeEach(() => {
      lista = storage 
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

        await getAllPlaces(reqMock, resMock, nextMock)//await fetch(server + '/api/v1/places')
        var mystatus = await resMock.status
        expect(mystatus).to.be.equal(200)
        //await getAllPlaces(reqMock, resMock, nextMock)
        //sinon.assert.calledWith(response.status, 200)
        var myjson = await response.json
        expect(myjson).to.be.equal(lista)
        //sinon.assert.calledWith(myjson, lista)


    })


   /* it('will get one place with a correct id input', () => {
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

        getOnePlace(reqMock, resMock, nextMock)
        sinon.assert.calledWith(statusMock, 200)
        sinon.assert.calledWith(jsonMock, lista[0]) //index = 0 --> id = 1
    })
    
    it('won\'t get place, bad id input', () => {
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

      getOnePlace(reqMock, resMock, nextMock)
      sinon.assert.calledWith(statusMock, 404)
      sinon.assert.calledWith(sendMock, 'Item not found')
    })
       
    it('will create a place', () => {
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

      createPlace(reqMock, resMock, nextMock)
      sinon.assert.calledWith(statusMock, 201)
      sinon.assert.calledWith(jsonMock, lista)
    })

    it('won\'t create a place, less input properties', () => {
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

      createPlace(reqMock, resMock, nextMock)
      sinon.assert.calledWith(statusMock, 400)
      sinon.assert.calledWith(sendMock, 'Check properties of object sent')
    })

    it('won\'t create a place, wrong input properties', () => {
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

      createPlace(reqMock, resMock, nextMock)
      sinon.assert.calledWith(statusMock, 400)
      sinon.assert.calledWith(sendMock, 'Check properties of object sent')
    })

    it('won\'t create a place, missing params', () => {
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

      createPlace(reqMock, resMock, nextMock)
      sinon.assert.calledWith(statusMock, 400)
      sinon.assert.calledWith(sendMock, 'Missing params, item not created')
    })

    it('will update a place', () => {
      const sandbox = sinon.createSandbox()
      const statusMock = sandbox.stub()
      const jsonMock = sandbox.stub()
      const nextMock = sandbox.stub()
      const sendMock = sandbox.stub()

      lista = [
        {
            id: 1,
            country: 'Guate',
            rating: 3.9,
            place: 'Tikal National Park',
            description: 'Archeologic ruins and temples',
            activity: 'Archeologic site tour'
        },
        {
            id: 2.0,
            country: 'Corea del Sur',
            rating: 5,
            place: 'Oryukdo',
            description: 'Beach and park',
            activity: 'Sky walking'
        },
        {
            id: 3.0,
            country: 'Peru',
            rating: 4.7,
            place: 'Vinicunca',
            description: 'Mountain range',
            activity: 'Hiking in rainbow mountain'
        },
        {
            id: 4.0,
            country: 'Honduras',
            rating: 4.2,
            place: 'Roatan',
            description: 'Beach',
            activity: 'Snorkling'
        }
    ]
      const reqMock = {
          params: {
            'id': '1'
          },
          body: {
            'id': '1',
            'country': 'Guate',
            'rating': 3.9,
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

      updatePlace(reqMock, resMock, nextMock)
      sinon.assert.calledWith(statusMock, 204)
      //sinon.assert.calledWith(jsonMock, lista)
    })

    it('won\'t update a place, wrong properties on body', () => {
      const sandbox = sinon.createSandbox()
      const statusMock = sandbox.stub()
      const jsonMock = sandbox.stub()
      const nextMock = sandbox.stub()
      const sendMock = sandbox.stub()

      const reqMock = {
          params: {
            'id': '1'
          },
          body: {}
      }


      const resMock = {
        status: statusMock,
        json: jsonMock,
        send: sendMock
      }

      updatePlace(reqMock, resMock, nextMock)
      sinon.assert.calledWith(statusMock, 400)
      sinon.assert.calledWith(sendMock, 'Check body properties')
    })

    
    it('won\'t update a place, missing body on request', () => {
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

      updatePlace(reqMock, resMock, nextMock)
      sinon.assert.calledWith(statusMock, 400)
      sinon.assert.calledWith(sendMock, 'Missing body on request')
    })

       
    it('will delete a place', () => {
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

      lista = [
        {
            id: 2,
            country: 'Corea del Sur',
            rating: 5,
            place: 'Oryukdo',
            description: 'Beach and park',
            activity: 'Sky walking'
        },
        {
            id: 3,
            country: 'Peru',
            rating: 4.7,
            place: 'Vinicunca',
            description: 'Mountain range',
            activity: 'Hiking in rainbow mountain'
        },
        {
            id: 4,
            country: 'Honduras',
            rating: 4.2,
            place: 'Roatan',
            description: 'Beach',
            activity: 'Snorkling'
        }
    ]


      const resMock = {
        status: statusMock,
        json: jsonMock,
        send: sendMock
      }

      deletePlace(reqMock, resMock, nextMock)
      sinon.assert.calledWith(statusMock, 204)
      //sinon.assert.calledWith(jsonMock, lista)
    })

    it('won\'t delete a place, wrong id', () => {
      const sandbox = sinon.createSandbox()
      const statusMock = sandbox.stub()
      const jsonMock = sandbox.stub()
      const nextMock = sandbox.stub()
      const sendMock = sandbox.stub()

      const reqMock = {
          params: {
            'id': 'a'
          }
      }

      const resMock = {
        status: statusMock,
        json: jsonMock,
        send: sendMock
      }

      deletePlace(reqMock, resMock, nextMock)
      sinon.assert.calledWith(statusMock, 404)
      sinon.assert.calledWith(sendMock, 'Item not found')
      //sinon.assert.calledWith(jsonMock, lista)
    })*/
});
