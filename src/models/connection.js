"use strict";

var path = require("path");

var Connection = require(path.join(__dirname, "common"));

Connection.prototype.amqp = require("amqplib");

Connection.prototype.getConnectString = function(callback) {
    this.getConfig(function(err, config) {
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

Connection.prototype.connect = function(callback) {
    var self = this;
    self.getConnectString(function(err, connectString) {
        if (err) {
            callback(err);
            return;
        }
        self.log("connect string: " + connectString, "info");
        self.amqp.connect(connectString)
            .then(function(connection) {
                callback(null, connection);
            }).catch(function(err) {
                callback(err);
            });
    });
};

module.exports = Connection;
