const mobilenet = require('@tensorflow-models/mobilenet');
const directoryHelper = require('../helpers/directoryHelper')
const tensorHelper = require('../helpers/tensorHelper')
let trainedModelPath = "./res/trainedModel"
let metadata
let model
let custom = 0

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

machineLearning.classify = async (image) =>
{
    // Convert image to a tensor
    const tensor3d = tensorHelper.imageTo3dTensor(image)

    let predictions
    // Classify our tensor
    if (custom)
    {
        try
        {
            predictions = await machineLearning.customClassification(tensor3d, model, metadata.labels)
        } catch (error)
        { console.error(error) }
    }
    else 
    {
        predictions = await model.classify(tensor3d);
    }

    return predictions
}

machineLearning.customClassification = async (tensor3d, model, labels) =>
{
    const normalizedTensor = tensorHelper.normalizeAndReshapeImgTensor(tensor3d)

    const logits = model.predict(normalizedTensor);
    // try
    // {
    //     // Remove the very first logit (background noise).
    //     logits = logits.slice([0, 1], [-1, 2]);
    // } catch (error)
    // { console.error(error) }
    const predictions = await tensorHelper.getTop3Classes(labels, logits);
    return predictions
}

module.exports = machineLearning

