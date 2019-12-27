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
}

// Initiate classes

let canvas = new Canvas(),
	movement = new Movement();

updatePosition = function(canvas_class, movement_class) {
	console.log(movement_class)
	if (movement_class.left) canvas_class.client_x --;
	else if (movement.right) canvas_class.client_x ++;
	else if (movement.up) canvas_class.client_y --;
	else if (movement.down) canvas_class.client_y ++;
}

setInterval( () => {
	updatePosition(canvas, movement);
	canvas.drawTick();
})
