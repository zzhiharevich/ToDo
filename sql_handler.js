const mysql = require("mysql2");

class SQL_Handler {

    _login;

    constructor() { }

    get_connection() {
        return mysql.createConnection({
            host: "localhost",
            user: "root",
            database: "*db_NAME*",
            password: "*PASSWORD*"
        });
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

    get_login(callback) {
        this.get_connection().query("SELECT login FROM user",
            function (err, results, fields) {
                console.log(results[0].login);
                //console.log(err);
                console.log(results); // собственно данные
                //console.log(fields); // мета-данные полей
                return callback(results[0].login);
            }
        );
    }

    disconnect() {
        this.get_connection().end(function (err) {
            if (err) {
                return console.log("Ошибка: " + err.message);
            }
            console.log("Подключение закрыто");
        });
    }
}

module.exports = SQL_Handler;