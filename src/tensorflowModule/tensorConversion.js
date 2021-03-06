const tensorflow = require('@tensorflow/tfjs-node-gpu');// Load the binding (GPU computation)
// require('@tensorflow/tfjs')

const tensorConversion = {}

tensorConversion.imageTo3dTensor = (image) =>
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

module.exports = tensorConversion