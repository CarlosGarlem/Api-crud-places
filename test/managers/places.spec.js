require('mocha')
const storage = require('../../data/localStorage')
const sinon = require('sinon')
const { expect } = require('chai')
const  {getAllPlaces, getOnePlace, createPlace, updatePlace, deletePlace}  = require('../../src/managers/places')

describe("Places Manager", function() {
    let lista
    beforeEach(() => {
      lista = storage
    })

    it('will get all the places', () => {
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
    
        getAllPlaces(reqMock, resMock, nextMock)
        sinon.assert.calledWith(statusMock, 200)
        sinon.assert.calledWith(jsonMock, lista)
      })


    it('will get one user with a correct id input', () => {
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
        var place = lista.find(item => item.id.toString() === "1")

        const resMock = {
        status: statusMock,
        json: jsonMock,
        send: sendMock
        }

        getOnePlace(reqMock, resMock, nextMock)
        sinon.assert.calledWith(statusMock, 200)
        sinon.assert.calledWith(jsonMock, place)
    })
    
  });