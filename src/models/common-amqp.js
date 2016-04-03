"use strict";

var path = require("path");

var CommonAmqp = require(path.join(__dirname, "common"));

CommonAmqp.Connection = require(path.join(__dirname, "connection"));

CommonAmqp.prototype.getConnection = function (callback) {
    if (!this.connection) {
        var self = this;
        this.getConfig(function (err, config) {
            if (err) {
                callback(err);
                return;
            }
            self.connection = new CommonAmqp.Connection();
            self.connection.log = self.log;
            self.connection.setConfig(config.connection, function (err) {
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

CommonAmqp.prototype.getChannel = function (callback) {
    if (this.channel) {
        callback(null, this.channel);
        return;
    }
    var self = this;
    this.getConnection(function (err, connection) {
        if (err) {
            callback(err);
            return;
        }
        self.getConfig(function (err, config) {
            if (err) {
                callback(err);
                return;
            }
            connection.createChannel().then(function (channel) {
                self.channel = channel;
                // Create queue if it does not exist
                channel.assertQueue(config.queue.name);
                callback(null, self.channel);
            }).catch(function (err) {
                callback(err);
            });
        });
    });
};

module.exports = CommonAmqp;
