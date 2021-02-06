const util = require('util')
const sleep = util.promisify(setTimeout);

const pipelineClassifierHorizontalMT = {}

pipelineClassifierHorizontalMT.multipleImageClassificationMT1 = async (files, poolThreadsHandler) =>
{
    let mlObjectArray = []

    if (files)
    {
        await criticalSection1(files, poolThreadsHandler, mlObjectArray)
    }
    return mlObjectArray
}

async function criticalSection1(files, poolThreadsHandler, mlObjectArray)
{
    let start = Date.now();

    for (let index = 0; index < files.length; index++)
    {
        const fileObject = files[index];

        const mlObject = await poolThreadsHandler(fileObject)
        console.log(`File name: ${mlObject.fileName}, prediction: ${mlObject.prediction ? mlObject.prediction[0].className : false}`)
        mlObjectArray.push(mlObject)
    }

    let end = Date.now();
    end = ((end - start) / 1000)
    console.log(`Processing time: ${end}`)
}


pipelineClassifierHorizontalMT.multipleImageClassificationMT2 = async (files, poolThreadsHandler) =>
{
    let mlObjectArray = []

    if (files)
    {
        await criticalSection2(files, poolThreadsHandler, mlObjectArray)
    }
    return mlObjectArray
}

async function criticalSection2(files, poolThreadsHandler, mlObjectArray)
{
    let promiseArray = []

    let start = Date.now();
    for (let index = 0; index < files.length; index++)
    {
        const fileObject = files[index];

        const promise = poolThreadsHandler(fileObject)
        await sleep(1800);
        promiseArray.push(promise)
    }

    for (let index = 0; index < promiseArray.length; index++)
    {
        const promise = promiseArray[index];
        const mlObject = await promise
        console.log(`File name: ${mlObject.fileName}, prediction: ${mlObject.prediction ? mlObject.prediction[0].className : false}`)
        mlObjectArray.push(mlObject)
    }

    let end = Date.now();
    end = ((end - start) / 1000)
    console.log(`Processing time: ${end}`)
}

module.exports = pipelineClassifierHorizontalMT


