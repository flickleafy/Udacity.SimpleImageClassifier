const averagePixelColorRGB = (imageData) =>
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

const pixelColorRGBToHSLfp = (pixelRGB) =>
{
    let pixelHSL = { h: 0, s: 0, l: 0 }
    if (pixelRGB)
    {
        // make r, g, and b fractions of 1
        let r = pixelRGB.r / 255,
            g = pixelRGB.g / 255,
            b = pixelRGB.b / 255,

            // find greatest and smallest channel values
            cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        // calculate hue
        // no difference
        if (delta == 0)
        { h = 0; }
        // red is max
        else if (cmax == r)
        { h = ((g - b) / delta) % 6; }
        // green is max
        else if (cmax == g)
        { h = (b - r) / delta + 2; }
        // blue is max
        else
        { h = (r - g) / delta + 4; }

        h = Math.round(h * 60);

        // make negative hues positive behind 360°
        if (h < 0)
        { h += 360; }
        h = h / 360
        // calculate lightness
        l = (cmax + cmin) / 2;

        // calculate saturation
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

        pixelHSL.h = h, pixelHSL.s = s, pixelHSL.l = l
        return pixelHSL
    } else
    {
        return -1;
    }
}

module.exports = { averagePixelColorRGB, pixelColorRGBToHSLfp }