"use strict";

var Common = function () {

};

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