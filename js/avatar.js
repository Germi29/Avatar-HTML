// Definición de la clase Avatar
class Avatar {
    constructor(nombre, imagen, vida = 3, ataques = ['Puño', 'Patada', 'Barrida']) {
        this.nombre = nombre;
        this.imagen = imagen;
        this.vida = vida;
        this.ataques = ataques;
    }

    // Método para recibir daño
    recibirDanio() {
        this.vida--;
    }

    // Método para seleccionar un ataque aleatoriamente
    seleccionarAtaque() {
        return this.ataques[Math.floor(Math.random() * this.ataques.length)];
    }
}

// Crear los personajes y agregarlos dinámicamente
let avatares = [];

function agregarPersonaje(nombre, imagen) {
    const nuevoPersonaje = new Avatar(nombre, imagen);
    avatares.push(nuevoPersonaje);
}

// Agregar personajes principales
agregarPersonaje('Zuko', './resources/zuko_radio.png');
agregarPersonaje('Katara', './resources/katara_radio.png');
agregarPersonaje('Aang', './resources/aang_radio.png');
agregarPersonaje('Toph', './resources/toph_radio.png');
agregarPersonaje('Sokka', './resources/sokka_radio.png')

// Función para generar botones de selección de personajes dinámicamente
function generarBotonesPersonajes() {
    const contenedorPersonajes = document.querySelector('.radio-buttons-container');
    contenedorPersonajes.innerHTML = ''; // Limpiar el contenedor

    avatares.forEach(avatar => {
        const radioButton = document.createElement('div');
        radioButton.classList.add('radio-button');

        // Crear input radio
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'personaje';
        input.id = avatar.nombre.toLowerCase();
        input.value = avatar.nombre;
        input.classList.add('radio-button__input');

        // Crear label
        const label = document.createElement('label');
        label.htmlFor = avatar.nombre.toLowerCase();
        label.classList.add('radio-button__label');
        label.innerHTML = `
            <span class="radio-button__custom">
                <img src="${avatar.imagen}" alt="${avatar.nombre}" style="width: 100%; height: 100%; object-fit: cover;">
            </span>
            ${avatar.nombre}
        `;

        // Añadir input y label al radioButton
        radioButton.appendChild(input);
        radioButton.appendChild(label);
        
        // Añadir el radioButton al contenedor
        contenedorPersonajes.appendChild(radioButton);
    });
}

// Eventos de botones
document.getElementById('boton-jugar').addEventListener('click', () => {
    generarBotonesPersonajes();
    iniciarJuego();
});

document.getElementById('boton-reglas').addEventListener('click', mostrarReglas);
document.getElementById('boton-volver-menu').addEventListener('click', volverAlMenu);
document.getElementById('boton-personaje').addEventListener('click', seleccionarPersonaje);
document.getElementById('boton-punio').addEventListener('click', () => seleccionarAtaque('Puño'));
document.getElementById('boton-patada').addEventListener('click', () => seleccionarAtaque('Patada'));
document.getElementById('boton-barrida').addEventListener('click', () => seleccionarAtaque('Barrida'));
document.getElementById('boton-reiniciar').addEventListener('click', reiniciarJuego);

// Función para iniciar el juego
function iniciarJuego() {
    document.getElementById('logo-principal').style.display = "none";
    document.getElementById('inicio').style.display = "none";
    document.getElementById('seleccionar-personaje').style.display = "block";
}

// Función para mostrar las reglas
function mostrarReglas() {
    document.getElementById('logo-principal').style.display = "none";
    document.getElementById('inicio').style.display = "none";
    document.getElementById('reglas-del-juego').style.display = "block";
}

// Función para volver al menú
function volverAlMenu() {
    document.getElementById('reglas-del-juego').style.display = "none";
    document.getElementById('seleccionar-personaje').style.display = "none";
    document.getElementById('seleccionar-ataque').style.display = "none";
    document.getElementById('mensajes').innerHTML = "";
    document.getElementById('logo-principal').style.display = "block";
    document.getElementById('inicio').style.display = "block";
}

