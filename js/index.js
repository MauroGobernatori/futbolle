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
  console.log(jugador_random);
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

  for(i=0;i<nombres_usados.length;i++){
    if(jugador.name === nombres_usados[i]){
      nombre_repetido();
      return;
    }
  }

  nombres_usados.push(jugador.name);
    
  input_busqueda.value = "";
  lista_autocompletado.innerHTML = "";

  armar_fila(jugador.nationality, jugador.club, jugador.position, jugador.age, jugador.overall, jugador.heightCm);

  intentos_restantes--;
  actualizar_intentos_restantes(intentos_restantes);
}

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
    }else{
      columna_td.classList.add("incorrecto");
    }

    fila.appendChild(columna_td);
  }

  tablero.appendChild(fila);
}

function borrar_tablero(){
  tablero.innerHTML = "";
}

function reiniciar(){
  iniciar();
  intentos_restantes = 8;
  actualizar_intentos_restantes(intentos_restantes);
  borrar_tablero();
  nombres_usados = [];
}

function nombre_repetido(){
  input_busqueda.value = "";
  lista_autocompletado.innerHTML = "";
  section_nombre_repetido.classList.remove("oculto");
}

function derrota(){

}

function victoria(){

}