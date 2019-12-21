// Main client file

class Canvas {
	constructor() {

		// Canvas settings
		this.c = document.getElementById("canvas_view");
		this.ctx = c.getContext("2d");
		this.radius = 5;
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
		this.c.beginPath();

		this.c.arc(this.client_x, this.client_y, this.radius, 0, 2*Math.PI, false);
		this.c.fillStyle = "green";
		this.c.fill();
		this.c.lineWidth = 5;
		this.c.strokeStyle = "#013220" // Dark green
		this.c.stroke();
	}

	drawServer() {

		// Same drawing method as drawClient

		// Begin drawing on the canvas context
		this.c.beginPath();

		this.c.arc(this.client_x, this.client_y, this.radius, 0, 2*Math.PI, false);
		this.c.fillStyle = "red";
		this.c.fill();
		this.c.lineWidth = 5;
		this.c.strokeStyle = "#8B0000" // Dark red
		this.c.stroke();
	}

	drawTick() {

		// Clear the canvas first
		this.c.clearRect(0, 0, this.width, this.height);
		this.drawClient();
		this.drawServer();
	}
}

class Movement {
	constructor() {
		this.left = false;
		this.right = false;
		this.up = false;
		this.down = false;

		this.bindkeys();
	}

	bindKeys() {

	}
}