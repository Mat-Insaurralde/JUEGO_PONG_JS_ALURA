let ancho;
let alto;

let jugadorY;
let jugadorAltura;
let jugadorAnchura;

let computadoraY;
let computadoraAltura;
let computadoraAnchura;

let pelotaX;
let pelotaY;
let pelotaDiametro;
let velocidadPelotaX;
let velocidadPelotaY;
let velocidadInicial = 5;
let incrementoVelocidad = 0.5;

let puntajeJugador = 0;
let puntajeComputadora = 0;

let fondo;

let graficosPelota;
let anguloRotacion = 0;
let velocidadRotacion = 0.1;

let sonidoGolpe;
let sonidoInicio;
let sonidoGameOver;
let sonidoGol;
let sonidoVictoria;

let juegoActivo = false;
let menuActivo = true;
let esPantallaCompleta = false;

function preload() {
    fondo = loadImage('https://mat-insaurralde.github.io/JUEGO_PONG_JS_ALURA/assets/img/background.png');
    sonidoGolpe = loadSound('https://mat-insaurralde.github.io/JUEGO_PONG_JS_ALURA/assets/sounds/ball.wav');
    sonidoInicio = loadSound('https://mat-insaurralde.github.io/JUEGO_PONG_JS_ALURA/assets/sounds/inicio_juego.wav');
    sonidoGameOver = loadSound('https://mat-insaurralde.github.io/JUEGO_PONG_JS_ALURA/assets/sounds/game_over.wav');
    sonidoGol = loadSound('https://mat-insaurralde.github.io/JUEGO_PONG_JS_ALURA/assets/sounds/scored.wav');
    sonidoVictoria = loadSound('https://mat-insaurralde.github.io/JUEGO_PONG_JS_ALURA/assets/sounds/win.wav');
}

function setup() {
    ancho = windowWidth;
    alto = windowHeight;
    jugadorAltura = alto * 0.2;
    jugadorAnchura = ancho * 0.02;
    computadoraAltura = alto * 0.2;
    computadoraAnchura = ancho * 0.02;
    pelotaDiametro = ancho * 0.03;
    createCanvas(ancho, alto);
    graficosPelota = createGraphics(pelotaDiametro, pelotaDiametro);
    sonidoInicio.play();
    updateGraphicsPelota(); // Asegúrate de que el gráfico de la pelota esté actualizado al principio
    resetPelota();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    ancho = windowWidth;
    alto = windowHeight;
    jugadorAltura = alto * 0.2;
    jugadorAnchura = ancho * 0.02;
    computadoraAltura = alto * 0.2;
    computadoraAnchura = ancho * 0.02;
    pelotaDiametro = ancho * 0.03;
    graficosPelota.resize(pelotaDiametro, pelotaDiametro); // Redimensionar el gráfico de la pelota
    updateGraphicsPelota(); // Redibujar el gráfico de la pelota
    resetPelota();
}

