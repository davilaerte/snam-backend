/**
 * Application server.
 * Author: Davi Laerte
 */

const express = require('express');
const swagger = require('swagger-express');
const app = require('./appController');
const mongoose = require('./database/index');
const config = require('./_config');

const environment_bd = process.env.ENVIROMENT_BD || 'development';
const port = process.env.PORT || 3000;
const environment = process.env.ENVIROMENT || 'development';

if (environment !== 'production') {
  console.log('The system is not running in production!');
}

app.use(
  swagger.init(app, {
    apiVersion: '1.0',
    swaggerVersion: '1.0',
    basePath: 'http://localhost:' + port,
    swaggerURL: '/docs/api',
    swaggerJSON: '/api-docs.json',
    swaggerUI: './public/swagger/',
    apis: ['./user/userController.js', './page/pageController.js', './notification/notificationController.js', './description/descriptionController.js', './auth/authController.js']
  })
);

app.use('/static', express.static('./static'));

mongoose.connect(config.mongoURI[environment_bd], { useCreateIndex: true, useNewUrlParser: true }, (err) => {
  if (!err) {
    app.listen(port, () => console.log(`App listening on port ${port}!`));
  } else {
    console.log(err);
  }
});

module.exports = app;