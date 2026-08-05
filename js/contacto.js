"use strict";

var form = document.getElementById("form-contacto");

var boton_cerrar_modal = document.getElementById("cerrar_modal");
var boton_modo = document.getElementById("boton_modo");

boton_cerrar_modal.addEventListener("click", function(e){
    cerrarModal();
});

form.addEventListener("submit", function(e) {

    e.preventDefault();

    var nombre = document.getElementById("nombre").value.trim();
    var email = document.getElementById("email").value.trim();
    var asunto = document.getElementById("asunto").value.trim();
    var mensaje = document.getElementById("mensaje").value.trim();

    var nombre_regex = /^[a-zA-Z0-9\s]+$/;
    var email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombre_regex.test(nombre)) {
        mostrarModal("El nombre debe ser alfanumérico");
        return;
    }

    if (!email_regex.test(email)) {
        mostrarModal("El email no es válido");
        return;
    }

    if (asunto.length < 5) {
        mostrarModal("El asunto debe tener al menos 5 caracteres");
        return;
    }

    if (mensaje.length < 5) {
        mostrarModal("El mensaje debe tener al menos 5 caracteres");
        return;
    }

    window.location.href = "mailto:ejemplo@example.com?subject=" 
    + encodeURIComponent(asunto) 
    + "&body=" 
    + encodeURIComponent(mensaje);
});

function mostrarModal(mensaje) {
    var modal = document.getElementById("modal");
    var texto = document.getElementById("modal_mensaje");

    texto.textContent = mensaje;
    modal.style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modal").style.display = "none";
}

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