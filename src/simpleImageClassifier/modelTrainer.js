const tensorHelper = require('../helpers/tensorHelper')
const directoryHelper = require('../helpers/directoryHelper')
const imageHelper = require('../helpers/imageHelper')

let metadata
let model

const modelTrainer = {}

modelTrainer.initialize = (pathTrainData, pathTrainedModel) =>
{
    // List directory structure
    const files = await directoryListing(pathTrainData)

    // Create metadata from directory structure
    metadata = await createMetadata(files)

    // Load images to array
    const images = await loadTrainData(files)

    // Preprocess images
    const preprocessedImages = await preprocessImages(images)

    // Convert samples to tensor

    // Train a model

    // Save the model

}

const directoryListing = async (pathTrainData) =>
{
    const files = await directoryHelper.listing(pathTrainData)
    return files
}

const createMetadata = async (files) =>
{


}

const loadTrainData = async (files) =>
{
    let images = []
    if (files)
    {
        for (let index = 0; index < files.length; index++) 
        {
            const fileObject = files[index];

            // Load local image from our resources
            const image = await directoryHelper.getImage(fileObject.path + fileObject.name)
            images.push(image)
        }
    }
    return images
}

const preprocessImages = async (images) =>
{
    let preprocessedImages = []

    if (images)
    {
        for (let index = 0; index < images.length; index++) 
        {
            const imageObject = images[index];

            let intermediate
            // Make the image a square
            intermediate = imageHelper.cropSquare(imageObject)

            preprocessedImages.push(intermediate)
        }
    }
    return preprocessedImages
}

module.exports = modelTrainer