var jugador = {
	speed : 250,
	x : 0,
	y : 0
};
var puntaje = 0;
var nivel = 100;
var cantidad = 10;
var activo = 0;

var meteoros = new Array();
for (var i = 0; i < cantidad; i++) {
	meteoros[i] = new enemigo();
}

function enemigo() {
	this.x = 0;
	this.y = 0;
	this.resetear = function(ancho, alto) {
		var tmp = Math.random();
		if (tmp > 0.5) {
			this.x = -40;
			this.y = Math.random() * alto;
		} else {
			this.y = -40;
			this.x = Math.random() * ancho
		};
	};
}

var ejecucion;

var fondo = new Image();
fondo.src = "./imagenes/espacio.jpg";
var nave = new Image();
nave.src = "./imagenes/jugador.png";
var meteoro = new Image();
meteoro.src = "./imagenes/meteoro.png";
var explosion = new Image();
explosion.src = "./imagenes/explosion.png";

//Para ver el teclado
var keysDown = {};
addEventListener("keydown", function(e) {
	keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function(e) {
	delete keysDown[e.keyCode];
}, false);

function nuevoJuego() {
	activo = 1;
	if (ejecucion)
		clearInterval(ejecucion);
	var canvas = document.getElementById("tablero");
	jugador.x = canvas.width / 2;
	jugador.y = canvas.height / 2;
	for (var i = 0; i < cantidad; i++) {
		meteoros[i].resetear(canvas.width, canvas.height);
	}
	nivel = 100;
	puntaje = 0;
	redibujar();
}

function paso(n) {
	var canvas = document.getElementById("tablero");
	if (38 in keysDown) {// arriba
		jugador.y -= jugador.speed * n;
	}
	if (40 in keysDown) {// abajo
		jugador.y += jugador.speed * n;
	}
	if (37 in keysDown) {// izquierda
		jugador.x -= jugador.speed * n;
	}
	if (39 in keysDown) {// derecha
		jugador.x += jugador.speed * n;
	}
	//Chequear que no se salga la nave
	if (jugador.x < 0)
		jugador.x = 0;
	if (jugador.y < 0)
		jugador.y = 0;
	if (jugador.x > canvas.width - 48)
		jugador.x = canvas.width - 48;
	if (jugador.y > canvas.height - 48)
		jugador.y = canvas.height - 48;

	//mover meteoros
	for (var i = 0; i < cantidad; i++) {
		meteoros[i].x += nivel * n;
		meteoros[i].y += nivel * n;
		if (meteoros[i].x > canvas.width || meteoros[i].y > canvas.height) {
			meteoros[i].resetear(canvas.width, canvas.height);
		}
	}
	puntaje += n;
	nivel+=n;
	// Si chocan automaticamente pierde
	for (var i = 0; i < cantidad; i++) {
		if (jugador.x <= (meteoros[i].x + 32) && meteoros[i].x <= (jugador.x + 32) && jugador.y <= (meteoros[i].y + 32) && meteoros[i].y <= (jugador.y + 32)) {
			perder();
		}
	}
}

function redibujar() {
	var canvas = document.getElementById("tablero");
	var ctx = canvas.getContext("2d");

	ctx.drawImage(fondo, 0, 0);
	ctx.drawImage(nave, jugador.x, jugador.y);
	for (var i = 0; i < cantidad; i++) {
		ctx.drawImage(meteoro, meteoros[i].x, meteoros[i].y);
	}
	// Mostrando los puntos
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Puntaje actual: " + Math.floor(puntaje), 32, 32);
	if (activo == 0)
		ctx.drawImage(explosion, jugador.x, jugador.y);
}

function comenzar() {
	var then = Date.now();
	nuevoJuego();
	var main = function() {
		var now = Date.now();
		var delta = now - then;

		paso(delta / 1000);
		redibujar();

		then = now;
	};
	ejecucion = setInterval(main, 1);
}

function perder() {
	activo = 0;
	var canvas = document.getElementById("tablero");
	var ctx = canvas.getContext("2d");
	clearInterval(ejecucion);
	ctx.drawImage(explosion, jugador.x, jugador.y);
	//alert("Te mataron con " + Math.floor(puntaje) + " puntos");
	agregar();
}
