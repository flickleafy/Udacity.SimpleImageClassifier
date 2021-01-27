const directoryHelper = require('../directoryModule/directoryHelper')
const imageHelper = require('../imageModule/imageHelper')

modelClassifier = {}

modelClassifier.singleImageClassification = async (fileObject, simpleImageClassifier) =>
{
    let mlObject = null
    //Load local image from our resources
    let image = await directoryHelper.getImage(fileObject.path + fileObject.name)

    if (image) 
    {
        // Preprocess image, cropping
        image = await imageHelper.cropSquare(image, fileObject)

        // Predict in what class our photo is
        const predictions = await simpleImageClassifier.classify(image)

        // Release memory
        image = null

        mlObject = { fileName: fileObject.originalName, prediction: predictions }

        if (predictions)
        {
            console.log("The predictions of the photo ", fileObject.originalName, " are: ")
            for (let index = 0; index < predictions.length; index++)
            {
                const prediction = predictions[index];
                console.log("class: ", prediction.className,
                    "\nprobability: ", prediction.probability)
            }
            console.log("\n")
        }
    }
    else { console.error("Failed to load image"); }
    return mlObject
}

modelClassifier.multipleImageClassification = async (files, simpleImageClassifier) =>
{
    let mlObjectArray = []
    //const files = await directoryHelper.listing(pathTestData)
    //directoryHelper.removeDirectoriesFromListing(files)

    if (files)
    {
        for (let index = 0; index < files.length; index++)
        {
            const fileObject = files[index];

            // Load local image from our resources
            let image = await directoryHelper.getImage(fileObject.path + fileObject.name)

            if (image) 
            {
                // Preprocess image, cropping
                image = await imageHelper.cropSquare(image, fileObject)

                // Predict in what class our photo is
                const predictions = await simpleImageClassifier.classify(image)

                // Release memory
                image = null

                const mlObject = { fileName: fileObject.originalName, prediction: predictions }
                mlObjectArray.push(mlObject)

                if (predictions)
                {
                    console.log("The predictions of the photo ", fileObject.originalName, " are: ")
                    for (let index = 0; index < predictions.length; index++)
                    {
                        const prediction = predictions[index];
                        console.log("class: ", prediction.className,
                            "\nprobability: ", prediction.probability)
                    }
                    console.log("\n")
                }
            }
            else { console.error("image not loaded"); }
        }
    }
    return mlObjectArray
}

module.exports = modelClassifier

// Deprecated code
// directoryHelper.listing(pathTestData).then(async (files) =>
//     {
//         directoryHelper.removeDirectoriesFromListing(files)

//         if (files)
//         {
//             for (let index = 0; index < files.length; index++)
//             {
//                 const fileObject = files[index];

//                 // Load local image from our resources
//                 const image = await directoryHelper.getImage(fileObject.path + fileObject.name)

//                 if (image) 
//                 {
//                     // Preprocess image, cropping
//                     const preprocessed = await imageHelper.cropSquare(image, fileObject)

//                     // Predict in what class our photo is
//                     const predictions = await simpleImageClassifier.classify(preprocessed)

//                     if (predictions)
//                     {
//                         console.log("The predictions of the photo ", fileObject.name, " are: ")
//                         for (let index = 0; index < predictions.length; index++)
//                         {
//                             const prediction = predictions[index];
//                             console.log("class: ", prediction.className,
//                                 "\nprobability: ", prediction.probability)
//                         }
//                         console.log("\n")
//                     }
//                 }
//                 else
//                 {
//                     console.error("image not loaded");

//                 }
//             }
//         }
//     })
