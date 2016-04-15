"use strict";

var EventEmitter = require("events");
var util = require("util");

var Common = function () {
    EventEmitter.call(this);
};

util.inherits(Common, EventEmitter);

Common.prototype.getConfig = function (callback) {
    if (!this.config) {
        callback(new Error("Configuration not setted"));
    } else {
        callback(null, this.config);
    }
};

Common.prototype.log = function () {

};

Common.prototype.setConfig = function (config, callback) {
    this.config = config;
    if (callback) {
        callback(null, config);
    }
};

module.exports = Common;