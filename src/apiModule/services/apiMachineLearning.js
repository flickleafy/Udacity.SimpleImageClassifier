const apiModel = require('../model/apiModel');

const modelClassifier = require('../../machineModule/modelClassifier')

apiMachineLearning = {}

apiMachineLearning.classifySingleImage = async (req, res) =>
{
    checkFileType(req, res);
    const simpleImageClassifier = req.app.locals.tensorflowHandler
    const fileObject = newFileObject(req.file)
    const mlObject = await modelClassifier.singleImageClassification(fileObject, simpleImageClassifier)

    if (mlObject.prediction)
    {
        res.send(mlObject);
    }
    else
    {
        noPredictionResponse(res);
    }
};

apiMachineLearning.classifyMultipleImages = async (req, res) =>
{
    const rejectedFiles = checkFileType(req, res);
    const simpleImageClassifier = req.app.locals.tensorflowHandler
    const files = newFilesObjectArray(req.files)
    const mlObjectArray = await modelClassifier.multipleImageClassification(files, simpleImageClassifier)

    if (mlObjectArray.length)
    {
        res.send({ classified: mlObjectArray, rejected: rejectedFiles });
    }
    else
    {
        noPredictionResponse(res);
    }
};

const newFileObject = (file) =>
{
    const fileObject = {
        path: file.destination + "/",
        name: file.filename,
        originalName: file.originalname
    }
    return fileObject
}

const newFilesObjectArray = (files) =>
{
    const filesObject = []
    for (let index = 0; index < files.length; index++) 
    {
        const fileElement = files[index];
        filesObject.push(newFileObject(fileElement))
    }
    return filesObject
}

const checkFileType = (req, res) =>
{
    let rejectedFiles = []
    if (req.file)
    {
        if (!req.file.originalname.match(/\.(png|jpg|jpeg)$/))
        {
            res.status(400).send({ message: 'Data that was sent is not an image', });
        }
    }
    else if (req.files)
    {
        for (let index = 0; index < req.files.length; index++)
        {
            const fileElement = req.files[index];
            if (!fileElement.originalname.match(/\.(png|jpg|jpeg)$/))
            {
                rejectedFiles.push(fileElement)
                req.files.splice(index, 1);
                index--
            }
        }

        if (req.files.length == 0)
        {
            res.status(400).send({ message: 'Data that was sent is not an image', });
        }
        else 
        {   // There are images to be processed yet
            return rejectedFiles
        }
    }
}


const noPredictionResponse = (res) =>
{
    res.status(500).send({ message: 'No available predictions' });
}

module.exports = apiMachineLearning



