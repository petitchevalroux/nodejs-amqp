"use strict";

var path = require("path");

var Publisher = require(path.join(__dirname, "common-amqp"));

Publisher.prototype.send = function(message, options, callback) {
    var self = this;
    self.getChannel(function(err, channel) {
        if (err) {
            callback(err);
            return;
        }
        self.getConfig(function(err, config) {
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
