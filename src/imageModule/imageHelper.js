const jimp = require('jimp')

imageHelper = {}

imageHelper.averagePixelColorRGB = (image) =>
{
    let averageColor = { r: 0, g: 0, b: 0 }
    const red = 0, green = 1, blue = 2

    if (image)
    {
        const numPixels = image.bitmap.width * image.bitmap.height;
        pixels = image.bitmap.data
        //initialize with first pixel
        averageColor.r = pixels[red]
        averageColor.g = pixels[green]
        averageColor.b = pixels[blue]

        for (let i = 0; i < numPixels; i++)
        {
            let pixelRed = pixels[i * 4 + red]
            let pixelGreen = pixels[i * 4 + green]
            let pixelBlue = pixels[i * 4 + blue]
            averageColor.r = averageColor.r + pixelRed;
            averageColor.g = averageColor.g + pixelGreen;
            averageColor.b = averageColor.b + pixelBlue;
        }
        averageColor.r = averageColor.r / numPixels
        averageColor.g = averageColor.g / numPixels
        averageColor.b = averageColor.b / numPixels
    }

    return averageColor
}

imageHelper.pixelColorRGBToHSLfp = (pixelRGB) =>
{
    let pixelHSL = { h: 0, s: 0, l: 0 }
    if (pixelRGB)
    {
        // make r, g, and b fractions of 1
        let red = pixelRGB.r / 255,
            green = pixelRGB.g / 255,
            blue = pixelRGB.b / 255,

            // find greatest and smallest channel values
            channelMin = Math.min(red, green, blue),
            channelMax = Math.max(red, green, blue),
            delta = channelMax - channelMin,
            hue = 0,
            saturation = 0,
            lightness = 0;

        // calculate hue
        // no difference
        if (delta == 0)
        { hue = 0; }
        // red is max
        else if (channelMax == red)
        { hue = ((green - blue) / delta) % 6; }
        // green is max
        else if (channelMax == green)
        { hue = (blue - red) / delta + 2; }
        // blue is max
        else
        { hue = (red - green) / delta + 4; }

        hue = Math.round(hue * 60);

        // make negative hues positive behind 360°
        if (hue < 0)
        { hue += 360; }
        hue = hue / 360
        // calculate lightness
        lightness = (channelMax + channelMin) / 2;

        // calculate saturation
        saturation = delta == 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

        pixelHSL.h = hue, pixelHSL.s = saturation, pixelHSL.l = lightness
        return pixelHSL
    } else
    {
        return -1;
    }
}

imageHelper.imageColorAveragingHSL = async (image) =>
{
    // Get average pixel color of whole image
    const pixelColorRGB = imageHelper.averagePixelColorRGB(image)

    // Convert to the format used in our model
    const pixelColorHSL = imageHelper.pixelColorRGBToHSLfp(pixelColorRGB)

    return pixelColorHSL
}

imageHelper.cropSquare = async (image, fileObject) =>
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

        await image.writeAsync(fileObject.path + "\\cropped\\" + fileObject.name);
    }
    return image
}

imageHelper.cropSquareAroundMark = async (image, fileObject) =>
{
    let frameMark = {
        upperBound: 0, bottomBound: 0,
        leftBound: 0, rightBound: 0
    }
    if (image)
    {
        await scanMarkLimits(image, frameMark);

        image = await centerToNewImage(frameMark, image)

        await image.writeAsync(fileObject.path + "\\cropped-mark\\" + fileObject.name);
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

imageHelper.whiteFill = async (image, imageMask, fileObject) =>
{
    if (image && imageMask)
    {
        await image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (xAxis, yAxis, pixelIndex)
        {
            const pixelColorMask =
                imageMask.bitmap.data[pixelIndex + 0] +
                imageMask.bitmap.data[pixelIndex + 1] +
                imageMask.bitmap.data[pixelIndex + 2]
            if (pixelColorMask <= 100)
            {   // white pixel                
                this.bitmap.data[pixelIndex + 0] = 255; //red
                this.bitmap.data[pixelIndex + 1] = 255; //green
                this.bitmap.data[pixelIndex + 2] = 255; //blue
                //this.bitmap.data[pixelIndex + 3]; // alpha
            }
        });

        await image.writeAsync(fileObject.path + "\\filled\\" + fileObject.name);
    }
    return image
}

module.exports = imageHelper

