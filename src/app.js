// Simple example of machine learning, image classification

const apiModule = require('./apiModule/apiModule')
//const imageClassifier = require('./machineModule/imageClassifier')
//const poolThreadsModule = require('./multithreadsModule/poolThreadsModule')
//const storageModule = require('./storageModule/storageInterface')
const controllerModule = require('./controllerModule/controllerInterface')

const application = {}

application.initialize = async () =>
{
    //await imageClassifier.initialize(storageModule.pathTrainData, storageModule.pathTrainedModel)
    await apiModule.initialize(controllerModule, null, null)
}

application.initialize()