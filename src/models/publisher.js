"use strict";

var path = require("path");

var Publisher = function () {

};

Publisher.Connection = require(path.join(__dirname, "connection"));


Publisher.prototype.getConfig = function (callback) {
    if (!this.config) {
        callback(new Error("Configuration not setted"));
    } else {
        callback(null, this.config);
    }
};

Publisher.prototype.log = function (message, level) {

};


Publisher.prototype.setConfig = function (config, callback) {
    this.config = config;
    if (callback) {
        callback(null, config);
    }
};

Publisher.prototype.getConnection = function (callback) {
    if (!this.connection) {
        var self = this;
        this.getConfig(function (err, config) {
            if (err) {
                callback(err);
                return;
            }
            self.connection = new Publisher.Connection();
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

Publisher.prototype.getChannel = function (callback) {
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

Publisher.prototype.send = function (message, options, callback) {
    var self = this;
    self.getChannel(function (err, channel) {
        if (err) {
            callback(err);
            return;
        }
        self.getConfig(function (err, config) {
            if (err) {
                callback(err);
                return;
            }
            try {
                if (typeof message === "object") {
                    message = JSON.stringify(message);
                }
                channel.sendToQueue(config.queue.name, new Buffer(message), options);
                callback(null, message);
            } catch (err) {
                callback(err);
            }
        });
    });
};

module.exports = Publisher;
