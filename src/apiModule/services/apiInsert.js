const helpers = require('./helpers')

const apiInsert = {}

apiInsert.insertTransaction = async (req, res) =>
{
    const dbModel = req.app.locals.controllerModuleHandler.dbModel
    try
    {//
        let newTransactionJSON = helpers.newTransaction(req.body);
        const transaction = new dbModel(newTransactionJSON);
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