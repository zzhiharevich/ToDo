const express = require('express');
const bodyParser = require('body-parser');
const mysql = require("mysql2");
const SQL_Handler = require('./SQL_Handler');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

sql_handler = new SQL_Handler();

const get_login = function (callback) {
  sql_handler.get_login(function (result) { 
    
  });
}

app.post('/authorization', (req, res) => {

  sql_handler.connect();

  sql_handler.get_login(function (result) { 
    if(result == req.body.login){
      res.send(
        `Login: ${result} Password: ${req.body.password}`
      );
    } else {
      res.send('Do not correct login or password. Please try again!');
    }
  });

  sql_handler.disconnect();
});

app.post('/create_account', (req, res) => {
  console.log(req.body);
  res.send(
    `Name: ${req.body.name} \nLogin: ${req.body.login} \nPassword: ${req.body.password}`,
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));