const WebSocket = require('ws');

let wss;

function setupWebSocket(wsserver) {
    wss = new WebSocket.Server({ server: wsserver });
    wss.on('connection', ws => {
        console.log('Client Connected');
        ws.on('close', close => {
            console.log('Close Connection');
        })
    })

}

function broadcastMessage(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

module.exports = {
    setupWebSocket,
    broadcastMessage
};