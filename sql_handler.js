const mysql = require("mysql2");

class SQL_Handler {

    _login;

    constructor() { }

    get_connection() {
        return mysql.createConnection({
            host: "localhost",
            user: "root",
            database: "to_do_app",
            password: "111111"
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
            function (err, results) {
                if(err){
                    console.log("Error: can not get login value.");
                }
                callback(results[0].login);
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