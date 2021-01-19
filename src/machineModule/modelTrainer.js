const tensorHelper = require('../tensorflowModule/tensorHelper')
const directoryHelper = require('../directoryModule/directoryHelper')
const imageHelper = require('../imageModule/imageHelper')

let metadata
let model

const modelTrainer = {}

modelTrainer.initialize = async (pathTrainData, pathTrainedModel) =>
{
    // List directory structure
    const files = await directoryListing(pathTrainData)

    await processDirectory(files)

    // Create metadata from directory structure
    // metadata = await createMetadata(files)

    // Load images to array
    // const images = await loadTrainData(files)

    // Preprocess images
    // const preprocessedImages = await preprocessImages(images)

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
    let classes = []
    if (files)
    {
        for (let index = 0; index < files.length; index++)
        {
            const subdir = files[index]
            if (!subdir.name.includes("."))
            {
                classes.push(subdir.name)
            }
        }
    }
    return classes
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

            let preprocessed
            // Remove background
            preprocessed = imageHelper.whiteFill(imageObject, imageMaskObject, null)
            // Make the image a square 
            preprocessed = imageHelper.cropSquareAroundMark(preprocessed, null)

            preprocessedImages.push(preprocessed)
        }
    }
    return preprocessedImages
}

async function processDirectory(files)
{
    if (files)
    {
        for (let index = 0; index < files.length; index++)
        {
            const subdir = files[index]
            if (!subdir.name.includes("."))
            {
                await processSubdirectory(subdir.path + subdir.name)
            }
        }
    }
}

async function processSubdirectory(subdirClassTrainData)
{
    let files = await directoryHelper.listing(subdirClassTrainData)
    let imageAndMaskPairs = []

    if (files)
    {
        let idCount = 1
        let vectorPair

        do
        {
            vectorPair = files.filter((file) => { if (file.name.includes(idCount.toString() + ".")) { return file } })
            if (vectorPair.length == 2)
            {
                const objectPair = { image: {}, mask: {} }
                for (let index = 0; index < vectorPair.length; index++) 
                {
                    const fileObject = vectorPair[index];
                    if (fileObject.name.includes("mask"))
                    { objectPair.mask = fileObject }
                    else
                    { objectPair.image = fileObject }
                }
                idCount++
                imageAndMaskPairs.push(objectPair)
            }
        } while (vectorPair.length != 0);


        if (imageAndMaskPairs.length > 0)
        {
            // whiteFill
            for (let index = 0; index < imageAndMaskPairs.length; index++)
            {
                const objectPair = imageAndMaskPairs[index]
                // Load local image from train data
                const image = await directoryHelper.getImage(objectPair.image.path + objectPair.image.name)
                // Load local image mask from train data
                const imageMask = await directoryHelper.getImage(objectPair.mask.path + objectPair.mask.name)
                // White fill, and store in directory
                await imageHelper.whiteFill(image, imageMask, objectPair.image)
            }

            // crop square around marks
            for (let index = 0; index < imageAndMaskPairs.length; index++)
            {
                const objectPair = imageAndMaskPairs[index]
                // Load local image from train data
                const image = await directoryHelper.getImage(objectPair.image.path + "\\filled\\" + objectPair.image.name)
                // 
                await imageHelper.cropSquareAroundMark(image, objectPair.image)
            }
        }

    }
}



module.exports = modelTrainer

// Deprecated code

// const getCurrentImageMaskPath = (imageName) =>
//     {
//         const fileID = getNumber(imageName)
//         const fileObject = maskFiles.find((file) =>
//         {
//             if (file.name.includes(fileID))
//             {
//                 return file
//             }
//         })
//         return (fileObject.path + fileObject.name)
//     }
//     const getNumber = (string) =>
//     {
//         let regex = string.match(/\d+/)
//         let number = parseInt(regex ? regex[0] : null)
//         return number
//     }

//files = directoryHelper.removeDirectoriesFromListing(files)
    //let maskFiles = []

    // split masks and files in two arrays
    // for (let index = 0; index < files.length; index++)
    // {
    //     const fileObject = files[index];
    //     if (fileObject.name.includes("mask")) 
    //     {
    //         maskFiles.push(fileObject)
    //         files.splice(index, 1);
    //         index--
    //     }
    // }