const express = require('express');
const bodyParser = require('body-parser');
const SQL_Handler = require('./SQL_Handler');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

sql_handler = new SQL_Handler();

app.post('/authorization', (req, res) => {

  sql_handler.authentication(function (result, msg) { 
    if(result) {
      res.send(msg);
    } else {
      res.send(`Authorization error. ${msg}`);
    }
  }, req.body.login, req.body.password);

});

app.post('/create_account', (req, res) => {

  sql_handler.create_user(req.body.login, req.body.password, req.body.name, function (result, msg) {
    if (result) {
      res.send(msg);
    } else {
      res.send(msg);
    }
  });

});

app.listen(port, () => console.log(`Listening on port ${port}`));