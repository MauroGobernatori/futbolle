"use strict";

var form = document.getElementById("form-contacto")

form.addEventListener("submit", function(e) {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const asunto = document.getElementById("asunto").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    const nombre_regex = /^[a-zA-Z0-9\s]+$/;
    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    window.location.href = `mailto:ejemplo@example.com?subject=${asunto}&body=${mensaje}`;
});

function mostrarModal(mensaje) {
  const modal = document.getElementById("modal");
  const texto = document.getElementById("modal-mensaje");

  texto.textContent = mensaje;
  modal.style.display = "flex";
}

function cerrarModal() {
  document.getElementById("modal").style.display = "none";
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