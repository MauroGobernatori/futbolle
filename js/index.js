var section_nombre_repetido = document.getElementById("nombre_repetido");
var tablero = document.getElementById("tablero");
var nombres_usados = [];
var intentos_restantes = 8;

function actualizar_intentos_restantes(intentos_restantes){
  var intentos = document.getElementById("intentos");
  intentos.innerText = intentos_restantes;
}

actualizar_intentos_restantes(intentos_restantes);

var boton_reiniciar = document.getElementById("boton_reiniciar");
boton_reiniciar.addEventListener("click", function (evento){
  reiniciar();
});

async function generar_jugador(){
  var jugador = await fetch("https://futbolle-daw-uai-2026.onrender.com/api/players/random")
    .then(response => response.json())
    .then(function(data){
      // console.log(data)

      input_busqueda.disabled = false;
      return data;
    })
    .catch(function(err){
      console.log(err);
    });

  return jugador;
}

var jugador_random;

async function iniciar(){
  jugador_random = await generar_jugador();
  input_busqueda.disabled = false;
  // console.log(jugador_random);
}

iniciar();

var lista_autocompletado = document.getElementById("lista_autocompletado");
var input_busqueda = document.getElementById("input_busqueda");

input_busqueda.addEventListener("focus", function(){
  section_nombre_repetido.classList.add("oculto");
});

input_busqueda.addEventListener("input", function(evento){
    var largo_texto = evento.target.value.length;
    if(largo_texto >= 3){
        autocompletado(evento.target.value)
    }else{
        lista_autocompletado.innerHTML = "";
    }
});

function autocompletado(nombre){
  var jugadores =
  fetch("https://futbolle-daw-uai-2026.onrender.com/api/players/search?q="+nombre+"&limit=8")
    .then(response => response.json())
    .then(function(data){
      // console.log(data)
      lista_autocompletado.innerHTML = "";

      for(i=0; i< data.length; i++){

        var li_autocompletado = document.createElement("li");

        li_autocompletado.textContent = data[i].name;
         li_autocompletado.jugador = data[i];
        li_autocompletado.addEventListener("click", function(evento){
            intento_jugador(evento.target.jugador);
        });

        lista_autocompletado.appendChild(li_autocompletado);
      }
      
    })
    .catch(function(err){
      console.log(err);
    });
}

function intento_jugador(jugador){

  iniciarCronometro();

  for(i=0;i<nombres_usados.length;i++){
    if(jugador.name === nombres_usados[i]){
      nombre_repetido();
      return;
    }
  }

  nombres_usados.push(jugador.name);
    
  input_busqueda.value = "";
  lista_autocompletado.innerHTML = "";

  cantidad_correctos = 0;
  armar_fila(jugador.nationality, jugador.club, jugador.position, jugador.age, jugador.overall, jugador.heightCm);
  
  intentos_restantes--;
  actualizar_intentos_restantes(intentos_restantes);
  if(cantidad_correctos === 6){
    var partida = {
      jugador: jugador.name,
      resultado: "Ganado",
      intentos: 8-intentos_restantes,
      fecha: obtenerFecha(),
      duracion: tiempo
    };
    guardar_partida(partida);
    victoria();
    return;
  }

  if(intentos_restantes === 0){
    var partida = {
      jugador: jugador.name,
      resultado: "Perdido",
      intentos: 8,
      fecha: obtenerFecha(),
      duracion: tiempo
    };
    guardar_partida(partida);
    derrota();
    return;
  }

}

var cantidad_correctos = 0;

