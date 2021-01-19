// Simple example of machine learning, image classification

const apiModule = require('./apiModule/api')
const simpleImageClassifier = require('./machineModule/simpleImageClassifier')
// const modelTrainer = require('./machineModule/modelTrainer')
// const directoryHelper = require('./directoryModule/directoryHelper')
// const imageHelper = require('./imageModule/imageHelper')

const pathNewData = "./res/newData"
const pathTestData = "./res/testData"
const pathTrainData = "./res/trainData"
const pathTrainedModel = "./res/trainedModel"

application = {}

application.initialize = async () =>
{
    await simpleImageClassifier.initialize(pathTrainData, pathTrainedModel)
    //await modelClassifier.multiImageClassification(pathTestData, simpleImageClassifier)
    await apiModule.initialize(simpleImageClassifier)
    //await modelTrainer.initialize(pathTrainData, pathTrainedModel)
}

application.initialize()