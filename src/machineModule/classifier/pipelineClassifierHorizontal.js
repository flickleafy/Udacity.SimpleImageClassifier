
const unitWorkerHorizontal = require('./unitWorkerHorizontal')

const pipelineClassifierHorizontal = {}

pipelineClassifierHorizontal.singleImageClassification = async (fileObject, imageClassifier) =>
{
    let mlObject = null

    mlObject = await unitWorkerHorizontal(fileObject, imageClassifier)

    return mlObject
}

pipelineClassifierHorizontal.multipleImageClassification = async (files, imageClassifier) =>
{
    let mlObjectArray = []

    if (files)
    {
        let start = Date.now();

        for (let index = 0; index < files.length; index++)
        {
            const fileObject = files[index];
            let mlObject = await unitWorkerHorizontal(fileObject, imageClassifier)
            mlObjectArray.push(mlObject)
        }

        let end = Date.now();
        end = ((end - start) / 1000)
        console.log(`Processing time: ${end}`)
    }
    return mlObjectArray
}

module.exports = pipelineClassifierHorizontal


