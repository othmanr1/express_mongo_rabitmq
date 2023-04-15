const express = require('express')
const app = express();

const db = require("./config/db")

const UserRoute = require('./routes/user.route') 
const RoleRoute = require('./routes/role.route')




app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use('/users',UserRoute);
app.use('/roles',RoleRoute);


db.connect();
app.use(function (err, req, res, next) {
    if (err.code === 'permission_denied') {
      res.status(403).send('Forbidden');
    }
  });
app.listen(process.env.APP_PORT);

