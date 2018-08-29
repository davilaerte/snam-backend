const express = require('express')
const app = express()
const port = 8000

app.get('/', (req, res) => res.send(JSON.stringify({ users: [{ nome: 'Davi', senha: '1234' }, { nome: 'Lucas', senha: '1334' }] })))

app.get('/user', (req, res) => res.send(JSON.stringify({ nome: 'Davi', senha: '1234' })))

app.post('/user', (req, res) => res.send())

app.put('/user', (req, res) => res.send())

app.listen(port, () => console.log('App listening on port ' + port + ' !'))