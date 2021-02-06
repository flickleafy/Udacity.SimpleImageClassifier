const colorManipulation = require('./colorManipulation')
const imageDimension = require('./imageDimension')

const imageModule = {}

imageModule.averagePixelColorRGB = colorManipulation.averagePixelColorRGB
imageModule.imageColorAveragingHSL = colorManipulation.imageColorAveragingHSL
imageModule.pixelColorRGBToHSLfp = colorManipulation.pixelColorRGBToHSLfp
imageModule.whiteFill = colorManipulation.whiteFill

imageModule.cropSquare = imageDimension.cropSquare
imageModule.cropSquareAroundMark = imageDimension.cropSquareAroundMark

module.exports = imageModule

