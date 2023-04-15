const express = require('express')
const route = express.Router()

const msg = require('../controllers/msg.controller')






route.post('/Add', msg.create);

module.exports = route;