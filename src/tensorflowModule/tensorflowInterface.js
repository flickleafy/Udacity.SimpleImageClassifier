const tensorClassification = require('./tensorClassification')
const tensorConversion = require('./tensorConversion')
const tensorIO = require('./tensorIO')
const tensorReshape = require('./tensorReshape')

const tensorflowModule = {}

tensorflowModule.customClassification = tensorClassification.customClassification

tensorflowModule.imageTo3dTensor = tensorConversion.imageTo3dTensor

tensorflowModule.loadModel = tensorIO.loadModel
tensorflowModule.saveModel = tensorIO.saveModel

tensorflowModule.normalizeAndReshapeImgTensor = tensorReshape.normalizeAndReshapeImgTensor
tensorflowModule.expandDimension = tensorReshape.expandDimension

module.exports = tensorflowModule