function draw() {
    if (menuActivo) {
        // Mostrar el menú
        background(0);
        textSize(32);
        fill(255);
        textAlign(CENTER, CENTER);
        text("Pong Game", width / 2, height / 2 - 40);
        textSize(20);
        text("Presiona ENTER o toca la pantalla para Iniciar", width / 2, height / 2);
        drawFullScreenButton(); // Dibujar el botón en el menú
        return;
    }

    if (!juegoActivo) {
        // Mostrar mensaje de fin de juego
        background(fondo);
        stroke(255);
        strokeWeight(4);
        noFill();
        rect(0, 0, width, height);
        
        textSize(28);
        textAlign(CENTER, TOP);
        noStroke();
        let marcadorColor = color(102, 255, 102);
        fill(marcadorColor);
        text(puntajeJugador, width / 4 + 150, 10);
        text(puntajeComputadora, 3 * width / 4 - 150, 10);

        textSize(40);
        textAlign(CENTER, CENTER);
        text(puntajeJugador === 5 ? "¡Jugador Gana!" : "¡Computadora Gana!", width / 2, height / 2);
        textSize(20);
        text("Presiona ENTER o toca la pantalla para Reiniciar", width / 2, height / 2 + 50);
        drawFullScreenButton(); // Dibujar el botón en la pantalla de fin de juego
        return;
    }

    // Dibujar fondo
    background(fondo);
    
    // Dibujar marco
    stroke(255);
    strokeWeight(4);
    noFill();
    rect(0, 0, width, height);
    
    // Dibujar marcador
    textSize(28);
    textAlign(CENTER, TOP);
    noStroke();
    let marcadorColor = color(102, 255, 102);
    fill(marcadorColor);
    text(puntajeJugador, width / 4 + 150, 10);
    text(puntajeComputadora, 3 * width / 4 - 150, 10);

    // Dibujar jugador
    drawRaqueta(20, jugadorY, jugadorAnchura, jugadorAltura);
    
    // Dibujar computadora
    drawRaqueta(width - 30, computadoraY, computadoraAnchura, computadoraAltura);
    
    // Actualizar y dibujar la pelota con rotación
    updateGraphicsPelota();
    push();
    translate(pelotaX, pelotaY);
    rotate(anguloRotacion); // Aplicar rotación continua
    imageMode(CENTER);
    image(graficosPelota, 0, 0);
    pop();
    
    // Movimiento de la pelota
    pelotaX += velocidadPelotaX;
    pelotaY += velocidadPelotaY;
    
    // Actualizar el ángulo de rotación basado en la velocidad
    anguloRotacion += velocidadRotacion * (abs(velocidadPelotaX) + abs(velocidadPelotaY)) / 10;
    
    // Rebote en bordes superior e inferior
    if (pelotaY < 0 || pelotaY > height) {
        velocidadPelotaY *= -1;
    }
    
    // Rebote en raqueta del jugador
    if (pelotaX < 30 + jugadorAnchura && pelotaY > jugadorY && pelotaY < jugadorY + jugadorAltura) {
        let impacto = (pelotaY - jugadorY - jugadorAltura / 2) / (jugadorAltura / 2);
        velocidadPelotaX *= -1;
        velocidadPelotaY = impacto * 5;
        velocidadPelotaX += incrementoVelocidad * Math.sign(velocidadPelotaX);
        velocidadPelotaY += incrementoVelocidad * Math.sign(velocidadPelotaY);
        sonidoGolpe.play();
    }
    
    // Rebote en raqueta de la computadora
    if (pelotaX > width - 30 - computadoraAnchura && pelotaY > computadoraY && pelotaY < computadoraY + computadoraAltura) {
        let impacto = (pelotaY - computadoraY - computadoraAltura / 2) / (computadoraAltura / 2);
        velocidadPelotaX *= -1;
        velocidadPelotaY = impacto * 5;
        velocidadPelotaX += incrementoVelocidad * Math.sign(velocidadPelotaX);
        velocidadPelotaY += incrementoVelocidad * Math.sign(velocidadPelotaY);
        sonidoGolpe.play();
    }
    
    // Movimiento de la computadora
    if (pelotaY < computadoraY + computadoraAltura / 2) {
        computadoraY -= 4;
    } else {
        computadoraY += 4;
    }
    
    // Movimiento del jugador usando teclas y eventos táctiles
    if (keyIsDown(UP_ARROW) || (touches.length > 0 && touches[0].x < width / 2)) {
        jugadorY -= 5;
    }
    if (keyIsDown(DOWN_ARROW) || (touches.length > 0 && touches[0].x > width / 2)) {
        jugadorY += 5;
    }
    
    // Limitar movimiento del jugador y de la computadora
    jugadorY = constrain(jugadorY, 0, height - jugadorAltura);
    computadoraY = constrain(computadoraY, 0, height - computadoraAltura);
    
    // Reiniciar pelota si alguien no la alcanza y actualizar puntaje
    if (pelotaX < 0) {
        puntajeComputadora++;
        sonidoGol.play();
        resetPelota();
    } else if (pelotaX > width) {
        puntajeJugador++;
        sonidoGol.play();
        resetPelota();
    }

    // Dibujar el botón de pantalla completa
    drawFullScreenButton();
}

