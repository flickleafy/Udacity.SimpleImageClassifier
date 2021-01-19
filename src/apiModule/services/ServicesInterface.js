//const mongoose = require('mongoose');
//const logger = require('../config/logger.js');
//const ObjectId = mongoose.Types.ObjectId;
const apiDelete = require('./apiDelete')
const apiFind = require('./apiFind')
const apiInsert = require('./apiInsert')
const apiUpdate = require('./apiUpdate')
const apiMachineLearning = require('./apiMachineLearning')

module.exports = {
  insertTransaction: apiInsert.insertTransaction,
  updateTransactionById: apiUpdate.updateTransactionById,
  deleteTransactionById: apiDelete.deleteTransactionById,
  removeAllTransactionsInPeriod: apiDelete.removeAllTransactionsInPeriod,
  findUniquePeriods: apiFind.findUniquePeriods,
  findTransactionById: apiFind.findTransactionById,
  findAllTransactionsInPeriod: apiFind.findAllTransactionsInPeriod,
  classifySingleImage: apiMachineLearning.classifySingleImage,
  classifyMultipleImages: apiMachineLearning.classifyMultipleImages,
};
