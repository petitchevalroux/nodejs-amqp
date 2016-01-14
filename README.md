amqp
====

Simple nodejs wraper for amqp client

##Usage
```javascript
var Consumer = new require("amqp").Consumer;
var consumer = new Consumer();

// Overwrite log function
consumer.log = function (message, level) {
    console.log("message");
};

// Set consumer configuration
consumer.setConfig({
    "connection": {
        "host": "127.0.0.100",
        "port": 5672,
        "username": "johndoe",
        "password": "unbreakable"
    },
    "queue": {
        "name": "queue.name"
    }
});

// Set sample function to consume message
consumer.consume(
    // Consume function
    function (message) {
        console.log("message: " + JSON.stringify(message));
    },
    // Consume option (here we don't acknowledge messages)
    {"noAck": true},
    // Callback when everything is ready to handle messages
    function (err, consumer) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("consumer: " + JSON.stringify(consumer));
    }
);
```

##Todo
- Refactorize publisher and consumer
- Do not create channel each time for consumer

