
const apiHelpers = {}

// helper functions
apiHelpers.newTransaction = (body) =>
{
    const { description, value, category, year, month, day, type } = body;

    let json = {
        description: description,
        value: value,
        category: category,
        year: year,
        month: month,
        day: day,
        yearMonth: `${year}-${apiHelpers.checkSingleDigit(month)}`,
        yearMonthDay: `${year}-${apiHelpers.checkSingleDigit(month)}-${apiHelpers.checkSingleDigit(day)}`,
        type: type,
    };
    return json;
}

apiHelpers.checkSingleDigit = (number) =>
{
    if (/^\d$/.test(number))
    {
        return `0${number}`;
    }
    return number;
}



apiHelpers.newFileObject = (file) =>
{
    const fileObject = {
        path: file.destination + "/",
        name: file.filename,
        originalName: file.originalname
    }
    return fileObject
}

apiHelpers.newFilesObjectArray = (files) =>
{
    const filesObject = []
    for (let index = 0; index < files.length; index++) 
    {
        const fileElement = files[index];
        filesObject.push(newFileObject(fileElement))
    }
    return filesObject
}


apiHelpers.checkFileType = (req, res) =>
{
    let rejectedFiles = []
    if (req.file)
    {
        if (!req.file.originalname.match(/\.(png|jpg|jpeg)$/))
        {
            return false
        }
    }
    else if (req.files)
    {
        for (let index = 0; index < req.files.length; index++)
        {
            const fileElement = req.files[index];
            if (!fileElement.originalname.match(/\.(png|jpg|jpeg)$/))
            {
                rejectedFiles.push(fileElement)
                req.files.splice(index, 1);
                index--
            }
        }

        if (req.files.length == 0)
        {
            return false
        }
        else 
        {   // There are images to be processed yet
            return rejectedFiles
        }
    }
    return true
}

module.exports = apiHelpers