const tensorflow = require('@tensorflow/tfjs')// Load the binding (CPU computation)
require('@tensorflow/tfjs-node-gpu');
// const directoryHelper = require('../helpers/directoryHelper')

const tensorHelper = {}
tensorHelper.imageTo3dTensor = (imageData) =>
{
    const numChannels = 3;
    const numPixels = imageData.bitmap.width * imageData.bitmap.height;
    const values = new Int32Array(numPixels * numChannels);
    pixels = pixels = imageData.bitmap.data

    for (let i = 0; i < numPixels; i++)
    {
        for (let channel = 0; channel < numChannels; ++channel)
        {
            values[i * numChannels + channel] = pixels[i * 4 + channel];
        }
    }
    const outShape = [imageData.bitmap.height, imageData.bitmap.width, numChannels];
    const tensor3d = tensorflow.tensor3d(values, outShape, 'int32');
    return tensor3d
}

tensorHelper.loadModel = async (relativePath) =>
{
    let model
    // const url = directoryHelper.filePathToURL(relativePath)
    try
    {
        model = await tensorflow.loadLayersModel("file://" + relativePath)
        model.summary()
    } catch (error)
    {
        console.log(error)
    }
    return model
}

tensorHelper.saveModel = async (createdModel, filePath) =>
{
    // const url = directoryHelper.filePathToURL(filePath)
    let model
    try
    {
        model = await tensorflow.model(createdModel)
        await model.save(url.href)
    } catch (error)
    {
        console.log(error)
    }
}

tensorHelper.expandDimension = (tensor) =>
{
    return tensorflow.expandDims(tensor, 0)
}


module.exports = tensorHelper