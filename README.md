⚽ Futbolle

Juego web inspirado en Wordle, donde el objetivo es adivinar un jugador de fútbol a partir de pistas generadas por cada intento.

🎮 Cómo jugar
Ingresás el nombre de un jugador
El sistema compara tu intento con el jugador secreto
Se muestran pistas mediante:
🟩 Coincidencia correcta
🟥 Incorrecto
🔼🔽 Indican si el valor es mayor o menor (edad, altura, etc.)

Ganás cuando adivinás el jugador.

🧠 Mecánicas
Un jugador secreto por partida
Feedback visual en cada intento
Sistema de intentos hasta acertar o perder
Registro de partidas jugadas
🏆 Sistema de puntuación

El puntaje se calcula al ganar la partida:

puntaje = 100 - (intentos - 1) * 10 + bonus
Bonus por tiempo
+20 → menos de 60 segundos
+10 → menos de 120 segundos
+0 → más de 120 segundos
Reglas
Si se pierde → 0 puntos
Puntaje mínimo al ganar → 10 puntos
💾 Historial

Se guarda información de cada partida:

Nombre del jugador
Resultado (ganado/perdido)
Cantidad de intentos
Duración
Puntaje

Usando localStorage.

🛠️ Tecnologías
HTML
CSS
JavaScript
📂 Estructura
.
├── index.html
├── style.css
├── script.js
└── data.js
▶️ Ejecutar el proyecto
Clonar el repositorio
Abrir index.html en el navegador
🚧 Estado

Proyecto en desarrollo / trabajo práctico.

👤 Autor
Mauro Gobernatori