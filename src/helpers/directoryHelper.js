const path = require('path');
const fs = require('fs');

const directoryHelper = {}

directoryHelper.listing = async (basePath) => 
{
    let filesPath = []
    //joining path of directory 
    const directoryPath = path.resolve(basePath)

    //passsing directoryPath and callback function
    const files = fs.readdirSync(directoryPath);

    if (files)
    {
        //listing all files using forEach
        files.forEach(function (file)
        {
            filesPath.push({ path: directoryPath + "\\", name: file })
        });
    }
    return filesPath
}

module.exports = directoryHelper