function drawRaqueta(x, y, ancho, alto) {
    // Crear un gradiente de color verde fosforescente
    let gradiente = drawingContext.createLinearGradient(0, y, 0, y + alto);
    gradiente.addColorStop(0, color(102, 255, 102));
    gradiente.addColorStop(1, color(0, 128, 0));
    drawingContext.fillStyle = gradiente;
    noStroke();
    rect(x, y, ancho, alto);
}

function updateGraphicsPelota() {
    graficosPelota.clear();
    graficosPelota.noStroke();
    let gradiente = graficosPelota.drawingContext.createRadialGradient(
        pelotaDiametro / 2, pelotaDiametro / 2, 5,
        pelotaDiametro / 2, pelotaDiametro / 2, pelotaDiametro / 2
    );
    gradiente.addColorStop(0, color(102, 255, 102));
    gradiente.addColorStop(1, color(0, 128, 0));
    graficosPelota.drawingContext.fillStyle = gradiente;
    graficosPelota.ellipse(pelotaDiametro / 2, pelotaDiametro / 2, pelotaDiametro);
}

function resetPelota() {
    if (puntajeJugador === 5 || puntajeComputadora === 5) {
        juegoActivo = false;
        if (puntajeComputadora === 5) {
            sonidoGameOver.play();
        } else if (puntajeJugador === 5) {
            sonidoVictoria.play();
        }
        return;
    }
    pelotaX = width / 2;
    pelotaY = height / 2;
    let angulo = random(-PI / 4, PI / 4);
    if (random(1) < 0.5) {
        velocidadPelotaX = velocidadInicial * cos(angulo);
    } else {
        velocidadPelotaX = -velocidadInicial * cos(angulo);
    }
    velocidadPelotaY = velocidadInicial * sin(angulo);
    jugadorY = height / 2 - jugadorAltura / 2;
    computadoraY = height / 2 - computadoraAltura / 2;
}

// Manejo de eventos del teclado para iniciar o reiniciar el juego
function keyPressed() {
    if (keyCode === ENTER) {
        if (menuActivo) {
            menuActivo = false;
            juegoActivo = true;
            resetPelota();
        } else if (!juegoActivo) {
            puntajeJugador = 0;
            puntajeComputadora = 0;
            resetPelota();
            juegoActivo = true;
        }
    }
}

// Manejo de eventos táctiles para reiniciar el juego
function touchStarted() {
    if (!juegoActivo || puntajeJugador === 5 || puntajeComputadora === 5) {
        menuActivo = false;
        juegoActivo = true;
        puntajeJugador = 0;
        puntajeComputadora = 0;
        resetPelota();
        return false; // Prevenir el comportamiento predeterminado del evento táctil
    }
    return false; // Prevenir el comportamiento predeterminado del evento táctil
}

function drawFullScreenButton() {
    let botonTamano = 50;
    let botonColor = color(102, 255, 102);
    fill(botonColor);
    noStroke();
    rect(width - botonTamano - 10, 10, botonTamano, botonTamano, 10);

    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(esPantallaCompleta ? "⛶" : "⛶", width - botonTamano / 2 - 10, 10 + botonTamano / 2);

    if (mouseIsPressed && mouseX > width - botonTamano - 10 && mouseX < width - 10 && mouseY > 10 && mouseY < 10 + botonTamano) {
        toggleFullScreen();
    }
}

function toggleFullScreen() {
    let fs = fullscreen();
    fullscreen(!fs);
    esPantallaCompleta = !fs;
}
