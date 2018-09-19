/**
 * Application server.
 * Author: Davi Laerte
 */

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const swagger = require('swagger-express');
const cors = require('cors');
const userRouter = require('./controllers/userController');

const app = express();
const port = process.env.PORT || 3000;
const environment = process.env.ENVIROMENT || 'development';

if (environment !== 'production') {
  console.log('The system is not running in production!');
}

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(cors());

app.use(
  swagger.init(app, {
    apiVersion: '1.0',
    swaggerVersion: '1.0',
    basePath: 'http://localhost:' + port,
    swaggerURL: '/docs/api',
    swaggerJSON: '/api-docs.json',
    swaggerUI: './public/swagger/',
    apis: ['./controllers/userController.js']
  })
);

app.use('/static', express.static('./static'));

app.use('/user', userRouter);

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;