const tf = require('@tensorflow/tfjs')// Load the binding (CPU computation)

const imageTo3dTensor = (imageData) =>
{
    const numChannels = 3;
    const numPixels = imageData.bitmap.width * imageData.bitmap.height;
    const values = new Int32Array(numPixels * numChannels);
    pixels = pixels = imageData.bitmap.data

    for (let i = 0; i < numPixels; i++)
    {
        for (let channel = 0; channel < numChannels; ++channel)
        {
            values[i * numChannels + channel] = pixels[i * 4 + channel];
        }
    }
    const outShape = [imageData.bitmap.height, imageData.bitmap.width, numChannels];
    const tensor3d = tf.tensor3d(values, outShape, 'int32');
    return tensor3d
}

module.exports = { imageTo3dTensor }