const User = require('../models/usersAuth.model')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req,res)=>{
    try {
      // Get user input
      const { email, password } = req.body;
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      const user = await User.findOne({ email }).populate("role");  
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
       
        const token = jwt.sign(
          { user_id: user._id, 
            email, 
            permissions: user.role.map(r=>r.roleCode) },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );  
        user.token = token;
        res.status(200).send({
          user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            permissions:  user.role.map(r=>r.roleCode),
          },
          message: "Login successfull.",
          accessToken: token,
        });
      }
      else
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
  };

exports.subscribe = async (req,res)=>{
    try {
      const { fullName,role, email, password } = req.body;
      if (!(email && password && fullName && role)) {
        res.status(400).send("All input is required");
      }
      const oldUser = await User.findOne({ email });
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      } 
      encryptedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        fullName : fullName ,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
        role:role
      });  
      const token = jwt.sign(
                { user_id: user._id, email }, 
                process.env.TOKEN_KEY,
                {expiresIn: "2h"}
      );
      user.token = token;  
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }  
    
   
  }

exports.findAll = (req, res) => {
    console.log('h')
     
      User.find()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the user."
        });
      });
   
    
  };