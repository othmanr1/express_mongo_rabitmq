const Msg = require('../models/msg.model')
const amqp = require('amqplib');

exports.create = async (req, res) => {
   
    // Create a Msg
    const msg = new Msg({
      
      msgDesc: req.body.msgDesc      
    });
  
    // Save  Msg into DB
    await msg
      .save()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Msg."
        });
      });
  };

  exports.send = async (req,res) => {
    // Create a Msg
    const msg = new Msg({
       
     msgDesc: req.body.msgDesc      
   });
 
   // Save  Msg into DB
   await msg
     .save()
     .then(data => {
       res.send(data);
     })
     .catch(err => {
       res.status(500).send({
         message:
           err.message || "Some error occurred while creating the Msg."
       });
     });
 
     const conn = await amqp.connect('amqp://localhost');
     const channel = await conn.createChannel();
     await channel.assertQueue('msg');
     await channel.sendToQueue('msg' , Buffer.from(JSON.stringify(msg)));
     console.log('msg has been sent ');
     await channel.close();
     await conn.close();
 
 }

exports.senddirect = async (req, res) => {
  try {
    // Create a new message object
    const msg = new Msg({ msgDesc: req.body.msgDesc });

    // Save the message to the database
    await msg.save();

    // Publish the message to the direct exchange
    const conn = await amqp.connect('amqp://localhost');
    const channel = await conn.createChannel();
    await channel.assertExchange('direct_logs', 'direct', { durable: false });
    await channel.publish('direct_logs', 'info', Buffer.from(JSON.stringify(msg)));
    console.log(`Message sent to exchange: ${JSON.stringify(msg)}`);

    // Close the channel and connection
    await channel.close();
    await conn.close();

    // Send a response to the client
    res.send(msg);
  } catch (error) {
    console.error(`Error sending message: ${error}`);
    res.status(500).send({
      message: error.message || 'Error sending message',
    });
  }
};

exports.sendFanout = async (req, res) => {
  // Create a Msg
  const msg = new Msg({
    msgDesc: req.body.msgDesc,
  });

  // Save Msg into DB
  try {
    const data = await msg.save();
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating the Msg.',
    });
    return;
  }

  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();
  const exchangeName = 'fanout_logs';

  // Assert a fanout exchange
  await channel.assertExchange(exchangeName, 'fanout', { durable: false });

  // Publish the message to the exchange
  const message = JSON.stringify(msg);
  await channel.publish(exchangeName, '', Buffer.from(message));
  console.log(`Sent message '${message}' to exchange '${exchangeName}'`);

  await channel.close();
  await conn.close();
};
exports.sendTopic = async (req, res) => {
  const { msgDesc, routingKey } = req.body;

  if (!msgDesc || !routingKey) {
    return res.status(400).send({ message: 'Message description and routing key are required.' });
  }

  // Create a message
  const message = { msgDesc };

  try {
    // Save message to DB
    const savedMsg = await Msg.create({ msgDesc, routingKey });
    console.log('Message saved:', savedMsg);
  } catch (err) {
    console.error('Failed to save message:', err);
    return res.status(500).send({ message: 'Failed to save message.' });
  }

  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertExchange('topic_logs', 'topic', { durable: false });
    channel.publish('topic_logs', routingKey, Buffer.from(JSON.stringify(message)));
    console.log('Sent message:', message);

    // Close the channel and connection
    await channel.close();
    await connection.close();

    return res.send({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Failed to send message:', error);
    return res.status(500).send({ message: 'Failed to send message.' });
  }
};















