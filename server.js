const express = require('express');
const bodyParser = require('body-parser');
const mysql = require("mysql2");
const SQL_Handler = require('./SQL_Handler');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

sql_handler = new SQL_Handler();

app.post('/authorization', (req, res) => {
  //console.log(req.body);
  sql_handler.connect();
  var login = '';
  sql_handler.get_login( (result) => login = result );
  console.log('Server login: ' + login);

  res.send(
    `Login: ${req.body.login} \nPassword: ${req.body.password}`,
  );
  sql_handler.disconnect();
});

app.post('/create_account', (req, res) => {
  console.log(req.body);
  res.send(
    `Name: ${req.body.name} \nLogin: ${req.body.login} \nPassword: ${req.body.password}`,
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));