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
		this.left = false;
		this.right = false;
		this.up = false;
		this.down = false;

		this.actions = {
			"moved": false,
			"ticks": []
		}

		this.bindKeys();
	}

	bindKeys() {
		document.addEventListener("keydown", (e) => {
			if (e.key == "w") this.up = true
			else if (e.key == "s") this.down = true
			else if (e.key == "a") this.left = true
			else if (e.key == "d") this.right = true
		});

		document.addEventListener("keyup", (e) => {
			if (e.key == "w") this.up = false 
			else if (e.key == "s") this.down = false
			else if (e.key == "a") this.left = false
			else if (e.key == "d") this.right = false
		});
	}

	clearBuffer() {
		this.actions.moved = false;
		this.actions.ticks = [];
	}
}

class WS extends WebSocket {
	constructor() {
		super("ws://localhost:8080")

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
    	console.log(packet)
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
	if (movement_class.left) canvas_class.client_x --;
	else if (movement_class.right) canvas_class.client_x ++;
	else if (movement_class.up) canvas_class.client_y --;
	else if (movement_class.down) canvas_class.client_y ++;
}

serverPosition = function(canvas_class, ws_class) {
	canvas_class.server_x = ws_class.x;
	canvas_class.server_y = ws_class.y;
}

sendBufferedTicks = function(movement_class, ws_class) {
	if (movement_class.actions.moved) {
		ws_class.sendServer({
			"type": "actions",
			"ticks": movement_class.actions.ticks
		})
	}

	movement_class.clearBuffer();
}

checkMoving = function(movement_class) {
	if (movement_class.left) holdTick(movement_class, "left");
	else if (movement_class.right) holdTick(movement_class, "right");
	else if (movement_class.up) holdTick(movement_class, "up");
	else if (movement_class.down) holdTick(movement_class, "down");
	else {

		// Not moving in this tick
		movement_class.actions.ticks.push("");
	}
}

holdTick = function(movement_class, dir) {

	// There is a moving tick so 
	// send to server for evaluation
	movement_class.actions.moved = true;

	// Add to history of where it was moving towards
	movement_class.actions.ticks.push(dir)
}

tick = function() {
	ticksPassed ++;

	checkMoving(movement);

	if ((ticksPassed % 10) == 0) {
		sendBufferedTicks(movement, ws);
	}

	ws.readMessage();
	updatePosition(canvas, movement);
	serverPosition(canvas, ws);

	canvas.drawTick();


}

// Initiate classes
let canvas = new Canvas(),
	movement = new Movement(),
	ws = new WS(),
	ticksPassed = 0;

setInterval( () => tick(), 1000/60 )
