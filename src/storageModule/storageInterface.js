
const directoryListing = require('./directoryListing')
const directoryConversion = require('./directoryConversion')
const fileLoader = require('./fileLoader')

const storageModule = {}

storageModule.pathNewData = "./res/newData"
storageModule.pathTestData = "./res/testData"
storageModule.pathTrainData = "./res/trainData"
storageModule.pathTrainedModel = "./res/trainedModel"

storageModule.listing = directoryListing.listing
storageModule.removeDirectoriesFromListing = directoryListing.removeDirectoriesFromListing

storageModule.filePathToURL = directoryConversion.filePathToURL
storageModule.URLtoFilePath = directoryConversion.URLtoFilePath

storageModule.loadJSON = fileLoader.loadJSON
storageModule.getImage = fileLoader.getImage

module.exports = storageModule