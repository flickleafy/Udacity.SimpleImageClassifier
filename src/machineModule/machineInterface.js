const imageClassifier = require('./classifier/imageClassifier')

const machineModule = {}

machineModule.initImageClassifier = (storageModule) =>
{
    imageClassifier.initialize(storageModule.pathTrainData, storageModule.pathTrainedModel)
    return imageClassifier
}

module.exports = machineModule

