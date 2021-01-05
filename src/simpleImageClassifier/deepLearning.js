const deepLearning = {}

const mobilenet = require('@tensorflow-models/mobilenet');
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

