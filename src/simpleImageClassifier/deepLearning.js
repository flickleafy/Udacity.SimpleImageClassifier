const mobilenet = require('@tensorflow-models/mobilenet');
const directoryHelper = require('../helpers/directoryHelper')
const tensorHelper = require('../helpers/tensorHelper')
let model
let custom = 0

const deepLearning = {}
deepLearning.initialize = async () =>
{
    let customModel = await directoryHelper.listing("./res/trainedModel")
    customModel = customModel.find((item) => { if (item.name === "model.json") { return item } })
    if (customModel)
    {   // Load custom model
        model = await tensorHelper.loadModel("./res/trainedModel/model.json")
        custom = 1
    }
    else
    {   // Load a model from MobileNet
        model = await mobilenet.load();
    }
}

deepLearning.predict = async (tensor) =>
{
    let predictions
    // Classify our tensor
    if (custom)
    {
        try
        {
            tensor = tensorHelper.expandDimension(tensor)
            predictions = await model.predict(tensor);
        } catch (error)
        {
            console.log(error)
        }
    }
    else 
    {
        predictions = await model.classify(tensor);
    }

    return predictions
}

module.exports = deepLearning

