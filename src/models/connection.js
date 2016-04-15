"use strict";

var path = require("path");
var util = require("util");
var Common = require(path.join(__dirname, "common"));

function Connection() {}

util.inherits(Connection, Common);

function ConnectionError(message, previous) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.previous = previous;
}

util.inherits(ConnectionError, Error);

Connection.prototype.amqp = require("amqplib");

Connection.prototype.getConnectString = function (callback) {
    this.getConfig(function (err, config) {
        if (err) {
            callback(err);
            return;
        }
        var connectString = "amqp://";
        if (config.username) {
            connectString += config.username;
            if (config.password) {
                connectString += ":" + config.password;
            }
            connectString += "@";
        }
        connectString += config.host;
        if (config.port) {
            connectString += ":" + config.port;
        }
        callback(null, connectString);
    });
};

Connection.prototype.open = function (callback) {
    var self = this;
    self.getConnectString(function (err, connectString) {
        if (err) {
            callback(err);
            return;
        }
        self.log("connect string: " + connectString, "info");
        self.amqp.connect(connectString)
            .then(function (connection) {
                callback(null, connection);
            })
            .catch(function (err) {
                callback(err);
            });
    });
};

Connection.prototype.get = function (callback) {
    if (this.openConnection) {
        callback(null, this.openConnection);
        return;
    }
    var self = this;
    this.open(function (err, connection) {
        if (err) {
            callback(err);
            return;
        }
        connection.on("error", function (error) {
            delete self.openConnection;
            var e = new ConnectionError("Connection error", error);
            self.log(e, "error");
            self.emit("error", e);
        });
        connection.on("close", function (error) {
            delete self.openConnection;
            var e = new ConnectionError("Connection closed", error);
            self.log(e, "error");
            self.emit("error", e);
        });
        self.openConnection = connection;
        callback(null, connection);
    });
};

module.exports = Connection;
