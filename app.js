/**
 * Application server.
 * Author: Davi Laerte
 */

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const swagger = require('swagger-express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const environment = process.env.ENVIROMENT || 'development';

if (environment !== 'production') {
  console.log('The system is not running in production!');
}

module.exports = app;

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
    apis: ['./api.js']
  })
);

app.use('/static', express.static('./static'));

app.get('/', (req, res) => {
  res.status(200).json({ users: [{ nome: 'Davi', senha: '1234' }, { nome: 'Lucas', senha: '1334' }] });
});

app.get('/user', (req, res) => {
  res.status(200).json({ nome: 'Davi', senha: '1234' });
});

app.post('/user', (req, res) => {
  let response = req.body;
  response.received = true;
  res.status(200).json(response);
});

app.put('/user', (req, res) => res.send('Got a PUT request'));

app.delete('/user', (req, res) => res.send('Got a DELETE request'));

app.listen(port, () => console.log(`App listening on port ${port}!`));