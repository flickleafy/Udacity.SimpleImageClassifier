const path = require('path');
const url = require('url')
const fs = require('fs');

const directoryHelper = {}

directoryHelper.listing = async (basePath) => 
{
    let filesPath = []
    // resolve to absolute path
    const directoryPath = path.resolve(basePath)

    // passsing directoryPath getting all files
    const files = fs.readdirSync(directoryPath);

    if (files)
    {
        // listing all files using forEach
        files.forEach((file) =>
        {
            // array of file objects composed of absolute path and file name
            filesPath.push({ path: directoryPath + "\\", name: file })
        });
    }
    return filesPath
}

directoryHelper.filePathToURL = (filePath) =>
{
    const link = url.pathToFileURL(filePath)
    return link
}
directoryHelper.URLtoFilePath = (url) =>
{
    const filePath = url.fileURLToPath(url)
    return filePath
}

directoryHelper.loadJSON = async (filePath) =>
{
    let data = null, json = null
    try
    {
        data = await fs.readFileSync(filePath);
        json = JSON.parse(data);
    } catch (error)
    {
        console.error(error)
    }
    return json
}

module.exports = directoryHelper