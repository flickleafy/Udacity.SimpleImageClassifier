const helpers = require('./helpers')

const apiUpdate = {}

apiUpdate.updateTransactionById = async (req, res) =>
{
    const id = req.params.id;
    const dbModel = req.app.locals.controllerModuleHandler.dbModel

    if (!req.body)
    {
        return res.status(400).send({ message: 'Dados da transaction inexistente', });
    }

    let newTransactionJSON = helpers.newTransaction(req.body);

    let transaction = null;
    try
    {
        transaction = await dbModel.findByIdAndUpdate(id, newTransactionJSON);
        //
        res.send({ message: 'Transaction atualizada com sucesso' });

        //logger.info(`PUT /transaction - ${id} - ${JSON.stringify(req.body)}`);
    } catch (error)
    {
        res.status(500).send({ message: 'Erro ao atualizar a transaction: ' + id });
        // logger.error(`PUT /transaction - ${JSON.stringify(error.message)}`);
    }
};

module.exports = apiUpdate