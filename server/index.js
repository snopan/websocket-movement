// Main server file
const WebSocket = require('ws');

class WSS extends WebSocket.Server {
	constructor() {
		super({port:8080})

		this.on("connection", (ws, req) => {
			console.log(req.connection.remoteAddress, "has joined.")

			ws.message_queue = [];

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

		ws.message_queue = [];
	}

	updatePos(ws, dir) {
		switch (dir) {
			case "left":
				ws.x --;
			break;
			case "right":
				ws.x ++;
			break;
			case "up":
				ws.y --;
			break;
			case "down":
				ws.y ++;
			break;
		}
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
			case "actions":
				msg.ticks.map( (tick_dir) => {
					this.updatePos(ws, tick_dir);
				})
			break;
		}
	}

	tick() {
		this.loopClients( (client) => {
			this.readMessage(client);
			this.updateClient(client);
		})
	}
}

let wss = new WSS();

setInterval( () => wss.tick(), 1000/60 );