"use strict";
var path = require("path");
module.exports = {
    "Consumer": require(path.join(__dirname, "models", "consumer")),
    "Publisher": require(path.join(__dirname, "models", "publisher"))
};
