const express = require('express')
const route = express.Router()
const auth = require("../middleware/auth");
var guard = require('express-jwt-permissions')()
const usr = require('../controllers/user.controller')
const role = require('../controllers/role.controller')

route.get('/', auth, guard.check('admin'), usr.findAll);


route.get('/find', role.findAll);
route.post('/Add', role.create);

module.exports = route;