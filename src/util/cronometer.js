const timings = []

const cronometer = {}

cronometer.start = () =>
{
    timings.push(Date.now())
}

cronometer.leap = (functionName) =>
{
    let current = Date.now()
    let previous = timings[timings.length - 1]
    timings.push(current)
    let elapsed = ((current - previous) / 1000)
    console.info(`Processing time of ${functionName}: ${elapsed}`)
}

module.exports = cronometer