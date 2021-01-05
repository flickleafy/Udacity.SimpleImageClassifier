const deepLearning = {}

const mobilenet = require('@tensorflow-models/mobilenet');

const imageLoader = require('../helpers/imageLoader')
const tensorHelper = require('../helpers/tensorHelper')
let model

deepLearning.initialize = async () =>
{
    // Load a model from MobileNet
    model = await mobilenet.load();
}

deepLearning.predict = async (tensor) =>
{
    // Classify our tensor
    const predictions = await model.classify(tensor);

    return predictions
}

module.exports = deepLearning

