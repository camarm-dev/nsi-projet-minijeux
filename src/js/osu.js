//constante

const monScore = document.getElementById('monScore');
const boxBalle = document.getElementById('boxBalle');
const cursor = document.getElementById("cursor");
const levelMenu = document.getElementById("levelMenu");
const levelButtons = document.querySelectorAll(".levelButton");
const clickSound = new Audio("audio/click.mp3");

const totalImages = 5;
let score = 0;
let currentImageIndex = 1;
let timer; 
let timeRemaining = 60; 





document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("menu-active");
    cursor.style.display = "none"; // masquer le curseur 
    document.getElementById("particleContainer").style.display = "none"; // cache les particule
});


//Menu
levelButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        const selectedLevel = e.target.dataset.level;
        startGame(selectedLevel);
    });
});


function startGame(level) {
    levelMenu.style.display = "none";
    document.body.classList.remove("menu-active");
    cursor.style.display = "block";

    // Démarrer le compte à rebours
    startCountdown(() => {
        document.getElementById("monScore").style.display = "block";
        document.getElementById("monTimer").style.display = "block";
        document.getElementById("boxBalle").style.display = "block";

        const particleContainer = document.getElementById("particleContainer");
        if (particleContainer) {
            particleContainer.style.display = "block"; // Affiche les particules
        }

        moveBoxBalle(); // Position initiale
        changeCircleImage(); // Première image
        startTimer(); // Démarrer le chronomètre
    });
}

// Fonction pour démarrer le chronomètre
function startTimer() {
    const timerDisplay = document.getElementById("monTimer");

    timer = setInterval(() => {
        timeRemaining--;
        timerDisplay.textContent = `Temps restant : ${timeRemaining}`;

        if (timeRemaining <= 0) {
            clearInterval(timer); 
            endGame(); 
        }
    }, 1000); // mise a jour chaque seconde
}

// écran de fin
function endGame() {
    // cacher le jeu
    document.getElementById("monScore").style.display = "none";
    document.getElementById("monTimer").style.display = "none";
    document.getElementById("boxBalle").style.display = "none";

    // afficher ecran de fin peut etre ajouter ca a l html et au css et de mettre un hidden
    const endScreen = document.createElement("div");
    endScreen.id = "endScreen";
    endScreen.style.position = "fixed";
    endScreen.style.top = "0";
    endScreen.style.left = "0";
    endScreen.style.width = "100vw";
    endScreen.style.height = "100vh";
    endScreen.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    endScreen.style.color = "white";
    endScreen.style.display = "flex";
    endScreen.style.flexDirection = "column";
    endScreen.style.alignItems = "center";
    endScreen.style.justifyContent = "center";
    endScreen.style.fontFamily = "var(--font)";
    endScreen.innerHTML = `
        <h1>Temps écoulé !</h1>
        <p>Votre score : ${score}</p>
        <button id="returnToMenu">Retour au menu</button>
        <style>#returnToMenu{cursor:none;}</style>
    `;

    document.body.appendChild(endScreen);

    // return menu
    document.getElementById("returnToMenu").addEventListener("click", () => {
        document.body.removeChild(endScreen); 
        showMenu(); 
    });
}

// a utilisé pour un bouton revenir au menu
function showMenu() {window.location.reload()}


//curseur
document.body.addEventListener("mousemove", function (e) {
    cursor.style.left = (e.clientX + 5) + "px";
    cursor.style.top = (e.clientY + 5) + "px";

    // gene des particules
    createParticle(e.clientX, e.clientY);
});



function createParticle(x, y) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;


    document.getElementById("particleContainer").appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 1000);
}

//cercle
function moveBoxBalle() {
    const size = 100; 

    
    const randomX = Math.random() * (window.innerWidth - size);
    const randomY = Math.random() * (window.innerHeight - size);
    
    boxBalle.style.left = `${randomX}px`;
    boxBalle.style.top = `${randomY}px`;
}


function changeCircleImage() {
    // mise a jour de l image de fond
    boxBalle.style.backgroundImage = `url('img/${currentImageIndex}.png')`;

    currentImageIndex = (currentImageIndex % totalImages) + 1; 
}

// clic cercle
boxBalle.addEventListener("click", () => {
    const sound = clickSound.cloneNode(); 
    sound.play();
    score++; // +1 au score jsp comment inplementer le meme quand dans osu je pense 
            //peut etre a faire diferente box avec plusieur taille si qlq a une idée
    monScore.textContent = `Score : ${score}`; // mise a jours du score

    moveBoxBalle(); 
    changeCircleImage(); 
});

//couldiwn
function startCountdown(callback) {
    const countdown = document.getElementById("levelCountdown");
    if (!countdown) {
        console.error("Element #levelCountdown introuvable !");
        return;
    }

    countdown.classList.remove("hidden"); // Affiche le compte à rebours

    let countdownValue = 3; 
    countdown.textContent = countdownValue;

    const interval = setInterval(() => {
        countdownValue--; 
        if (countdownValue > 0) {
            countdown.textContent = countdownValue; 
        } else {
            clearInterval(interval); 
            countdown.classList.add("hidden"); 
            callback(); 
        }
    }, 1000); 
}







