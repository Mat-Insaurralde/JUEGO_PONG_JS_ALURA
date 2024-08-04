let ancho = 800;
let alto = 400;

let jugadorY;
let jugadorAltura = 70;
let jugadorAnchura = 10;

let computadoraY;
let computadoraAltura = 70;
let computadoraAnchura = 10;

let pelotaX;
let pelotaY;
let pelotaDiametro = 20;
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

let juegoActivo = false; // Cambiado a false para mostrar el menú al inicio
let menuActivo = true; // Variable para gestionar el menú

function preload() {
    fondo = loadImage('../assets/img/background.png');
    sonidoGolpe = loadSound('../assets/sounds/ball.wav');
    sonidoInicio = loadSound('../assets/sounds/inicioJuego.wav');
    sonidoGameOver = loadSound('../assets/sounds/gameOver.wav');
    sonidoGol = loadSound('../assets/sounds/scored.wav');
    sonidoVictoria = loadSound('../assets/sounds/win.wav');
}

function setup() {
    createCanvas(ancho, alto);
    graficosPelota = createGraphics(pelotaDiametro, pelotaDiametro);
    sonidoInicio.play();
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
        text("Presiona ENTER para Iniciar", width / 2, height / 2);
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
        text("Presiona ENTER para Reiniciar", width / 2, height / 2 + 50);
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
    
    // Movimiento del jugador
    if (keyIsDown(UP_ARROW)) {
        jugadorY -= 5;
    }
    if (keyIsDown(DOWN_ARROW)) {
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
