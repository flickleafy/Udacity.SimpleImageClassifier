const apiModel = require('../model/apiModel');
const helper = require('./apiHelpers')

const apiInsert = {}

apiInsert.insertTransaction = async (req, res) =>
{
    try
    {//
        let newTransactionJSON = helper.newTransaction(req.body);
        const transaction = new apiModel(newTransactionJSON);
        await transaction.save();
        res.send(transaction);
        //
        //logger.info(`POST /transaction - ${JSON.stringify()}`);
    } catch (error)
    {
        res.status(500).send({ message: error.message || 'Algum erro ocorreu ao salvar transaction', });
        // logger.error(`POST /transaction - ${JSON.stringify(error.message)}`);
    }
};

module.exports = apiInsert