const express = require('express')
const route = express.Router()
const role = require('../controllers/role.controller')



route.get('/find', role.findAll);
route.post('/Add', role.create);

module.exports = route;