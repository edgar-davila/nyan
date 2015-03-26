var db;
var funciones = {};
var request;
var version = 2;

//Codigo para Firefox
if (window.indexedDB) {
	request = window.indexedDB.open("puntajes", version);
	request.onerror = function(event) {
		alert("Error en la request");
	};

	request.onsuccess = function(event) {
		db = request.result;
		db.onerror = function(event) {
			alert("Database error: " + event.target.errorCode);
		};
		//Codigo para Chrome
		if (window.webkitIndexedDB) {
			if (!db.objectStoreNames.contains("puntajes")) {
				var versionRequest = db.setVersion(version);
				versionRequest.onsuccess = function(e) {
					var objectStore = db.createObjectStore("puntajes", {
						keyPath : "fecha"
					});
				}
				alert("La base de datos fue actualizada");
			}
		}
		//fin codigo Chrome
	};
	//Codigo para Firefox
	request.onupgradeneeded = function(event) {
		var db = event.target.result;

		var objectStore = db.createObjectStore("puntajes", {
			keyPath : "fecha"
		});

		objectStore.createIndex("name", "name", {
			unique : false
		});
		alert("La base de datos fue actualizada");
	}
	//fin codigo Firefox
} else {
	window.alert("En tu navegador no será posible guardar las puntuaciones ya que no soporta IndexedDB al 100%")
}

function agregar() {
	var rw;
	if (window.webkitIndexedDB)
		rw = "readwrite";
	if (window.mozIndexedDB)
		rw = IDBTransaction.READ_WRITE;
	var transaction = db.transaction(["puntajes"], rw);
	transaction.oncomplete = function(event) {
		//alert("completado no se si guardada");
	};

	transaction.onerror = function(event) {
		alert("Error en transaccion");
	};

	var objectStore = transaction.objectStore("puntajes");

	var temp = {
		fecha : new Date(),
		name : document.getElementById("nombre").value,
		score : Math.floor(puntaje),//document.getElementById("puntos").value,
	};

	var request = objectStore.add(temp);
	request.onsuccess = function(event) {
		alert("Puntuacion enviada con exito");
	};
}

function mostrar() {
	limpiarLista();
	var objectStore = db.transaction("puntajes").objectStore("puntajes");

	objectStore.openCursor().onsuccess = function(event) {
		var cursor = event.target.result;
		if (cursor) {
			var texto = cursor.value.name + " - " + cursor.value.score;
			var li = document.createElement('LI');
			li.innerHTML = texto;
			document.getElementById("listaPuntajes").appendChild(li);
			cursor.continue();
		} else {
			//alert("Fin de los registros");
		}
	};
}

function limpiarLista() {
	var lista = document.getElementById('listaPuntajes');
	lista.innerHTML = "Ultimas puntuaciones";
}