function armar_fila(nacionalidad, club, posicion, edad, overall, altura){
  var datos = [nacionalidad, club, posicion, edad, overall, altura];
  var datos_jugador_random = [jugador_random.nationality, jugador_random.club, jugador_random.position, jugador_random.age, jugador_random.overall, jugador_random.heightCm];

  var fila = document.createElement("tr");
  fila.classList.add("fila");

  for(i=0;i<datos.length;i++){
    var columna_td = document.createElement("td");
    columna_td.classList.add("celda");
    columna_td.textContent = datos[i];
    
    if(datos[i] === datos_jugador_random[i]){
      columna_td.classList.add("correcto");
      cantidad_correctos++;
    }else{
      columna_td.classList.add("incorrecto");
      if(typeof datos[i] === "number"){
        if(datos[i] > datos_jugador_random[i]){
          columna_td.innerHTML += "<span class='flecha abajo'>↓</span>";
        }else{
          columna_td.innerHTML += "<span class='flecha arriba'>↑</span>"
        }
        
      }
    }

    fila.appendChild(columna_td);
  }

  tablero.appendChild(fila);
}

function borrar_tablero(){
  tablero.innerHTML = "";
}

function reiniciar(){
  input_busqueda.disabled = true;
  iniciar();
  intentos_restantes = 8;
  actualizar_intentos_restantes(intentos_restantes);
  borrar_tablero();
  nombres_usados = [];
  reiniciarCronometro();
}

function nombre_repetido(){
  input_busqueda.value = "";
  lista_autocompletado.innerHTML = "";
  section_nombre_repetido.classList.remove("oculto");
}

function derrota(){
  input_busqueda.disabled = true;
  
  mostrarModalPerdiste(jugador_random);
  detenerCronometro();
}

var modal_derrota = document.getElementById("modal_perdiste");
var contenedor_jugador = document.getElementById("jugador_secreto");
var boton_cerrar_modal_derrota = document.getElementById("btn_cerrar_modal_derrota");

boton_cerrar_modal_derrota.addEventListener("click", function(){
  modal_derrota.classList.add("modal_oculto");
});

function mostrarModalPerdiste(jugador){
  
  contenedor_jugador.innerHTML =
    "<p><strong>Nombre:</strong> " + jugador.name + "</p>" +
    "<p><strong>Nacionalidad:</strong> " + jugador.nationality + "</p>" +
    "<p><strong>Club:</strong> " + jugador.club + "</p>" +
    "<p><strong>Posición:</strong> " + jugador.position + "</p>" +
    "<p><strong>Edad:</strong> " + jugador.age + "</p>" +
    "<p><strong>Overall:</strong> " + jugador.overall + "</p>" +
    "<p><strong>Altura:</strong> " + jugador.heightCm + " cm</p>";

  modal_derrota.classList.remove("modal_oculto");
}

function victoria(){
  input_busqueda.disabled = true;

  mostrarVictoria(tiempo_texto.textContent, 8 - intentos_restantes);
  detenerCronometro();
}

var modal_victoria = document.getElementById("modal_victoria");

var tiempo_span = document.getElementById("tiempo_final");
var intentos_span = document.getElementById("intentos_usados");

function mostrarVictoria(tiempo, intentos) {
  tiempo_span.textContent = tiempo;
  intentos_span.textContent = intentos;

  modal_victoria.classList.remove("modal_oculto");
}

var boton_cerrar_modal_victoria = document.getElementById("btn_cerrar_modal_victoria");
boton_cerrar_modal_victoria.addEventListener("click", function(){
  modal_victoria.classList.add("modal_oculto");
});

var boton_cerrar_modal_historial = document.getElementById("btn_cerrar_modal_historial");
boton_cerrar_modal_historial.addEventListener("click", function() {
  modal_historial.classList.add("modal_oculto");
});

var tiempo = 0;
var intervalo = null;
var cronometro_iniciado = false;
var tiempo_texto = document.getElementById("tiempo");

function iniciarCronometro() {
    if (!cronometro_iniciado) {
        cronometro_iniciado = true;

        intervalo = setInterval(function () {
            tiempo++;
            tiempo_texto.innerHTML = "Tiempo: " + tiempo + "s";
        }, 1000);
    }
}

function detenerCronometro() {
    if (intervalo !== null) {
        clearInterval(intervalo);
        intervalo = null;
    }
}

function reiniciarCronometro() {
    detenerCronometro();
    tiempo = 0;
    cronometro_iniciado = false;
    tiempo_texto.innerHTML = "Tiempo: 0s";
}

