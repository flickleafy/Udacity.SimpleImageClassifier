
const storageModule = require('../../storageModule/storageInterface')
const imageModule = require('../../imageModule/imageInterface')

const pipelineClassifierVertical = {}

pipelineClassifierVertical.multipleImageClassification = async (files, imageClassifier) =>
{
    let start = Date.now();

    let imageArray = [], preprocessedArray = [], classifiedArray = []

    imageArray = await loadImageData(files)

    preprocessedArray = await preprocessImages(imageArray)

    classifiedArray = await classifyImages(preprocessedArray, files, imageClassifier)

    await printPredictions(files);

    let end = Date.now();
    end = ((end - start) / 1000)
    console.log(`Processing time: ${end}`)

    return classifiedArray
}


const loadImageData = async (files) =>
{
    let images = []
    if (files)
    {
        for (let index = 0; index < files.length; index++) 
        {
            const fileObject = files[index];

            // Load local image from our resources
            let image = await storageModule.getImage(fileObject.path + fileObject.name)

            if (image) { images.push(image) }
            else { console.error("Failed to load image"); }
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
            // Make the image a square
            preprocessed = await imageModule.cropSquare(imageObject, null)

            if (preprocessed) { preprocessedImages.push(preprocessed) }
            else { console.error("Failed to preprocess image"); }
        }
    }
    return preprocessedImages
}

const classifyImages = async (images, files, imageClassifier) =>
{
    let classifiedArray = []
    if (images)
    {
        for (let index = 0; index < images.length; index++) 
        {
            const imageObject = images[index];
            const fileObject = files[index];

            // Predict in what class our photo is
            const predictions = await imageClassifier.classify(imageObject)

            if (predictions)
            {
                classifiedArray.push({ fileName: fileObject.originalName, prediction: predictions })
            }
            else { console.error("Failed to predict image"); }
        }
    }
    return classifiedArray
}

const printPredictions = async (files) =>
{
    if (files)
    {
        for (let index = 0; index < files.length; index++)
        {
            const predictions = files[index];
            if (predictions)
            {
                console.log("The predictions of the photo ", fileObject.originalName, " are: ");
                for (let index = 0; index < predictions.length; index++)
                {
                    const prediction = predictions[index];
                    console.log("class: ", prediction.className, "\nprobability: ", prediction.probability);
                }
                console.log("\n");
            }
        }
    }
}

module.exports = pipelineClassifierVertical