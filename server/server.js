const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
var mysqlStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');

const SQL_Handler = require('./SQL_Handler');

const app = express();

const TWOO_HOURS = 1000 * 60 * 60 * 2;

const options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '111111',
  database: 'to_do_app',
  charset: 'utf8_bin',
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
};

const sessionStore = new mysqlStore(options);

const {
  PORT = 5000,
  NODE_ENV = 'development',
  SESS_NAME = 'sid',
  SESS_SECRET = 'wertyuioplkjhgfdsxcvbn',
  SESS_LIFETIME = TWOO_HOURS
} = process.env

const IN_PROD = NODE_ENV === 'production';

const redirectLogin = (req, res, next) => {
  if (!req.session.user) {
    if (req.get('cookie') != 'undefinded') {
      res.clearCookie(SESS_NAME);
    }
    res.send('redirect');
  } else {
    next();
  }
}

app.use(
  session({
    name: SESS_NAME,
    resave: false,
    store: sessionStore,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
      sameSite: true,
      secure: IN_PROD,
      httpOnly: false,
    }
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'build')));


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

sql_handler = new SQL_Handler();

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('sid');
    res.send('ok');
  });
})

app.post('/start', redirectLogin, (req, res) => {
  res.send('ok');
})

app.post('/authorization', (req, res) => {

  sql_handler.authentication(function (result, msg) {
    if (result) {
      req.session.user = req.body.login;
      res.send(msg);
    } else {
      res.send(`Authorization error. ${msg}`);
    }
  }, req.body.login, req.body.password);

});

app.post('/create_account', (req, res) => {

  sql_handler.create_user(req.body.login, req.body.password, req.body.name, function (result, msg) {
    if (result) {
      req.session.user = req.body.login;
      res.send(msg);
    } else {
      res.send(msg);
    }
  });
});

app.post('/new-task', (req, res) => {

  let id = req.get('cookie').split('=s%3A')[1].split('.')[0];

  sessionStore.get(id, (err, session) => {
    if (err) throw err;
    else if (session.user != null || undefined) {

      sql_handler.get_avaliable_task_number('tasks', function (flag, msg2, rows) {
        if (flag) {
          sql_handler.create_new_task(rows[0].rowsNumber, req.body.date, req.body.task, req.body.status, session.user, function (result, msg1) {
            if (result) {
              res.json({ rowsNumber: rows, msg: msg1, session: req.session });
            } else {
              res.send(msg1);
            }
          });
        } else {
          res.send(msg2);
        }
      });
    }
  })
});

app.post('/task-done', (req, res) => {
  sql_handler.update_task_status(req.body.id, req.body.status, function (flag, msg) {
    if (flag) {
      res.send(msg);
    } else {
      res.send(msg);
    }
  })
})

app.post('/delete-task', (req, res) => {
  sql_handler.delete_task(req.body.id, function (flag, msg) {
    if (flag) {
      res.send(msg);
    } else {
      res.send(msg);
    }
  })
})

app.post('/today-page', (req, res) => {
  sql_handler.select_task_by_date(req.body.date, req.session.user, function (flag, msg, result) {
    if (flag) {
      res.json(result);
    } else {
      res.send(msg);
    }
  })
})

app.post('/schedule-tasks', (req, res) => {
  sql_handler.select_schedule_tasks(req.body.date, req.session.user, function (flag, result) {
    if (flag) {
      res.json(result);
    } else {
      res.send(result);
    }
  })
})

app.post('/new-schedule-task', (req, res) => {

  let id = req.get('cookie').split('=s%3A')[1].split('.')[0];

  sessionStore.get(id, (err, session) => {
    if (err) throw err;
    else if (session.user != null || undefined) {
      sql_handler.get_avaliable_task_number('schedule', function (flag, msg2, rows) {
        if (flag) {
          sql_handler.create_schedule_task(rows[0].rowsNumber, req.body.time, req.body.date, req.body.task, session.user, function (result, msg1) {
            if (result) {
              res.json({ rowsNumber: rows, msg: msg1 });
            } else {
              res.send(msg1);
            }
          });
        } else {
          res.send(msg2);
        }
      });
    }
  });
})

app.post('/delete-schedule-task', (req, res) => {
  sql_handler.delete_schedule_task(req.body.id, req.session.user, function (flag, result) {
    if (flag) {
      res.send(result);
    } else {
      res.send(result);
    }
  })
})



app.listen(PORT);