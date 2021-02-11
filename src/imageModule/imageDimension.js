const jimp = require('jimp')

const imageDimension = {}

imageDimension.cropSquare = async (image, fileObject) =>
{
    if (image)
    {
        const height = image.bitmap.height,
            width = image.bitmap.width,
            isWidthLarge = (width > height) ? 1 : 0
        let difference, xAxisStart = 0, yAxisStart = 0, newWidth, newHeight

        if (isWidthLarge)
        {
            difference = width - height
            xAxisStart = Math.ceil(difference / 2)
            newWidth = newHeight = height
        } else
        {
            difference = height - width
            yAxisStart = Math.ceil(difference / 2)
            newWidth = newHeight = width
        }

        image = await image.crop(xAxisStart, yAxisStart, newWidth, newHeight)

        if (fileObject)
        { await image.writeAsync(fileObject.path + "\\cropped\\" + fileObject.name); }
    }
    return image
}

imageDimension.cropSquareAroundMark = async (image, fileObject) =>
{
    let frameMark = {
        upperBound: 0, bottomBound: 0,
        leftBound: 0, rightBound: 0
    }
    if (image)
    {
        await scanMarkLimits(image, frameMark);

        image = await centerToNewImage(frameMark, image)

        if (fileObject)
        { await image.writeAsync(fileObject.path + "\\cropped-mark\\" + fileObject.name); }
    }
    return image
}

async function scanMarkLimits(image, frameMark)
{
    let lb, rb, ub, bb
    const xAxisPivot = image.bitmap.width / 2, yAxisPivot = image.bitmap.height / 2;
    await image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (xAxis, yAxis, pixelIndex)
    {
        const pixelColor =
            image.bitmap.data[pixelIndex + 0] +
            image.bitmap.data[pixelIndex + 1] +
            image.bitmap.data[pixelIndex + 2];
        if (pixelColor < 750)
        {
            if (xAxis < xAxisPivot)
            {
                frameMark.leftBound = frameMark.leftBound == 0 ? xAxis : frameMark.leftBound;
                if (xAxis < frameMark.leftBound)
                { frameMark.leftBound = (frameMark.leftBound + xAxis) * 0.50; }
            }
            else if (xAxis > xAxisPivot)
            {
                if (xAxis > frameMark.rightBound)
                {
                    frameMark.rightBound = frameMark.rightBound == 0 ? xAxis : frameMark.rightBound;
                    frameMark.rightBound = (frameMark.rightBound + xAxis) * 0.50;
                }
            }
            if (yAxis < yAxisPivot)
            {
                frameMark.upperBound = frameMark.upperBound == 0 ? yAxis : frameMark.upperBound;
                if (yAxis < frameMark.upperBound)
                { frameMark.upperBound = (frameMark.upperBound + yAxis) * 0.50; }
            }
            else if (yAxis > yAxisPivot)
            {
                if (yAxis > frameMark.bottomBound)
                {
                    frameMark.bottomBound = frameMark.bottomBound == 0 ? yAxis : frameMark.bottomBound;
                    frameMark.bottomBound = (frameMark.bottomBound + yAxis) * 0.50;
                }
            }
        }
    });

    lb = Math.ceil(frameMark.leftBound - 10); rb = Math.ceil(frameMark.rightBound + 10)
    ub = Math.ceil(frameMark.upperBound - 10); bb = Math.ceil(frameMark.bottomBound + 10)

    frameMark.leftBound = lb < 0 ? 0 : lb; frameMark.rightBound = rb > image.bitmap.width ? image.bitmap.width : rb
    frameMark.upperBound = ub < 0 ? 0 : ub; frameMark.bottomBound = bb > image.bitmap.height ? image.bitmap.height : bb

    console.log("Done processing: \n", frameMark)
}

async function centerToNewImage(frameMark, image)
{
    let xAxisDistance = 0, yAxisDistance = 0, largerSide = 0

    // Get size whiting mark limits
    xAxisDistance = frameMark.rightBound - frameMark.leftBound;
    yAxisDistance = frameMark.bottomBound - frameMark.upperBound;
    largerSide = (xAxisDistance > yAxisDistance) ? xAxisDistance : yAxisDistance;

    // Prepare to center in a new image frame
    let xAxisPosition = (yAxisDistance > xAxisDistance) ? (yAxisDistance - xAxisDistance) / 2 : 0;
    let yAxisPosition = (xAxisDistance > yAxisDistance) ? (xAxisDistance - yAxisDistance) / 2 : 0;

    let newImage = await new jimp(largerSide, largerSide, 0xffffffff);
    await newImage.blit(image, xAxisPosition, yAxisPosition,
        frameMark.leftBound, frameMark.upperBound,
        frameMark.rightBound, frameMark.bottomBound);

    return newImage;
}

module.exports = imageDimension