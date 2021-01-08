imageHelper = {}

imageHelper.averagePixelColorRGB = (imageData) =>
{
    const red = 0, green = 1, blue = 2
    const numPixels = imageData.bitmap.width * imageData.bitmap.height;
    let averageColor = { r: 0, g: 0, b: 0 }
    pixels = imageData.bitmap.data
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

module.exports = imageHelper