// Main client file

class Canvas {
	constructor() {

		// Canvas settings
		this.c = document.getElementById("canvas_view");
		this.ctx = this.c.getContext("2d");
		this.ctx.globalAlpha = 0.2;
		this.radius = 50;
		this.width = 500;
		this.height = 500;

		// Position settings
		this.client_x = 0;
		this.client_y = 0;
		this.server_x = 0;
		this.server_y = 0;
	}	

	drawClient() {

		// Drawing method for a filled and outlined circle
		// reference: https://www.html5canvastutorials.com/tutorials/html5-canvas-circles/

		// Begin drawing on the canvas context
		this.ctx.beginPath();
		console.log(this.client_x, this.client_y)


		this.ctx.arc(this.client_x, this.client_y, this.radius, 0, 2*Math.PI, false);
		this.ctx.fillStyle = "green";
		this.ctx.fill();
		this.ctx.lineWidth = 5;
		this.ctx.strokeStyle = "#013220" // Dark green
		this.ctx.stroke();
	}

	drawServer() {

		// Same drawing method as drawClient

		// Begin drawing on the canvas context
		this.ctx.beginPath();


		this.ctx.arc(this.server_x, this.server_y, this.radius, 0, 2*Math.PI, false);
		this.ctx.fillStyle = "red";
		this.ctx.fill();
		this.ctx.lineWidth = 5;
		this.ctx.strokeStyle = "#8B0000" // Dark red
		this.ctx.stroke();
	}

	drawTick() {

		// Clear the canvas first
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.drawClient();
		this.drawServer();
	}2
}

class Movement {
	constructor() {
		this.prev = {
			"left": false,
			"right": false,
			"up": false,
			"down": false
		}

		this.next = {
			"left": false,
			"right": false,
			"up": false,
			"down": false
		}

		this.bindKeys();
	}

	bindKeys() {
		document.addEventListener("keydown", (e) => {
			if (e.key == "w") this.next.up = true
			else if (e.key == "s") this.next.down = true
			else if (e.key == "a") this.next.left = true
			else if (e.key == "d") this.next.right = true
		});

		document.addEventListener("keyup", (e) => {
			if (e.key == "w") this.next.up = false
			else if (e.key == "s") this.next.down = false
			else if (e.key == "a") this.next.left = false
			else if (e.key == "d") this.next.right = false
		});
	}

	update() {
		for (dir in this.prev) {
			this.prev[dir] = this.next[dir];
		}
	}
}

class WS extends WebSocket {
	constructor() {
		super("ws://0.0.0.0:8080")

		this.onopen = () => {
            console.log("[open] Connection established");
            this.message_queue = [];
            this.x = 0;
            this.y = 0;
		}

		this.onmessage = (event) => {
			let data = JSON.parse(event.data);
			this.message_queue.push(data);
		}
	}

	readMessage() {
		this.message_queue.map( (p) => {
			this.parse(p);
		})
	}

    sendServer(packet) {
        console.log("sent", packet);
        this.send(JSON.stringify(packet));
    }

	parse(msg) {
		switch(msg.type) {
			case "pos": 
				this.x = msg.x;
				this.y = msg.y;
			break;
		}
	}
}

updatePosition = function(canvas_class, movement_class) {
	if (movement_class.prev.left) canvas_class.client_x --;
	else if (movement_class.prev.right) canvas_class.client_x ++;
	else if (movement_class.prev.up) canvas_class.client_y --;
	else if (movement_class.prev.down) canvas_class.client_y ++;
}

serverPosition = function(canvas_class, ws_class) {
	canvas_class.server_x = ws_class.x;
	canvas_class.server_y = ws_class.y;
}

sendMovement = function(movement_class, ws_class) {
	for (dir in movement_class.prev) {
		if (movement_class.prev[dir] != movement_class.next[dir]) {
			ws_class.sendServer({
				"type": "move",
				"dir": dir,
				"status": movement_class.next[dir]
			});
		}
	}
}

tick = function() {
	sendMovement(movement, ws);
	movement.update();
	ws.readMessage();
	updatePosition(canvas, movement);
	serverPosition(canvas, ws);
	canvas.drawTick();
}

// Initiate classes
let canvas = new Canvas(),
	movement = new Movement(),
	ws = new WS();

setInterval( () => tick(), 1000/60 )
