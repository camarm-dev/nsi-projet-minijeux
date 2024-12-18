// Constantes
const monScore = document.getElementById('monScore');
const cursor = document.getElementById("cursor");
const levelMenu = document.getElementById("levelMenu");
const levelButtons = document.querySelectorAll(".levelButton");
const countDown = new Audio("/static/audio/arcade-countdown-7007.mp3");
const soundUrls = [
    "/static/audio/click1.mp3",
    "/static/audio/click2.mp3",
    "/static/audio/click3.mp3",
    "/static/audio/click4.mp3"
];
const levelMusic = {
    easy: "/static/audio/easy-level.mp3",    
    medium: "/static/audio/medium-level.mp3",
    hard: "/static/audio/hard-level.mp3"     
};
const totalImages = 5;
const totalSound = 4;
const maxBalles = 3;  
let balles = [];  
let balleID = 0;  
let soundIndex = 0;
let score = 0;
let currentImageIndex = 1;
let timer;
let timeRemaining = 60;
let backgroundMusic;
let balleInterval;
let currentBallSize = 140;


// Initialisation du menu et du curseur
document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("menu-active");
    cursor.style.display = "none"; // masquer le curseur
    document.getElementById("particleContainer").style.display = "none"; // cache les particules
});

// Menu de niveau
levelButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        const selectedLevel = e.target.dataset.level;
        startGame(selectedLevel);
    });
});

// Fonction pour démarrer le jeu
function startGame(level) {
    levelMenu.style.display = "none";
    document.body.classList.remove("menu-active");
    cursor.style.display = "block";


    startCountdown(() => {    
        playLevelMusic(level, () => {
            document.getElementById("monScore").style.display = "block";
            document.getElementById("monTimer").style.display = "block";
            document.getElementById("particleContainer").style.display = "block";

            startTimer();   
            balleInterval = setInterval(createNewBalle, 1000);
        });
    });
}

// Fonction de compte à rebours
function startCountdown(callback) {
    const countdown = document.getElementById("levelCountdown");
    if (!countdown) {
        console.error("Element #levelCountdown introuvable !");
        return;
    }

    countDown.play();
    countdown.classList.remove("hidden");

    let countdownValue = 3;
    countdown.textContent = countdownValue;

    const interval = setInterval(() => {
        countdownValue--;
        countdown.textContent = countdownValue > 0 ? countdownValue : '';
        if (countdownValue <= 0) {
            clearInterval(interval);
            countdown.classList.add("hidden");
            callback();
        }
    }, 1000);
}

// Fonction lance la musique
function playLevelMusic(level, callback) {
    if (backgroundMusic) {
        backgroundMusic.pause(); 
    }

    const musicUrl = levelMusic[level];
    backgroundMusic = new Audio(musicUrl);

    backgroundMusic.play().then(() => {
        console.log("Musique jouée : " + musicUrl);

        
        timeRemaining = Math.ceil(backgroundMusic.duration); 
        callback(); 

    }).catch(err => {
        console.error("Erreur lors de la lecture de la musique :", err);
    });

   
    backgroundMusic.addEventListener("ended", () => {
        endGame();
    });
}

// Fonction pour démarrer le chronomètre
function startTimer() {
    const timerDisplay = document.getElementById("monTimer");

    timer = setInterval(() => {
        timeRemaining--;
        timerDisplay.textContent = `Temps restant : ${timeRemaining} sec`;

        if (timeRemaining <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

// Fonction de fin de jeu
function endGame() {
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0; // Réinitialise la musique
    }

    clearInterval(timer);
    document.getElementById("monScore").style.display = "none";
    document.getElementById("monTimer").style.display = "none";
    document.getElementById("boxBalle").style.display = "none";

    const endScreen = document.createElement("div");
    endScreen.id = "endScreen";
    endScreen.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background-color: rgba(0, 0, 0, 0.8); color: white; display: flex;
        flex-direction: column; align-items: center; justify-content: center;
        font-family: var(--font); cursor: none;`;

    endScreen.innerHTML = `
        <h1>Temps écoulé !</h1>
        <p>Votre score : ${score}</p>
        <button id="returnToMenu">Retour au menu</button>
        <style>#returnToMenu{cursor:none;}</style>`;

    document.body.appendChild(endScreen);

    clearInterval(balleInterval); 
    balles.forEach(b => document.body.removeChild(b.element)); 
    balles = [];
    document.getElementById("returnToMenu").addEventListener("click", () => {
        document.body.removeChild(endScreen);
        showMenu();

        
    });
}

// Fonction pour revenir au menu
function showMenu() {
    window.location.reload();
}

// Crée plusieurs balle
function createNewBalle() {
    if (balles.length >= maxBalles) return;

    const newBalle = document.createElement("div");
    const id = ++balleID;

    // Sélectionner l'image dynamique
    const currentImage = `img/${currentImageIndex}.png`;
    currentImageIndex = (currentImageIndex % totalImages) + 1; // Passer à l'image suivante

    newBalle.className = "balle";
    newBalle.dataset.id = id;

    // Positionnement sécurisé des balles
    const randomX = Math.random() * (window.innerWidth - currentBallSize);
    const randomY = Math.random() * (window.innerHeight - currentBallSize);

    newBalle.style.cssText = `
        position: absolute;
        width: ${currentBallSize}px;
        height: ${currentBallSize}px;
        border-radius: 50%;
        background: url('${currentImage}') no-repeat center/cover;
        left: ${randomX}px;
        top: ${randomY}px;
    `;

    document.body.appendChild(newBalle);
    balles.push({ element: newBalle, id });

    // Gestion des clics
    newBalle.addEventListener("click", () => handleBalleClick(id, newBalle));

    // Suppression automatique après 3 secondes
    setTimeout(() => {
        removeBalle(id);
    }, 3000);
}

// Fonction pour gerer les clique sur les balles
function handleBalleClick(id, balle) {
    if (balles.length === 0 || balles[0].id !== id) {
        
        score -= 1; 
        updateScore();
        return;
    }

    score += 1; 
    updateScore();
    removeBalle(id); 
}

// Suprimer la balle 
function removeBalle(id) {
    const balleIndex = balles.findIndex(b => b.id === id);
    if (balleIndex !== -1) {
        document.body.removeChild(balles[balleIndex].element);
        balles.splice(balleIndex, 1); 
    }
}

function updateScore() {
    monScore.textContent = `Score : ${score}`;
}

// Curseur personnalisé
document.body.addEventListener("mousemove", function (e) {
    cursor.style.left = (e.clientX + 5) + "px";
    cursor.style.top = (e.clientY + 5) + "px";
    createParticle(e.clientX, e.clientY); // Générer des particules
});

// Fonction pour créer des particules
function createParticle(x, y) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    document.getElementById("particleContainer").appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 1000000
);
}





