require('mocha')
const sinon = require('sinon')
const { expect } = require('chai')
const { userList, getList, getOne, getValue } = require('../../src/managers/users')

describe('User Manager', () => {
  let users
  beforeEach(() => {
    users = []
    userList.splice(0, userList.length)
  })

  it('will get all the users', () => {
    const sandbox = sinon.sandbox.create()
    const statusMock = sandbox.stub()
    const jsonMock = sandbox.stub()
    const reqMock = sandbox.stub()
    const nextMock = sandbox.stub()

    users.push({
      name: 'Pablo'
    })
    users.push({
      name: 'Alejandro'
    })

    userList.push({
      name: 'Pablo'
    })
    userList.push({
      name: 'Alejandro'
    })

    const res = {
      status: statusMock,
      json: jsonMock
    }

    getList(reqMock, res, nextMock)
    sinon.assert.calledWith(statusMock, 200)
    sinon.assert.calledWith(jsonMock, users)
  })

  it('will get one user sucessfully', () => {
    const sandbox = sinon.sandbox.create()
    const statusMock = sandbox.stub()
    const jsonMock = sandbox.stub()
    const reqMock = {
      params: {
        id: 1
      }
    }
    const nextMock = sandbox.stub()
    const response = {
      name: 'Alejandro'
    }

    userList.push({
      name: 'Pablo'
    })
    userList.push({
      name: 'Alejandro'
    })

    const resMock = {
      status: statusMock,
      json: jsonMock
    }

    getOne(reqMock, resMock, nextMock)
    sinon.assert.calledWith(statusMock, 200)
    sinon.assert.calledWith(jsonMock, response)
  })

  it('won\'t get one user because of id being lower than 0', () => {
    const sandbox = sinon.sandbox.create()
    const statusMock = sandbox.stub()
    const sendMock = sandbox.stub()
    const reqMock = {
      params: {
        id: -1
      }
    }
    const nextMock = sandbox.stub()

    userList.push({
      name: 'Pablo'
    })
    userList.push({
      name: 'Alejandro'
    })

    const resMock = {
      status: statusMock,
      send: sendMock
    }

    getOne(reqMock, resMock, nextMock)
    sinon.assert.calledWith(statusMock, 400)
    sinon.assert.called(sendMock)
  })

  it('won\'t get one user because of id being greater or equal to list length', () => {
    const sandbox = sinon.sandbox.create()
    const statusMock = sandbox.stub()
    const sendMock = sandbox.stub()
    const reqMock = {
      params: {
        id: 100
      }
    }
    const nextMock = sandbox.stub()

    userList.push({
      name: 'Pablo'
    })
    userList.push({
      name: 'Alejandro'
    })

    const resMock = {
      status: statusMock,
      send: sendMock
    }

    getOne(reqMock, resMock, nextMock)
    sinon.assert.calledWith(statusMock, 404)
    sinon.assert.called(sendMock)
  })

  it('will get the value', () => {
    userList.push({
      name: 'Pablo'
    })
    const response = getValue(0)
    
    expect(response).to.be.deep.equal({
      name: 'Pablo'
    })
  })
})