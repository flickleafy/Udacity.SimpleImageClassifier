
const unitWorkerHorizontal = require('./unitWorkerHorizontal')
const cronometer = require('../../util/cronometer')

const pipelineClassifierHorizontal = {}

pipelineClassifierHorizontal.singleImageClassification = async (fileObject, imageClassifier) =>
{
    let mlObject = null

    cronometer.start()

    mlObject = await unitWorkerHorizontal(fileObject, imageClassifier)

    cronometer.leap("singleImageClassification")

    return mlObject
}

pipelineClassifierHorizontal.multipleImageClassification = async (files, imageClassifier) =>
{
    let mlObjectArray = []

    if (files)
    {
        cronometer.start()

        for (let index = 0; index < files.length; index++)
        {
            const fileObject = files[index];
            let mlObject = await unitWorkerHorizontal(fileObject, imageClassifier)
            mlObjectArray.push(mlObject)
        }

        cronometer.leap("multipleImageClassification")
    }
    return mlObjectArray
}

module.exports = pipelineClassifierHorizontal


