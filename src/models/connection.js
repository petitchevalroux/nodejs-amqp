"use strict";

var Connection = function() {

};

Connection.prototype.amqp = require("amqplib");

Connection.prototype.log = function(message, level) {

};

Connection.prototype.getConfig = function(callback) {
    if (!this.config) {
        callback(new Error("Configuration not setted"));
    } else {
        callback(null, this.config);
    }
};

Connection.prototype.setConfig = function(config, callback) {
    this.config = config;
    if (callback) {
        callback(null, config);
    }
};

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
