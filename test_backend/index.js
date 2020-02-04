const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const uuidv4 = require('uuid/v4');
const http = require('http');
const server = http.createServer();

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
    console.log("connected " + mqttClient.connected);
});

mqttClient.on("error", function (error) {
    console.log("Cant connect: " + error);
});

mqttClient.on("message", function (topic, message, packet) {
    console.log("message is: " + message);
    console.log("topic is: " + topic);
});

mqttClient.subscribe("302CEM/RABBIT/helloWorld", { qos: 1 });

server.listen(webSocketsServerPort);

const wsServer = new webSocketServer({
    httpServer: server
});

const getUniqueID = () => {
    const val = uuidv4();
    return val;
};

const clients = {};

wsServer.on('request', function (request) {
    var userID = getUniqueID();
    console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    console.log('user connected');
    connection.on('message', function (message) {
        console.log(message);
        connection.send('ahoy sailor');
    });

    connection.on('close', function (connection) {
        console.log((new Date()) + " Peer " + userID + " disconnected.");
    });

});