const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./api/routes/router');
const logger = require('./config/logger')(module);

const app = express();
const httpServer = require('http').createServer(app);
const socketIO = require('socket.io');
const io = socketIO(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

const PORT = process.env.PORT || 3001;
const SOCKET_PORT = process.env.SOCKET_PORT || 3002;

/**
 * General Conifguration required for the express and nodejs
 */
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Expose-Headers', 'auth-token');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
app.set('io', io);


/**
 * Establish Connection to MongoDB
 */
const estabDbConnection = async () => {
    try {
        await mongoose.connect('mongodb://mongo:27017/appeatite', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            ssl: false,
            directConnection: true
        });
        console.log('ESTABLISHED DB');
        logger.log('info', 'Mongo DB Connection Established');
    } catch (error) {
        console.log('ERROR DB CONNECTION MONGO');
        logger.log('error', `Mongo DB Connection ERROR, ${JSON.stringify(error)}`);
    }
};
estabDbConnection();


/**
 * Swagger Docs Configuration
 */
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: 'v1.0.0',
            title: 'AppEATite API DOCS',
            description: 'Documentation for APIs used in the Appeatite app.',
            contact: {
                name: 'Jay Vishaal J',
            },
        },
    },
    apis: ['./api/**/*.js'],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use(
    '/api-doc',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
        explorer: false,
        customSiteTitle: 'Appeatite',
        customCss: '.swagger-ui .topbar {display:none}',
    })
);


/**
 * Directing to the routers
 */
app.use('/api', router);

/**
* Error Handling Routes
*/
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});


/**
* Server Listing on Port
*/
app.listen(PORT, '0.0.0.0', async () => {
    console.log(`SERVER  ON ${PORT}`);
    logger.log('info', `server is up and running on port ${PORT}`);
});

httpServer.listen(SOCKET_PORT, '0.0.0.0', async () => {
    console.log(`SOCKET SERVER  ON ${SOCKET_PORT}`);
    logger.log('info', `socket server is up and running on port ${SOCKET_PORT}`);
});


// mongodb://localhost:27017/appeatite?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false
