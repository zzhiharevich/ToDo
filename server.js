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
    if (result) {
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

app.get('/create_account', (req, res) =>{
  res.send('open page');
})

app.post('/new-task', (req, res) => {

  sql_handler.get_avaliable_task_number(function(flag, msg2, rows) {
    if(flag) {
      console.log(`Rows: ${rows[0].rowsNumber}`);
      sql_handler.create_new_task(rows[0].rowsNumber, req.body.date, req.body.task, req.body.status, function (result, msg1) {
        if(result) {
          res.json({rowsNumber: rows, msg: msg1});
        } else{
          res.send(msg1);
        }
      });
    } else {
      res.send(msg2);
    }
  });
});

app.post('/task-done', (req,res) => {
  console.log(req.body.status)
  sql_handler.update_task_status(req.body.id, req.body.status, function(flag, msg) {
    if(flag) {
      res.send(msg);
    } else {
      res.send(msg);
    }
  })
})

app.post('/today-page', (req, res) => {
  sql_handler.select_task_by_date(req.body.date, function(flag, msg, result) {
    if(flag) {
      console.log(result)
      res.json(result);
    } else {
      res.send(msg);
    }
  })
})

app.listen(port, () => console.log(`Listening on port ${port}`));