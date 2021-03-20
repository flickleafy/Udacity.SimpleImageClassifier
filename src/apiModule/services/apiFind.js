const apiFind = {}

apiFind.findTransactionById = async (req, res) =>
{
    let id = req.params.id;
    const dbModel = req.app.locals.controllerModuleHandler.dbModel

    //condicao para o filtro no findAll
    /*let filter = name
      ? { name: { $regex: new RegExp(name), $options: 'i' } }
      : {};*/
    try
    {//
        const transaction = await dbModel.findById(id);

        if (!transaction)
        {
            return res.status(404).send({ message: 'Transaction não encontrada' });
        } else
        {
            res.send(transaction);
        }
        //
        //logger.info(`GET /transactions`);
    } catch (error)
    {
        res.status(500).send({ message: error.message || 'Erro ao listar a transaction', });
        // logger.error(`GET /transactions - ${JSON.stringify(error.message)}`);
    }
};

apiFind.findAllTransactionsInPeriod = async (req, res) =>
{
    const period = req.params.yearMonth;
    const dbModel = req.app.locals.controllerModuleHandler.dbModel

    try
    { // let regex = new RegExp(req.params.id, 'i');
        let transaction;
        try
        {
            transaction = await dbModel.find({ yearMonth: period }).sort({ day: 1, });
        } catch (error)
        {
            // logger.error(`GET /transactionsInPeriod - ${JSON.stringify(error.message)}`);
        }
        res.send(transaction);
        //
        //logger.info(`GET /transactionsInPeriod - ${period}`);
    } catch (error)
    {
        res.status(500).send({ message: 'Erro ao buscar transações do periodo: ' + period });
        // logger.error(`GET /transactionsInPeriod - ${JSON.stringify(error.message)}`);
    }
};

apiFind.findUniquePeriods = async (req, res) =>
{
    let periods = req;
    const dbModel = req.app.locals.controllerModuleHandler.dbModel

    try
    {
        try
        {
            periods = await dbModel.find({}).distinct('yearMonth');// campos retornados
        } catch (error)
        {
            // logger.error(`GET /transactionsInPeriod - ${JSON.stringify(error.message)}`);
        }

        res.send(periods);
        //
        //logger.info(`GET /transactionsInPeriod - ${period}`);
    } catch (error)
    {
        res.status(500).send({ message: 'Erro ao buscar transações do periodo: ' + periods });
        // logger.error(`GET /transactionsInPeriod - ${JSON.stringify(error.message)}`);
    }
};

module.exports = apiFind