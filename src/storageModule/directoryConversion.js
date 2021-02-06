const url = require('url')

const directoryConversion = {}

directoryConversion.filePathToURL = (filePath) =>
{
    const link = url.pathToFileURL(filePath)
    return link
}
directoryConversion.URLtoFilePath = (url) =>
{
    const filePath = url.fileURLToPath(url)
    return filePath
}

