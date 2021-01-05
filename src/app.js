// Simple example of deep learning, image classification
const simpleImageClassifier = require('./simpleImageClassifier/deepLearning')
const imagePreprocessing = require('./simpleImageClassifier/imagePreprocessing')
const directoryHelper = require('./helpers/directoryHelper')

directoryHelper.listing("./res/").then(async (files) =>
{
    await simpleImageClassifier.initialize()
    if (files)
    {
        for (let index = 0; index < files.length; index++)
        {
            const file = files[index];

            const tensor = await imagePreprocessing.imageTensor(file.path + file.name)

            //Predict in what class our photo is
            const predictions = await simpleImageClassifier.predict(tensor)

            console.log("The predictions of the photo ", file.name, " are: ")
            for (let index = 0; index < predictions.length; index++)
            {
                const prediction = predictions[index];
                console.log("class: ", prediction.className, "\nprobability: ", prediction.probability)
            }
            console.log("\n")
        }
    }
})
