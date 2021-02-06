const tensorflow = require('@tensorflow/tfjs')// Load the binding (CPU computation)
require('@tensorflow/tfjs-node-gpu');

const IMAGE_SIZE = 224;

const tensorReshape = {}

tensorReshape.expandDimension = (tensor) =>
{
    return tensorflow.expandDims(tensor, 0)
}

tensorReshape.normalizeAndReshapeImgTensor = (tensor3d) =>
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

module.exports = tensorReshape