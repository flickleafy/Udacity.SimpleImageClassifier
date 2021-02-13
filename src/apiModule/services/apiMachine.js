const apiModel = require('../model/apiModel');

const apiMachine = {}

apiMachine.classifySingleImage = async (req, res) =>
{
    checkFileType(req, res);
    const controllerModuleHandler = req.app.locals.controllerModuleHandler
    const fileObject = newFileObject(req.file)
    const mlObject = await controllerModuleHandler.singleImageClassification(fileObject)

    if (mlObject.prediction)
    {
        res.send(mlObject);
    }
    else
    {
        noPredictionResponse(res);
    }
};

apiMachine.classifyMultipleImages = async (req, res) =>
{
    const rejectedFiles = checkFileType(req, res);
    const controllerModuleHandler = req.app.locals.controllerModuleHandler

    const files = newFilesObjectArray(req.files)
    const mlObjectArray = await controllerModuleHandler.multipleImageClassificationV(files)
    //const mlObjectArray = await controllerModuleHandler.multipleImageClassificationMT1(files)

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

module.exports = apiMachine



