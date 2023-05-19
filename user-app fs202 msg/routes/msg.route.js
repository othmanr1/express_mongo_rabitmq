const express = require('express')
const route = express.Router()

const msg = require('../controllers/msg.controller')





//send msg 
route.post('/Add', msg.create);
route.post('/Add_msg_rabbitMQ_send', msg.send);
route.post('/Add_msg_rabbitMQ_direct', msg.senddirect);
route.post('/Add_msg_rabbitMQ_fanout', msg.sendFanout);
route.post('/Add_msg_rabbitMQ_topic', msg.sendTopic);
// recive
// route.get('/Add_msg_rabbitMQ_recive', msg.recive);
// route.get('/Add_msg_rabbitMQ_recivedirect', msg.recivedirect);
module.exports = route;