// Función para seleccionar el personaje
function seleccionarPersonaje() {
    const personajeSeleccionado = document.querySelector('input[name="personaje"]:checked');
    if (personajeSeleccionado) {
        personajeJugador = avatares.find(avatar => avatar.nombre === personajeSeleccionado.value);
        personajeEnemigo = seleccionarPersonajeAleatorio();

        while (personajeEnemigo === personajeJugador) {
            personajeEnemigo = seleccionarPersonajeAleatorio();
        }

        document.getElementById('personaje-jugador').innerText = personajeJugador.nombre;
        document.getElementById('personaje-enemigo').innerText = personajeEnemigo.nombre;
        document.getElementById('vidas-jugador').innerText = personajeJugador.vida;
        document.getElementById('vidas-enemigo').innerText = personajeEnemigo.vida;

        document.getElementById('seleccionar-personaje').style.display = "none";
        document.getElementById('seleccionar-ataque').style.display = "block";
    } else {
        alert("Por favor, selecciona un personaje.");
    }
}

// Función para seleccionar un ataque
function seleccionarAtaque(ataqueJugador) {
    const ataqueEnemigo = personajeEnemigo.seleccionarAtaque();
    let resultado = '';

    if (ataqueJugador === ataqueEnemigo) {
        resultado = '🤝 Empate!';
    } else if (
        (ataqueJugador === 'Puño' && ataqueEnemigo === 'Barrida') ||
        (ataqueJugador === 'Patada' && ataqueEnemigo === 'Puño') ||
        (ataqueJugador === 'Barrida' && ataqueEnemigo === 'Patada')
    ) {
        personajeEnemigo.recibirDanio();
        resultado = `🏆 ¡${personajeJugador.nombre} gana la ronda! El enemigo eligió ${ataqueEnemigo}.`;
    } else {
        personajeJugador.recibirDanio();
        resultado = `💀 ¡${personajeEnemigo.nombre} gana la ronda! El enemigo eligió ${ataqueEnemigo}.`;
    }

    mostrarMensaje(resultado);
    comprobarFinDelJuego();
}

// Función para mostrar los mensajes
function mostrarMensaje(mensaje) {
    const mensajeSection = document.getElementById('mensajes');
    mensajeSection.innerHTML += `<p>${mensaje}</p>`;
}

// Función para comprobar si alguien ha ganado
function comprobarFinDelJuego() {
    if (personajeJugador.vida === 0) {
        mostrarMensaje(`💀 ¡${personajeEnemigo.nombre} ha ganado el juego!`);
        deshabilitarBotones();
    } else if (personajeEnemigo.vida === 0) {
        mostrarMensaje(`🏆 ¡${personajeJugador.nombre} ha ganado el juego!`);
        confetti({ particleCount: 100, spread: 100, origin: { x: 0, y: 1 }, startVelocity: 30 });
        deshabilitarBotones();
    }

    // Actualizar vidas en pantalla
    document.getElementById('vidas-jugador').innerText = personajeJugador.vida;
    document.getElementById('vidas-enemigo').innerText = personajeEnemigo.vida;
}

// Función para seleccionar un personaje aleatorio
function seleccionarPersonajeAleatorio() {
    return avatares[Math.floor(Math.random() * avatares.length)];
}

// Función para deshabilitar los botones de ataque
function deshabilitarBotones() {
    document.getElementById('boton-punio').disabled = true;
    document.getElementById('boton-patada').disabled = true;
    document.getElementById('boton-barrida').disabled = true;
    document.getElementById('boton-reiniciar').style.display = 'block';
}

// Función para reiniciar el juego
function reiniciarJuego() {
    personajeJugador = null;
    personajeEnemigo = null;
    document.getElementById('vidas-jugador').innerText = '3';
    document.getElementById('vidas-enemigo').innerText = '3';
    document.getElementById('mensajes').innerHTML = '';
    
    document.getElementById('seleccionar-ataque').style.display = 'none';
    document.getElementById('reiniciar').style.display = 'none';
    document.getElementById('seleccionar-personaje').style.display = 'block';

    document.getElementById('boton-punio').disabled = false;
    document.getElementById('boton-patada').disabled = false;
    document.getElementById('boton-barrida').disabled = false;
}
