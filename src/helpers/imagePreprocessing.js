imagePreprocessing = {}
const imageLoader = require("../image/imageLoader")
const imageHelper = require("../image/imageHelper")

imagePreprocessing.colorAveraging = (imagePath) =>
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