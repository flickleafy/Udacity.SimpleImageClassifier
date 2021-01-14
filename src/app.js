// Simple example of machine learning, image classification

const simpleImageClassifier = require('./simpleImageClassifier/machineLearning')
const modelTrainer = require('./simpleImageClassifier/modelTrainer')
const directoryHelper = require('./helpers/directoryHelper')
const imageHelper = require('./helpers/imageHelper')

const pathTestData = "./res/testData"
const pathTrainData = "./res/trainData"
const pathTrainedModel = "./res/trainedModel"

modelTrainer.initialize(pathTrainData, pathTrainedModel)

directoryHelper.listing(pathTestData).then(async (files) =>
{
    await simpleImageClassifier.initialize(pathTrainData, pathTrainedModel)

    directoryHelper.removeDirectoriesFromListing(files)

    if (files)
    {
        for (let index = 0; index < files.length; index++)
        {
            const fileObject = files[index];

            // Load local image from our resources
            const image = await directoryHelper.getImage(fileObject.path + fileObject.name)

            if (image) 
            {
                // Preprocess image, cropping
                const preprocessed = await imageHelper.cropSquare(image, fileObject)

                // Predict in what class our photo is
                const predictions = await simpleImageClassifier.classify(preprocessed)

                if (predictions)
                {
                    console.log("The predictions of the photo ", fileObject.name, " are: ")
                    for (let index = 0; index < predictions.length; index++)
                    {
                        const prediction = predictions[index];
                        console.log("class: ", prediction.className,
                            "\nprobability: ", prediction.probability)
                    }
                    console.log("\n")
                }
            }
            else
            {
                console.error("image not loaded");

            }
        }
    }
})
