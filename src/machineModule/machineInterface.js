const imageClassifier = require('./imageClassifier')
const pipelineClassifierHorizontal = require('./pipelineClassifierHorizontal')
const pipelineClassifierHorizontalMT = require('./pipelineClassifierHorizontalMT')
const storageModule = require('../storageModule/storageInterface')
const poolThreadsModule = require('../multithreadsModule/poolThreadsModule')

const machineModule = {}

imageClassifier.initialize(storageModule.pathTrainData, storageModule.pathTrainedModel)

machineModule.singleImageClassification = (file) =>
{
    return pipelineClassifierHorizontal.singleImageClassification(file, imageClassifier)
}

machineModule.multipleImageClassification = (files) =>
{
    return pipelineClassifierHorizontal.multipleImageClassification(files, imageClassifier)
}


machineModule.multipleImageClassificationMT1 = (files) =>
{
    return pipelineClassifierHorizontalMT.multipleImageClassificationMT1(files, poolThreadsModule.poolUnitWorkerHorizontal)
}
machineModule.multipleImageClassificationMT2 = (files) =>
{
    return pipelineClassifierHorizontalMT.multipleImageClassificationMT2(files, poolThreadsModule.poolUnitWorkerHorizontal)
}

module.exports = machineModule

