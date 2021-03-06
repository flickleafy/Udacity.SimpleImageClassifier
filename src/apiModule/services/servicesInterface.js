//const mongoose = require('mongoose');
//const logger = require('../config/logger.js');
//const ObjectId = mongoose.Types.ObjectId;
const apiInsert = require('./apiInsert')
const apiFind = require('./apiFind')
const apiUpdate = require('./apiUpdate')
const apiDelete = require('./apiDelete')
const apiMachine = require('./apiMachine')

const servicesInterface = {}

//create 
servicesInterface.insertTransaction = apiInsert.insertTransaction

//read 
servicesInterface.findUniquePeriods = apiFind.findUniquePeriods
servicesInterface.findTransactionById = apiFind.findTransactionById
servicesInterface.findAllTransactionsInPeriod = apiFind.findAllTransactionsInPeriod

//update
servicesInterface.updateTransactionById = apiUpdate.updateTransactionById

//delete
servicesInterface.deleteTransactionById = apiDelete.deleteTransactionById
servicesInterface.removeAllTransactionsInPeriod = apiDelete.removeAllTransactionsInPeriod

//machine learning
servicesInterface.classifySingleImage = apiMachine.classifySingleImage
servicesInterface.classifyMultipleImages = apiMachine.classifyMultipleImages

module.exports = servicesInterface