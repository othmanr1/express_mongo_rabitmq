const express = require('express')
const app = express();

const db = require("./config/db")






app.use(express.json())
app.use(express.urlencoded({ extended: true }));


const MsgRoute = require('./routes/msg.route')
app.use('/msg',MsgRoute);



db.connect();
app.use(function (err, req, res, next) {
    if (err.code === 'permission_denied') {
      res.status(403).send('Forbidden');
    }
  });
app.listen(process.env.APP_PORT);

