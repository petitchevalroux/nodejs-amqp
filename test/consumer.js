"use strict";
var assert = require("assert");
var sinon = require("sinon");
var path = require("path");
var Consumer = require(path.join(__dirname, "..", "src", "models", "consumer"));

function restoreEach(toRestore) {
    toRestore.forEach(function (element) {
        element.restore();
    });
}

describe("Consumer", function () {
    it("set consumer function", function (done) {
        var consumer = new Consumer();
        consumer.setConfig({
            "connection": "config.connection",
            "queue": {"name": "config.queue.name"}
        });
        var toRestore = [];
        var connection = new Consumer.Connection();
        toRestore.push(sinon.stub(connection, "setConfig", function (config, callback) {
            assert.equal(config, "config.connection");
            callback();
        }));
        toRestore.push(sinon.stub(connection, "get", function (callback) {
            callback(null, {"createChannel": function () {
                    return {
                        "then": function (callback) {
                            callback({
                                "assertQueue": function (queueName) {
                                    assert.equal(queueName, "config.queue.name");
                                },
                                "consume": function (queueName, func, options) {
                                    assert.equal(queueName, "config.queue.name");
                                    assert.equal(func, "func");
                                    assert.equal(options, "options");
                                    return {"then": function (callback) {
                                            callback("consumer");
                                            return {"catch": function () {}};
                                        }};
                                }
                            });
                            return {"catch": function () {}};
                        }
                    };
                }});
        }));
        toRestore.push(sinon.stub(Consumer, "Connection", function () {
            return connection;
        }));
        consumer.consume("func", "options", function (err, consumer) {
            assert.equal(err, null);
            assert.equal(consumer, "consumer");
            restoreEach(toRestore);
            done();
        });
    });
});
