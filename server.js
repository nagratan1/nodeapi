// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const jwt  = require('jsonwebtoken')
// Create an instance of Express
const app = express();
// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));
// Parse JSON bodies
app.use(bodyParser.json());
const mysql = require('mysql');


// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost', // Your MySQL server host, typically 'localhost' for XAMPP
  user: 'root',
  password: '',
  database: 'ratan'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database.');

  // Perform database operations here
  // Example: Execute a query
  
});



// Define a route
app.get('/test', (req, res) => {
    connection.query('SELECT * FROM tb_admin', (err, rows) => {
        if (err) {
          console.error('Error executing query:', err);
          return;
        }
    
        res.status(200).json({
            msg:"Data get Successfullu",
            status_code:200,
            data:rows
        })
      });
   
});
app.post('/signup', (req, res) => {
 console.log(req.body);
 const data = {
  user_name:"Anand",
  password:"12345"
 }
 const {user_name,password} = data;
 console.log(user_name,password)
  console.log(Date.now());

  connection.query('INSERT INTO tb_admin (id, user_name, user_password) VALUES (?, ?, ?)', [Date.now, user_name, password], (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({
              msg: "Error occurred",
              status_code: 500
          });
          return;
      }

      res.status(200).json({
          msg: "Data inserted successfully",
          status_code: 200,
          data: result
      });
  });
});
app.post('/login', (req, res) => {
  const data = {
    user_name:"Anand",
    password:"12345"
   }
   const {user_name,password} = data;
  // Assuming req.body contains user_name and password

  connection.query('SELECT user_name, user_password FROM tb_admin WHERE user_name = ? AND user_password = ?', [user_name, password], (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({
              msg: "Error occurred",
              status_code: 500
          });
          return;
      }

      console.log(result);
      
    let jwtSecretKey = "ratan";
    let data = {
        user_name: result[0]?.user_name,
        user_password:  result[0]?.user_password,
    }
 
    const token = jwt.sign(data, jwtSecretKey);
    
    connection.query('UPDATE tb_admin SET token = ? WHERE user_name = ? AND user_password = ?', [token, data.user_name, data.user_password], (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({
              msg: "Error occurred",
              status_code: 500
          });
          return;
      }

});
      res.status(200).json({
          msg: "Login Successfully",
          status_code: 200,
          token: token,
          type:"Student"
      });
  });
});


app.get('/student-profile', (req, res) => {


console.log(req.headers);

    const {token} = req.headers;
   const data =   {
    token:token,
    type:"Student"
  }
    if(!data.token) return res.status(400).json({
        msg:"TOken is missing"
    })
    if(!data.type) return res.status(400).json({
        msg:"Type is missing"
    })
    console.log("line no 140")
    connection.query('SELECT * FROM tb_admin  WHERE token = ?', [data.token], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({
                msg: "Error occurred",
                status_code: 500
            });
            return;
        }
        if(result.length==0){
            return  res.status(400).json({
                msg:"Invalid token",
                status_code:200,
            })
        }
        const send_data = {user_name:result[0].user_name,password:result[0].user_password}

        res.status(200).json({
            msg:"Data get Successfullu",
            status_code:200,
            data:send_data,
        })
    });

});
app.post('/student-signup', (req, res) => {

    res.status(200).json({
        msg:"Data get Successfullu",
        status_code:200,
        data:[
            {
                name:"Anand Kumar verma",
                age:22,
                phone:7645654756
            },
            {
                name:"Ratan Kumar verma",
                age:22,
                phone:4364564554343
            },
        ]
    })
});
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
