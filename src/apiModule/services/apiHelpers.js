
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
        yearMonth: `${year}-${checkSingleDigit(month)}`,
        yearMonthDay: `${year}-${checkSingleDigit(month)}-${checkSingleDigit(day)}`,
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

module.exports = apiHelpers