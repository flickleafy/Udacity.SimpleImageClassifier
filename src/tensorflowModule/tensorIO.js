const tensorflow = require('@tensorflow/tfjs-node-gpu');// Load the binding (GPU computation)
// require('@tensorflow/tfjs')

const tensorIO = {}

tensorIO.loadModel = async (pathTrainedModel) =>
{
    let model = null
    try
    {
        model = await tensorflow.loadLayersModel("file://" + pathTrainedModel)
        model.summary()
    } catch (error)
    { console.error(error) }
    return model
}

tensorIO.saveModel = async (createdModel, pathTrainedModel) =>
{
    let model = null
    try
    {
        model = await tensorflow.model(createdModel)
        await model.save("file://" + pathTrainedModel)
    } catch (error)
    { console.error(error) }
}

module.exports = tensorIO