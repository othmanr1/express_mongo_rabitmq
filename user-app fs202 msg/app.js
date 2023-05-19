const express = require('express');
const errorshandle = require('./middleware/errors')
const app = express();


const db = require("./config/db")
const amqp = require("amqplib");






app.use(express.json())
app.use(express.urlencoded({ extended: true }));


const MsgRoute = require('./routes/msg.route')
app.use('/msg',MsgRoute);



db.connect();


async function  recivedirect(){
  
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();
  
  const directExchange = 'direct_logs';
  const directQueue = 'direct_queue';
  const directRoutineKey = 'info';
  
  channel.assertExchange(directExchange , 'direct' , {durable : false});
  channel.assertQueue(directQueue, {exclusive:true});
  channel.bindQueue(directQueue , directExchange , directRoutineKey);
  
  channel.consume(directQueue,  (msg) => {
    console.log(`Received message from direct exhange with routing key "${directRoutineKey}":`,
    JSON.parse(msg.content.toString()));
    
    
    
  }, {noAck:true});
  
  console.log('Waiting for messages...');
  
}
async function recivedfanout (){
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();
  
  const fanoutExchange = 'fanout_logs';
  const fanoutQueue = 'direct_queue';
  
  
  channel.assertExchange(fanoutExchange , 'fanout' , {durable : false});
  channel.assertQueue(fanoutQueue, {exclusive:true});
  channel.bindQueue(fanoutQueue , fanoutExchange , '' );
  
  channel.consume(fanoutQueue,  (msg) => {
    console.log(`Received message from fanout exhange with routing key `,
    JSON.parse(msg.content.toString()));
    
    
    
  }, {noAck:true});
  
  console.log('Waiting for messages...');
}
async function receivedtopic() {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  // Direct exchange
  const topicExchange = 'topic_logs';
  const topicQueue = 'topic_queue';
  const topicRoutingKey = 'info.*';
  channel.assertExchange(topicExchange, 'topic', { durable: false });
   channel.assertQueue(topicQueue, { exclusive: true });
   channel.bindQueue(topicQueue, topicExchange, topicRoutingKey);
   channel.consume(topicQueue, (message) => {
     console.log(`Received message from topic exchange with routing key "${message.fields.routingKey}":`, JSON.parse(message.content.toString()));
    }, { noAck: true });
    
  }
  // recivedirect();
  // recivedfanout();
   receivedtopic();
  
  app.use(errorshandle);
  app.listen(process.env.APP_PORT);
  