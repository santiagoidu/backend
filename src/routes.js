const express = require('express')

const routes = express.Router()

const Pessoa = require('./controllers/pessoa.controllers')

routes.get('/', Pessoa.index)

//Rotas de pessoas
routes.post('/pessoa', Pessoa.create)
routes.get('/pessoa', Pessoa.index)
routes.get('/pessoa.details/:_id', Pessoa.datails)
routes.delete('/pessoa/:_id', Pessoa.delete)
routes.put('/pessoa/:_id', Pessoa.update)
routes.post('/pessoa/login', Pessoa.login)


module.exports = routes
