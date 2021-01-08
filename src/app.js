// Simple example of machine learning, image classification
const simpleImageClassifier = require('./simpleImageClassifier/machineLearning')
const imageLoader = require('./helpers/imageLoader')
const directoryHelper = require('./helpers/directoryHelper')

directoryHelper.listing("./res/testData").then(async (files) =>
{
    await simpleImageClassifier.initialize()
    if (files)
    {
        for (let index = 0; index < files.length; index++)
        {
            const fileObject = files[index];

            // Load local image from our resources
            const image = await imageLoader.getImage(fileObject.path + fileObject.name)

            //Predict in what class our photo is
            const predictions = await simpleImageClassifier.classify(image)

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
    }
})
