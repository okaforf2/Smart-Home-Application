const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const uuidv4 = require('uuid/v4');
const http = require('http');
const server = http.createServer();

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