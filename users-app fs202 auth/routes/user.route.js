const express = require('express')
var guard = require('express-jwt-permissions')()
const route = express.Router()
const auth = require("../middleware/auth");
const usr = require('../controllers/user.controller')


route.get('/findall',
 auth,
//  guard.check('admin'),
  usr.findAll);

route.post('/register', usr.subscribe);
route.post('/login', usr.login);

module.exports = route;