"use strict";
var assert = require("assert");
var sinon = require("sinon");
var path = require("path");
var Publisher = require(path.join(__dirname, "..", "src", "models", "publisher"));

function restoreEach(toRestore) {
    toRestore.forEach(function (element) {
        element.restore();
    });
}

describe("Publisher", function () {
    it("send message to channel", function (done) {
        var publisher = new Publisher();
        publisher.setConfig({
            "connection": "config.connection",
            "queue": {"name": "config.queue.name"}
        });
        var toRestore = [];
        var connection = new Publisher.Connection();
        toRestore.push(sinon.stub(connection, "setConfig", function (config, callback) {
            assert.equal(config, "config.connection");
            callback();
        }));
        toRestore.push(sinon.stub(connection, "connect", function (callback) {
            callback(null, {"createChannel": function () {
                    return {
                        "then": function (callback) {
                            callback({
                                "assertQueue": function (queueName) {
                                    assert.equal(queueName, "config.queue.name");
                                },
                                "sendToQueue": function (queueName, bufferMessage, options) {
                                    assert.equal(queueName, "config.queue.name");
                                    assert.equal(bufferMessage.toString(), "message");
                                    assert.equal(options, "options");
                                }
                            });
                            return {"catch": function () {}};
                        }
                    };
                }});
        }));
        toRestore.push(sinon.stub(Publisher, "Connection", function () {
            return connection;
        }));
        publisher.send("message", "options", function (err, message) {
            assert.equal(err, null);
            assert.equal(message, "message");
            restoreEach(toRestore);
            done();
        });
    });
});
