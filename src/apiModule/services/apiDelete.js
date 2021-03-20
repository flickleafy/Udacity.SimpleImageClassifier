const apiDelete = {}

apiDelete.deleteTransactionById = async (req, res) =>
{
    const id = req.params.id;
    const dbModel = req.app.locals.controllerModuleHandler.dbModel

    try
    {//
        const transaction = await dbModel.findByIdAndDelete(id);
        if (!transaction)
        {
            return res.status(404).send({ message: 'Transaction não encontrada' });
        } else
        {
            res.send({ message: 'Transaction excluida com sucesso' });
        }
        //logger.info(`DELETE /transaction - ${id}`);
    } catch (error)
    {
        res.status(500).send({ message: 'Nao foi possivel deletar a transaction: ' + id });
        // logger.error(`DELETE /transaction - ${JSON.stringify(error.message)}`);
    }
};

apiDelete.removeAllTransactionsInPeriod = async (req, res) =>
{
    const period = req.query.period;
    const dbModel = req.app.locals.controllerModuleHandler.dbModel

    //condicao para o filtro no findAll
    let filter = period ? { name: { $regex: new RegExp(period), $options: 'i' } } : {};
    try
    {
        //
        //const transaction = await TransactionModel.deleteMany(filter);
        //
        res.send({ message: `Transactions excluidos`, });
        //logger.info(`DELETE /transactions`);
    } catch (error)
    {
        res.status(500).send({ message: 'Erro ao excluir todas as transactions do periodo: ' + period, });
        // logger.error(`DELETE /transactions - ${JSON.stringify(error.message)}`);
    }
};

module.exports = apiDelete