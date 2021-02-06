
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const path = require('path');
const dotenv = require('dotenv');

const apiModule = {}

apiModule.initialize = async (machineModuleHandler,
    poolThreadsModuleHandler,
    storageModuleHandler) =>
{
    // Read the file ".env"  
    dotenv.config();

    const api = express();
    api.use(cors());
    api.use(express.json());

    api.locals.machineModuleHandler = machineModuleHandler
    api.locals.poolThreadsModuleHandler = poolThreadsModuleHandler
    api.locals.storageModuleHandler = storageModuleHandler

    // Attach to React frontend
    api.use(express.static(path.join(__dirname, 'client/build')));

    // Root path
    api.get('/api/', (_, response) =>
    {
        response.send({ message: 'Wellcome to Machine Learning API', });
    });

    // Main app routes
    api.use('/api/', routes);

    // Data base connection 
    const { DB_CONNECTION } = process.env;

    console.log('Starting connection to MongoDB...');
    mongoose.connect(
        DB_CONNECTION,
        { useNewUrlParser: true, useUnifiedTopology: true, },
        (err) =>
        {
            if (err)
            {
                connectedToMongoDB = false;
                console.error(`MongoDB connection error: ${err}`);
            }
        }
    );

    const { connection } = mongoose;

    connection.once('open', () =>
    {
        connectedToMongoDB = true;
        console.log('Connection to MongoDB');

        // Port definition and API initializing   
        const APP_PORT = process.env.PORT || 3001;
        api.listen(APP_PORT, () =>
        {
            console.log(`Microservice initialized at port ${APP_PORT}`);
        });

    });

}

module.exports = apiModule