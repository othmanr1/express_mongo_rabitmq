const express = require('express')
const app = express();
const amqp = require('amqplib');

const db = require("./config/db")
const errorHandler = require('./middleware/errors');
const logger = require('./middleware/logger');

const UserRoute = require('./routes/user.route') 
const RoleRoute = require('./routes/role.route')



app.use((req, res, next) => {
  logger.info({
    message: 'HTTP request',
    method: req.method,
    url: req.url,
    ip: req.ip,
    headers: req.headers
  });
  next();
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use('/users',UserRoute);
app.use('/roles',RoleRoute);


db.connect();
app.use(errorHandler);
app.use(function (err, req, res, next) {
    if (err.code === 'permission_denied') {
      res.status(403).send('Forbidden');
    }
  });
app.listen(process.env.APP_PORT);


async function send(){
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();
  await channel.assertQueue('hello');
  await channel.sendToQueue('hello' , Buffer.from('Hello world FS202'));
  console.log('msg has been sent ');
  await channel.close();
  await conn.close();

}

async function recive(){
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();
  await channel.assertQueue('hello');
  console.log('waiting for responce ... ! ');


  channel.consume('hello' , msg => {

    console.log(`Recived '${msg.content.toString()}' ` );
  } , {noAck:true});
 

}

send();
recive();


