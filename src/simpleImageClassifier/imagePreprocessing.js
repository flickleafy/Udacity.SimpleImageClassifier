imagePreprocessing = {}
const imageLoader = require('../helpers/imageLoader')
const tensorHelper = require('../helpers/tensorHelper')

imagePreprocessing.imageTensor = async (imagePath) =>
{
    // Load local image from our resources
    const image = await imageLoader.getImage(imagePath)

    // Convert image to a tensor
    const tensor3d = tensorHelper.imageTo3dTensor(image)

    return tensor3d
}

module.exports = imagePreprocessing


