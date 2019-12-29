// Main server file
const WebSocket = require('ws');

class WSS extends WebSocket.Server {
	constructor() {
		super({port:8080})

		this.on("connection", (ws, req) => {
			console.log(req.connection.remoteAddress, "has joined.")

			ws.message_queue = [];

			ws.left = false;
			ws.right = false;
			ws.up = false;
			ws.down = false;
			ws.x = 0;
			ws.y = 0;

			ws.on("message", (msg) => {
				let data = JSON.parse(msg);
				ws.message_queue.push(data);
			})
		})
	}

	loopClients(callback) {
		this.clients.forEach( (client) => {
			if (client.readyState == WebSocket.OPEN) {
				callback(client);
			}
		})
	}

    sendClient(ws, packet) {
        console.log("sent", packet);
        ws.send(JSON.stringify(packet));
    }

	readMessage(ws) {
		ws.message_queue.map( (p) => {
			this.parse(ws, p);
		})
	}

	updatePos(ws) {
		if (ws.left) ws.x --;
		else if (ws.right) ws.x ++;
		else if (ws.up) ws.y --;
		else if (ws.down) ws.y ++;
	}

	updateClient(ws) {
		this.sendClient(ws, {
			"type": "pos",
			"x": ws.x,
			"y": ws.y
		});
	}

	parse(ws, msg) {
		switch(msg.type) {
			case "move":
				ws[msg.dir] = msg.status;
			break;
		}
	}

	tick() {
		this.loopClients( (client) => {
			this.readMessage(client);
			this.updatePos(client);
			this.updateClient(client);
		})
	}
}

let wss = new WSS();

setInterval( () => wss.tick(), 1000/60 );