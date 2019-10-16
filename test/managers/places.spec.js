require('mocha')
const sinon = require('sinon')
const { expect } = require('chai')
const  {getAllPlaces, getOnePlace, createPlace, updatePlace, deletePlace}  = require('../../src/managers/places')