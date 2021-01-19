const multer = require('multer');
const express = require('express');
const apiRouter = express.Router();
const apiService = require('../services/ServicesInterface');

const uploadFolder = multer({
    dest: './res/newData',
    limits: { fileSize: 5000000, files: 5 }, // ten files of five Mb each
})
// apiRouter.post('/', apiService.insertTransaction);
// apiRouter.get('/:id', apiService.findTransactionById);
// apiRouter.put('/:id', apiService.updateTransactionById);
// apiRouter.delete('/:id', apiService.deleteTransactionById);

// ?period=2019-03
// apiRouter.get('/period/:yearMonth', apiService.findAllTransactionsInPeriod);
// apiRouter.delete('/period/:yearMonth', apiService.removeAllTransactionsInPeriod);
// apiRouter.post('/periods', apiService.findUniquePeriods);
apiRouter.post('/classifySingleImage', uploadFolder.single('upload'), apiService.classifySingleImage)
apiRouter.post('/classifyMultipleImages', uploadFolder.array('upload', 10), apiService.classifyMultipleImages)



module.exports = apiRouter;
