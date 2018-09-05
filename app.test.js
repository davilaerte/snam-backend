const app = require('./app.js');
const request = require('supertest');

request(app)
  .get('/user')
  .expect('Content-Type', /json /)
  .expect('Content-Length', '30')
  .expect(200)
  .end(function (err, res) {
    if (err) throw err;
  });