
const tensorReshape = require('./tensorReshape')

const tensorClassification = {}

const getTop3Classes = async (labels, logits) =>
{
    const classes = (labels.length <= 3) ? labels.length : 3
    const softmax = logits.softmax();
    const values = await softmax.data();
    softmax.dispose();

    const valuesAndIndices = [];
    for (let i = 0; i < values.length; i++)
    {
        valuesAndIndices.push({ value: values[i], index: i });
    }
    valuesAndIndices.sort((a, b) =>
    {
        return b.value - a.value;
    });
    const top3Values = new Float32Array(classes);
    const top3Indices = new Int32Array(classes);
    for (let i = 0; i < classes; i++)
    {
        top3Values[i] = valuesAndIndices[i].value;
        top3Indices[i] = valuesAndIndices[i].index;
    }

    const topClassesAndProbs = [];
    for (let i = 0; i < top3Indices.length; i++)
    {
        topClassesAndProbs.push({
            className: labels[top3Indices[i]],
            probability: top3Values[i]
        });
    }
    return topClassesAndProbs;
}

tensorClassification.customClassification = async (tensor3d, model, labels) =>
{
    let normalizedTensor = tensorReshape.normalizeAndReshapeImgTensor(tensor3d)

    let logits = model.predict(normalizedTensor);
    // try
    // {
    //     // Remove the very first logit (background noise).
    //     logits = logits.slice([0, 1], [-1, 2]);
    // } catch (error)
    // { console.error(error) }
    const predictions = await getTop3Classes(labels, logits);

    // Release memory
    normalizedTensor.dispose()
    logits.dispose()
    normalizedTensor = null
    logits = null

    return predictions
}

module.exports = tensorClassification