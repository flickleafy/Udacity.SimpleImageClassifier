const tensorflow = require('@tensorflow/tfjs')// Load the binding (CPU computation)
require('@tensorflow/tfjs-node-gpu');
const IMAGE_SIZE = 224;

const tensorHelper = {}
tensorHelper.imageTo3dTensor = (image) =>
{
    const numChannels = 3;
    const numPixels = image.bitmap.width * image.bitmap.height;
    let values = new Int32Array(numPixels * numChannels);
    let pixels = image.bitmap.data

    for (let i = 0; i < numPixels; i++)
    {
        for (let channel = 0; channel < numChannels; ++channel)
        {
            values[i * numChannels + channel] = pixels[i * 4 + channel];
        }
    }
    const outShape = [image.bitmap.height, image.bitmap.width, numChannels];
    const tensor3d = tensorflow.tensor3d(values, outShape, 'int32');

    // Release memory
    pixels = null
    values = null

    return tensor3d
}

tensorHelper.loadModel = async (pathTrainedModel) =>
{
    let model = null
    try
    {
        model = await tensorflow.loadLayersModel("file://" + pathTrainedModel)
        model.summary()
    } catch (error)
    { console.error(error) }
    return model
}

tensorHelper.saveModel = async (createdModel, pathTrainedModel) =>
{
    let model = null
    try
    {
        model = await tensorflow.model(createdModel)
        await model.save("file://" + pathTrainedModel)
    } catch (error)
    { console.error(error) }
}

tensorHelper.expandDimension = (tensor) =>
{
    return tensorflow.expandDims(tensor, 0)
}

tensorHelper.normalizeAndReshapeImgTensor = (tensor3d) =>
{
    const inputMin = -1, inputMax = 1
    const normalizationConstant = (inputMax - inputMin) / 255.0
    // Normalize the image from [0, 255] to [inputMin, inputMax].
    let normalized = tensor3d.toFloat().mul(normalizationConstant).add(inputMin);

    // Resize the image to
    let resized = normalized;
    if (tensor3d.shape[0] !== IMAGE_SIZE || tensor3d.shape[1] !== IMAGE_SIZE)
    {
        const alignCorners = true;
        resized = tensorflow.image.resizeBilinear(normalized, [IMAGE_SIZE, IMAGE_SIZE], alignCorners);
    }
    // Reshape so we can pass it to predict.
    const reshaped = resized.reshape([-1, IMAGE_SIZE, IMAGE_SIZE, 3]);

    // Release memory
    normalized.dispose()
    resized.dispose()
    normalized = null
    resized = null

    return reshaped
}

tensorHelper.getTop3Classes = async (labels, logits) =>
{
    const classes = (labels.length <= 3) ? labels.length : 3
    const softmax = logits.softmax();
    const values = await softmax.data();
    softmax.dispose();

    const valuesAndIndices = [];
    for (let i = 0; i < values.length; i++)
    {
        valuesAndIndices.push({ value: values[i], index: i });
    }
    valuesAndIndices.sort((a, b) =>
    {
        return b.value - a.value;
    });
    const top3Values = new Float32Array(classes);
    const top3Indices = new Int32Array(classes);
    for (let i = 0; i < classes; i++)
    {
        top3Values[i] = valuesAndIndices[i].value;
        top3Indices[i] = valuesAndIndices[i].index;
    }

    const topClassesAndProbs = [];
    for (let i = 0; i < top3Indices.length; i++)
    {
        topClassesAndProbs.push({
            className: labels[top3Indices[i]],
            probability: top3Values[i]
        });
    }
    return topClassesAndProbs;
}

tensorHelper.customClassification = async (tensor3d, model, labels) =>
{
    let normalizedTensor = tensorHelper.normalizeAndReshapeImgTensor(tensor3d)

    let logits = model.predict(normalizedTensor);
    // try
    // {
    //     // Remove the very first logit (background noise).
    //     logits = logits.slice([0, 1], [-1, 2]);
    // } catch (error)
    // { console.error(error) }
    const predictions = await tensorHelper.getTop3Classes(labels, logits);

    // Release memory
    normalizedTensor.dispose()
    logits.dispose()
    normalizedTensor = null
    logits = null

    return predictions
}

module.exports = tensorHelper