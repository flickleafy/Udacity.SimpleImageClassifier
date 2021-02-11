
const storageModule = require('../../storageModule/storageInterface')
const imageModule = require('../../imageModule/imageInterface')

const unitWorkerHorizontal = async (fileObject, imageClassifier) =>
{
    let mlObject = null
    // Load local image from our resources
    let image = await storageModule.getImage(fileObject.path + fileObject.name)

    if (image)
    {
        // Preprocess image, cropping
        image = await imageModule.cropSquare(image, fileObject)

        // Predict in what class our photo is
        const predictions = await imageClassifier.classify(image)

        // Release memory
        image = null

        mlObject = { fileName: fileObject.originalName, prediction: predictions }

        if (predictions)
        {
            console.log("The predictions of the photo ", fileObject.originalName, " are: ")
            for (let index = 0; index < predictions.length; index++)
            {
                const prediction = predictions[index]
                console.log("class: ", prediction.className, "\nprobability: ", prediction.probability)
            }
            console.log("\n")
        }
    }
    else { console.error("Failed to load image"); }
    return mlObject
}

module.exports = unitWorkerHorizontal