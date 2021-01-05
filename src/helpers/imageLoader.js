const jimp = require('jimp')

const getImage = async (filePath) =>
{
    let imageData = await jimp.read(filePath)
    return imageData
}

module.exports = { getImage }