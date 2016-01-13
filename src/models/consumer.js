"use strict";

var path = require("path");

var Consumer = function() {

};

Consumer.prototype.Connection = require(path.join(__dirname, "connection"));


Consumer.prototype.getConfig = function(callback) {
    if (!this.config) {
        callback(new Error("Configuration not setted"));
    } else {
        callback(null, this.config);
    }
};

Consumer.prototype.log = function(message, level) {

};


Consumer.prototype.setConfig = function(config, callback) {
    this.config = config;
    if (callback) {
        callback(null, config);
    }
};

Consumer.prototype.getConnection = function(callback) {
    if (!this.connection) {
        var self = this;
        this.getConfig(function(err, config) {
            self.connection = new self.Connection();
            self.connection.log = self.log;
            self.connection.setConfig(config.connection, function(err) {
                if (err) {
                    callback(err);
                    return;
                }
                self.connection.connect(callback);
            });
        });
    } else {
        callback(null, this.connection);
    }
};

Consumer.prototype.consume = function(func, options, callback) {
    var self = this;
    this.getConnection(function(err, connection) {
        if (err) {
            callback(err);
            return;
        }
        self.getConfig(function(err, config) {
            if (err) {
                callback(err);
                return;
            }
            connection.createChannel().then(function(channel) {
                channel.consume(config.queue.name, func, options).then(function(consumer) {
                    callback(null, consumer);
                }).catch(function(err) {
                    callback(err);
                });
            }).catch(function(err) {
                callback(err);
            });
        });
    });
};

module.exports = Consumer;
