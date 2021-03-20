const url = require('url')

const directoryConversion = {}

directoryConversion.filePathToURL = (filePath) =>
{
    const link = url.pathToFileURL(filePath)
    return link
}
directoryConversion.URLtoFilePath = (link) =>
{
    const filePath = url.fileURLToPath(link)
    return filePath
}

