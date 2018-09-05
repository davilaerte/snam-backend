const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 8000;

module.exports = app;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

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

app.put('/user', (req, res) => res.send('Got a PUT request'))

app.delete('/user', (req, res) => res.send('Got a DELETE request'))

app.listen(port, () => console.log('App listening on port ' + port + '!'))