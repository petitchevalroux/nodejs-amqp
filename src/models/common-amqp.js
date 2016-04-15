"use strict";

var path = require("path");

var CommonAmqp = require(path.join(__dirname, "common"));

CommonAmqp.Connection = require(path.join(__dirname, "connection"));

CommonAmqp.prototype.getConnection = function (config, callback) {
    if (this.connection) {
        callback(null, this.connection);
        return;
    }
    var self = this;
    var connection = new CommonAmqp.Connection();
    connection.log = self.log;
    connection.on("error", function(error) {
        delete self.channel;
        self.emit("error", error);
    });
    connection.setConfig(config.connection, function (err) {
        if (err) {
            callback(err);
            return;
        }
        self.connection = connection;
        callback(null, self.connection);
    });
};

CommonAmqp.prototype.getChannel = function (callback) {
    if (this.channel) {
        callback(null, this.channel);
        return;
    }
    var self = this;
    self.getConfig(function (err, config) {
        if (err) {
            callback(err);
            return;
        }
        self.getConnection(config, function (err, connection) {
            if (err) {
                callback(err);
                return;
            }
            connection.get(function (err, amqp) {
                if (err) {
                    callback(err);
                    return;
                }
                amqp.createChannel().then(function (channel) {
                    self.channel = channel;
                    // Create queue if it does not exist
                    channel.assertQueue(config.queue.name);
                    callback(null, self.channel);
                }).catch(function (err) {
                    callback(err);
                });
            });
        });
    });
};

module.exports = CommonAmqp;
