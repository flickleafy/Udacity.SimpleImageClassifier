const jimp = require('jimp')

imageLoader = {}

imageLoader.getImage = async (filePath) =>
{
    let imageData = null
    try
    {
        imageData = await jimp.read(filePath)
    } catch (error)
    { console.error(error) }

    return imageData
}

module.exports = imageLoader