var boton_modo = document.getElementById("boton_modo");

boton_modo.addEventListener("click", function () {
  document.body.classList.toggle("modo_oscuro");

  if (document.body.classList.contains("modo_oscuro")) {
    localStorage.setItem("modo", "oscuro");
    boton_modo.textContent = "☀️";
  } else {
    localStorage.setItem("modo", "claro");
    boton_modo.textContent = "🌙";
  }

  if (document.body.classList.contains("modo_oscuro")) {
    localStorage.setItem("modo", "oscuro");
  } else {
    localStorage.setItem("modo", "claro");
  }
});

window.addEventListener("load", function () {
  var modo_guardado = localStorage.getItem("modo");

  if (modo_guardado === "oscuro") {
    document.body.classList.add("modo_oscuro");
    boton_modo.textContent = "☀️";
  }
});

function guardar_partida(datos){
  var historial = localStorage.getItem("historial");

  if(historial){
    historial = JSON.parse(historial);
  }else{
    historial = [];
  }

  historial.push(datos);

  localStorage.setItem("historial", JSON.stringify(historial));
}

function obtenerFecha(){
  var ahora = new Date();

  var año = ahora.getFullYear();
  var mes = ahora.getMonth() + 1;
  var dia = ahora.getDate();
  var horas = ahora.getHours();
  var minutos = ahora.getMinutes();

  if (mes < 10) mes = "0" + mes;
  if (dia < 10) dia = "0" + dia;
  if (horas < 10) horas = "0" + horas;
  if (minutos < 10) minutos = "0" + minutos;

  return año + "-" + mes + "-" + dia + " " + horas + ":" + minutos;
}

var modal_historial = document.getElementById("modal_historial");

function abrirHistorial() {
  modal_historial.classList.remove("modal_oculto");
  renderizarHistorial();
}

function renderizarHistorial() {
  
  var contenedor = document.getElementById("lista_historial");
  var historial = localStorage.getItem("historial");

  if (!historial) {
    contenedor.innerHTML = "<p>No hay partidas</p>";
    return;
  }

  historial = JSON.parse(historial);

  contenedor.innerHTML = "";

  for (var i = 0; i < historial.length; i++) {
    var partida = historial[i];

    var div = document.createElement("div");
    div.className = "item_historial";

    div.innerHTML =
      "<span>Jugador: " + partida.jugador + "</span>" +
      "<span>Resultado: " + partida.resultado + "</span>" +
      "<span>Intentos: " + partida.intentos + "</span>" +
      "<span>Duración: " + partida.duracion + "</span>" +
      "<span>Fecha: " + partida.fecha + "</span>";

    contenedor.appendChild(div);
  }
}

renderizarHistorial();

var orden = "desc";

var boton_ordenar_fecha = document.getElementById("btn_ordenar_fecha");
boton_ordenar_fecha.addEventListener("click", function(){
  var historial = JSON.parse(localStorage.getItem("historial"));

  if(orden === "desc"){
    orden = "asc";
    historial.sort(function(a, b) {
      return new Date(b.fecha) - new Date(a.fecha);
    });
  }else{
    orden = "desc";
    historial.sort(function(a, b) {
      return new Date(a.fecha) - new Date(b.fecha);
    });
  }

  localStorage.setItem("historial", JSON.stringify(historial));
  renderizarHistorial();
});

var boton_ordenar_intentos = document.getElementById("btn_ordenar_intentos");
boton_ordenar_intentos.addEventListener("click", function(){
  var historial = JSON.parse(localStorage.getItem("historial"));

  if(orden === "desc"){
    orden = "asc";
    historial.sort(function(a, b) {
      return a.intentos - b.intentos;
    });
  }else{
    orden = "desc";
    historial.sort(function(a, b) {
      return b.intentos - a.intentos;
    });
  }

  localStorage.setItem("historial", JSON.stringify(historial));
  renderizarHistorial();
});