const imageLoader = require('../helpers/imageLoader')
const tensorHelper = require('../helpers/tensorHelper')
const imageHelper = require("../helpers/imageHelper")

const imagePreprocessing = {}
imagePreprocessing.imageTensor = async (imagePath) =>
{
    // Load local image from our resources
    const image = await imageLoader.getImage(imagePath)

    // Convert image to a tensor
    const tensor3d = tensorHelper.imageTo3dTensor(image)

    return tensor3d
}

imagePreprocessing.colorAveraging = async (imagePath) =>
{
    // Load local image from our resources
    const image = await imageLoader.getImage(imagePath)

    // Get average pixel color of whole image
    const pixelColorRGB = imageHelper.averagePixelColorRGB(image)

    // Convert to the format used in our model
    const pixelColorHSL = imageHelper.pixelColorRGBToHSLfp(pixelColorRGB)

    return pixelColorHSL
}

module.exports = imagePreprocessing


