const mobilenet = require('@tensorflow-models/mobilenet');
const directoryHelper = require('../directoryModule/directoryHelper')
const tensorHelper = require('../tensorflowModule/tensorHelper')

let metadata
let model
let custom = 0

const simpleImageClassifier = {}
simpleImageClassifier.initialize = async (pathTrainData, pathTrainedModel) =>
{
    let customModel = await customModelExist(pathTrainedModel);
    if (customModel)
    {   // Load custom model
        await load(pathTrainedModel);
    }
    else
    {   // Load model from MobileNet
        model = await mobilenet.load();
    }
}

simpleImageClassifier.classify = async (image) =>
{
    // Convert image to a tensor
    let tensor3d = tensorHelper.imageTo3dTensor(image)

    let predictions
    // Classify our tensor
    if (custom)
    { predictions = await customClassify(tensor3d); }
    else
    { predictions = await model.classify(tensor3d); }

    // Release memory
    tensor3d.dispose()
    tensor3d = null

    return predictions
}

const customModelExist = async (pathTrainedModel) =>
{
    let customModel = await directoryHelper.listing(pathTrainedModel);
    customModel = customModel.find((item) =>
    {
        if (item.name === "model.json")
        { return item; }
    });
    return customModel;
}

const load = async (pathTrainedModel) =>
{
    model = await tensorHelper.loadModel(pathTrainedModel + "/model.json");
    metadata = await directoryHelper.loadJSON(pathTrainedModel + "/metadata.json");
    custom = 1;
}

const customClassify = async (tensor3d) =>
{
    let predictions = null
    try
    {
        predictions = await tensorHelper.customClassification(tensor3d, model, metadata.labels);
    } catch (error)
    { console.error(error); }
    return predictions;
}

module.exports = simpleImageClassifier



