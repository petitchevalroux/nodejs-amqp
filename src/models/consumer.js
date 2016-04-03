"use strict";

var path = require("path");

var Consumer = require(path.join(__dirname, "common-amqp"));

Consumer.prototype.consume = function(func, options, callback) {
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
                channel.consume(config.queue.name, func, options).then(function(consumer) {
                    callback(null, consumer);
                }).catch(function(err) {
                    callback(err);
                });
            } catch (err) {
                callback(err);
            }
        });
    });
};

module.exports = Consumer;
