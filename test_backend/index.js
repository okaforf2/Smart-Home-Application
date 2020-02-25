const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const uuidv4 = require('uuid/v4');
const http = require('http');
const server = http.createServer();

//////////////////// MQTT Setup ////////////////////////

var mqtt = require('mqtt');
const fs = require('fs');
var caFile = fs.readFileSync("mqtt.crt");

var options = {
    clientId: "testNodeServer",
    host: "mqtt.coventry.ac.uk",
    username: "302CEM",
    password: "n3fXXFZrjw",
    protocol: 'mqtts',
    ca: caFile
};

var mqttClient = mqtt.connect("mqtt.coventry.ac.uk", options);

mqttClient.on("connect", function () {
    console.log("connected to mqtt broker: " + mqttClient.connected);
});

mqttClient.on("error", function (error) {
    console.log("Cant connect to mqtt broker: " + error);
});

mqttClient.on("message", function (topic, message, packet) {
    console.log("mqtt message is: " + message);
    console.log("mqtt topic is: " + topic);
    try {
        JSON.parse(message);
        clients.forEach(function each(client) {
            client.send(message.toString());
        });
    } catch (err) {
        console.log(err);
        // Probably wasn't correct JSON format
        // Don't send anything
    }    
});

mqttClient.subscribe("302CEM/RABBIT/fromBroker", { qos: 1 });

//////////////////// WebSocket Setup ///////////////////

server.listen(webSocketsServerPort);

const wsServer = new webSocketServer({
    httpServer: server
});

const getUniqueID = () => {
    const val = uuidv4();
    return val;
};

//Clients connected via websockets
const clients = [];

wsServer.on('request', function (request) {
    var userID = getUniqueID();
    console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');

    const connection = request.accept(null, request.origin);
    clients.push(connection);
    console.log('user connected');

    connection.on('message', function (message) {
        console.log(message);
        var JSONpassed = false;
        var JSONMessage;
        //Parse the message and ensure proper JSON
        try {
            JSONMessage = JSON.parse(message.utf8Data);
            console.log("JSON message parsed successfully");
            JSONpassed = true;
        } catch (err) {
            console.log("Didnt parse json successfully: " + err);
            // Probably wasn't correct JSON format
            // Don't send anything
        }

        if (JSONpassed) {
            var clientsDuplicate = [].concat(clients);
            const index = clientsDuplicate.indexOf(connection);
            if (index > -1) {
                console.log("found connection and splicing");
                clientsDuplicate.splice(index, 1);
                clientsDuplicate.forEach(function each(client) {
                    client.send(message.utf8Data);
                });
            }
            if (JSONMessage.type !== "message") {
                mqttClient.publish("302CEM/RABBIT/fromBackend", message.utf8Data);
            }
        }
    });

    connection.on('close', function (connection) {
        const index = clients.indexOf(connection);
        if (index > -1) {
            clients.splice(index, 1);
        }
        console.log(new Date() + " Peer " + userID + " disconnected.");
    });

});