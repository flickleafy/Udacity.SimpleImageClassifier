const helpers = require('./helpers')

const apiMachine = {}

apiMachine.classifySingleImage = async (req, res) =>
{
    if (helpers.checkFileType(req, res))
    {
        const singleImageClassification = req.app.locals.controllerModuleHandler.singleImageClassification
        // const dbModel = req.app.locals.controllerModuleHandler.dbModel

        // try
        // {
        //     let newTransactionJSON = helpers.newTransaction({ description: "teste", value: 5, category: "", year: 2020, month: 5, day: 1, type: "expense" });

        //     const transaction = new dbModel(newTransactionJSON);
        //     await transaction.save();
        // } catch (error)
        // {
        //     console.error(error)
        // }

        const fileObject = helpers.newFileObject(req.file)
        const mlObject = await singleImageClassification(fileObject)

        if (mlObject.prediction)
        {
            res.send(mlObject);
        }
        else
        {
            noPredictionResponse(res);
        }
    }
    else
    {
        notImageDataResponse()
    }
}

apiMachine.classifyMultipleImages = async (req, res) =>
{
    const rejectedFiles = helpers.checkFileType(req, res);

    if (rejectedFiles)
    {
        const multipleImageClassificationV = req.app.locals.controllerModuleHandler.multipleImageClassificationV
        const dbModel = req.app.locals.controllerModuleHandler.dbModel

        const files = helpers.newFilesObjectArray(req.files)
        const mlObjectArray = await multipleImageClassificationV(files)
        //const mlObjectArray = await multipleImageClassificationMT1(files)

        if (mlObjectArray.length)
        {
            res.send({ classified: mlObjectArray, rejected: rejectedFiles });
        }
        else
        {
            noPredictionResponse(res);
        }
    }
    else
    {
        notImageDataResponse()
    }
}

const notImageDataResponse = () =>
{
    res.status(400).send({ message: 'Data that was sent is not an image', });
}

const noPredictionResponse = (res) =>
{
    res.status(500).send({ message: 'No available predictions' });
}

module.exports = apiMachine



