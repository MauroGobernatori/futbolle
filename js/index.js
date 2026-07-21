var lista_autocompletado = document.getElementById("lista_autocompletado");
var input_busqueda = document.getElementById("input_busqueda");

var jugador_random = 
fetch("https://futbolle-daw-uai-2026.onrender.com/api/players/random")
  .then(response => response.json())
  .then(function(data){
    // console.log(data)
    input_busqueda.disabled = false;
  })
  .catch(function(err){
    console.log(err);
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
        li_autocompletado.addEventListener("click", function(evento){
            intento_jugador(evento.target.textContent);
        });

        lista_autocompletado.appendChild(li_autocompletado);

    }
    
  })
  .catch(function(err){
    console.log(err);
  });

}

function intento_jugador(nombre){
    
    // input_busqueda.value = nombre;
    // autocompletado(nombre);

}