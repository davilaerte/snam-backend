const express = require('express')
const app = express()
const port = 8000

app.get('/', (req, res) => {
  res.statusCode = 200;
  res.json({ users: [{ nome: 'Davi', senha: '1234' }, { nome: 'Lucas', senha: '1334' }] })
});

app.get('/user', (req, res) => {
  res.statusCode = 200;
  res.json({ nome: 'Davi', senha: '1234' })
});

app.post('/user', (req, res) => res.send('Got a POST request'))

app.put('/user', (req, res) => res.send('Got a PUT request'))

app.delete('/user', (req, res) => res.send('Got a DELETE request'))

app.listen(port, () => console.log('App listening on port ' + port + '!'))