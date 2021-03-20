const machineModule = require('../machineModule/machineInterface')
const storageModule = require('../storageModule/storageInterface')
const imageClassifier = machineModule.initImageClassifier(storageModule)

//const poolThreadsModule = require('../multithreadsModule/poolThreadsModule')

const pipelineClassifierHorizontal = require('./horizontal/pipelineClassifierHorizontal')
const pipelineClassifierHorizontalMT = require('./horizontal/pipelineClassifierHorizontalMT')

const pipelineClassifierVertical = require('./vertical/pipelineClassifierVertical')



const controllerModule = {}

// Horizontal
controllerModule.singleImageClassification = (file) =>
{
    return pipelineClassifierHorizontal.singleImageClassification(file, imageClassifier)
}
controllerModule.multipleImageClassification = (files) =>
{
    return pipelineClassifierHorizontal.multipleImageClassification(files, imageClassifier)
}

controllerModule.multipleImageClassificationMT1 = (files) =>
{
    //return pipelineClassifierHorizontalMT.multipleImageClassificationMT1(files, poolThreadsModule.poolUnitWorkerHorizontal)
}
controllerModule.multipleImageClassificationMT2 = (files) =>
{
    //return pipelineClassifierHorizontalMT.multipleImageClassificationMT2(files, poolThreadsModule.poolUnitWorkerHorizontal)
}
// Horizontal

// Vertical
controllerModule.singleImageClassificationV = (file) =>
{
    return pipelineClassifierVertical.singleImageClassification(file, imageClassifier)
}

controllerModule.multipleImageClassificationV = (files) =>
{
    return pipelineClassifierVertical.multipleImageClassification(files, imageClassifier)
}
// Vertical

controllerModule.dbModel = storageModule.dbModel

module.exports = controllerModule