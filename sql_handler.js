const mysql = require("mysql2");

class SQL_Handler {

    _connection;

    constructor() { }

    get_connection() {
        if (this._connection != null){
            return this._connection;
        } else {
            this._connection = mysql.createConnection({
                host: "localhost",
                user: "root",
                database: "to_do_app",
                password: "111111"
            });
        }
        return this._connection;
    }

    connect() {
        this.get_connection().connect(function (err) {
            if (err) {
                return console.error("Ошибка: " + err.message);
            }
            else {
                console.log("Подключение к серверу MySQL успешно установлено");
            }
        });
    }

    authentication(callback, login, password) {

        this.connect();

        let sql = 'SELECT * FROM user WHERE login = ?';

        this._connection.query(sql, [login], function(err, results) {
            if (err) {
                console.log('Error: can not selet user info');
                throw Error;
            }

            if (results.length == 0) {
                console.log('No such user');
                callback(false, 'User with this login do not exist');
                return;
            }

            if (results[0].password != password) {
                console.log('Incorect password');
                callback(false, 'Incorrect password');
            } else {
                callback(true, 'Valid user');
            }
        });

        this.disconnect();
    }

    is_user_exist(login, callback){
        let sql_select = `SELECT * FROM user WHERE login = ?`;

        this._connection.query(sql_select, [login],
            function(err, results) {
                if (err) {
                    console.log('Error: can not selet user info');
                    throw Error;
                }

                if (results.length == 0) {
                    callback(false, 'User with this login do not exist');
                } else {
                    console.log(results)
                    callback(true, 'User with with login already exist. Try another one.');
                }
            }
        );
    }

    insert_user(login, password, name, callback){
        let sql_insert = `INSERT INTO user (login, password, name) VALUES (?, ?, ?)`;

        this._connection.query(sql_insert, [login, password, name], function(err) {
            if(err) {
                callback(false, 'Error');
                console.log('Error: can not insert user info');
                throw Error;
            }

            callback(true, 'Inserted!');
        });
    }

    create_user(login, password, name, callback) {

        this.connect();

        let sql = 'INSERT INTO user (login, password, name) VALUES (?, ?, ?)';

        this._connection.query(sql, [login, password, name], function(err) {
            if(err) {
                callback(false, 'User with this login already exist. Try another please.');
                //console.log(err);
            }
            else callback(true, 'Inserted');
        });

        this.disconnect();
    }

    create_new_task(id, date, task, status, callback){
        this.connect();

        let sql = 'INSERT INTO tasks (task_id, date, task_content, status) VALUES (?, ?, ?, ?)';

        this._connection.query(sql, [id, date, task, status], function(err) {
            if(err) {
                callback(false, `Can not insert new task: ${err}`);
            } else {
                callback(true, 'Inserted');
            }
        })

        this.disconnect();
    }

    get_avaliable_task_number(callback) {
        this.connect();

        let sql = 'SELECT COUNT(*) AS rowsNumber FROM tasks';

        this._connection.query(sql, function(err, results) {
            if(err) {
                callback(false, `Error: ${err}`, null);
            } else {
                callback(true, 'Selected', results);
            }
        })

        this.disconnect();
    }

    select_task_by_date(date, callback){
        this.connect();

        let sql = 'SELECT * FROM tasks WHERE date = ?';

        this._connection.query(sql, [date], function(err, results) {
            if(err) {
                callback(false, 'Can not select tasks', null);
            } else {
                callback(true, 'Selected', results);
            }
        })

        this.disconnect();
    }

    update_task_status(id, status, callback) {
        this.connect();

        let sql = 'UPDATE tasks SET status = ? WHERE task_id = ?';

        this._connection.query(sql, [status, id], function(err) {
            if(err) {
                callback(false, `Error: ${err}`);
            } else {
                callback(true, 'Updates');
            }
        })

        this.disconnect();
    }

    disconnect() {
        this._connection.end(function (err) {
            if (err) {
                return console.log("Ошибка: " + err.message);
            }
            console.log("Подключение закрыто");
        });
        this._connection = null;
        console.log(`DISCONNECT: ${this._connection}`);
    }
}

module.exports = SQL_Handler;