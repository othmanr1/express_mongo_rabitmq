const Msg = require('../models/msg.model')


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

