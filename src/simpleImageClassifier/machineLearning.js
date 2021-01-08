const mobilenet = require('@tensorflow-models/mobilenet');
const directoryHelper = require('../helpers/directoryHelper')
const tensorHelper = require('../helpers/tensorHelper')
let model
let metadata
let custom = 0
let trainedModelPath = "./res/trainedModel"

const machineLearning = {}
machineLearning.initialize = async () =>
{
    let customModel = await directoryHelper.listing(trainedModelPath)
    customModel = customModel.find((item) => { if (item.name === "model.json") { return item } })
    if (customModel)
    {   // Load custom model
        model = await tensorHelper.loadModel(trainedModelPath + "/model.json")
        metadata = await directoryHelper.loadJSON(trainedModelPath + "/metadata.json")
        custom = 1
    }
    else
    {   // Load a model from MobileNet
        model = await mobilenet.load();
    }
}

machineLearning.classify = async (tensor) =>
{
    let predictions
    // Classify our tensor
    if (custom)
    {
        try
        {
            predictions = await tensorHelper.customClassification(tensor, model, metadata.labels)
        } catch (error)
        {
            console.error(error)
        }
    }
    else 
    {
        predictions = await model.classify(tensor);
    }

    return predictions
}

module.exports = machineLearning

