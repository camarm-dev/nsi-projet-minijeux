// Constantes
const monScore = document.getElementById('monScore');
const boxBalle = document.getElementById('boxBalle');
const cursor = document.getElementById("cursor");
const levelMenu = document.getElementById("levelMenu");
const levelButtons = document.querySelectorAll(".levelButton");
const countDown = new Audio("audio/arcade-countdown-7007.mp3");
const soundUrls = [
    "/static/audio/click1.mp3",
    "/static/audio/click2.mp3",
    "/static/audio/click3.mp3",
    "/static/audio/click4.mp3"
];
const musicUrls = {
    easy: "/static/audio/easy-level.mp3",
    medium: "/static/audio/medium-level.mp3",
    hard: "/static/audio/hard-level.mp3"
};
const totalImages = 5;
const totalSound = 4;
let soundIndex = 0;
let score = 0;
let currentImageIndex = 1;
let timer;
let timeRemaining = 60;
let currentMusic; // Musique courante

// tone.js
let player; // Lecture
let meter; // Analyse
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let analyser;

// Initialisation du player (son initial)
player = new Tone.Player(musicUrls.easy).toDestination();

// Démarrer l'AudioContext au clic
document.addEventListener('click', function() {
    console.log("Clique détecté");
    Tone.start().then(() => {
        console.log("AudioContext démarré");
        startGame('easy');
    }).catch(error => {
        console.error("Erreur lors du démarrage de l'AudioContext", error);
    });
});

// Fonction de préchargement des sons
const preloadedSounds = soundUrls.map(url => {
    const audio = new Audio(url);
    audio.load();
    return audio;
});

// Initialisation du menu et du curseur
document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("menu-active");
    cursor.style.display = "none"; // Masquer le curseur
    document.getElementById("particleContainer").style.display = "none"; // Cacher les particules
});

// Menu de niveau
levelButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        const selectedLevel = e.target.dataset.level;
        Tone.start();
        startGame(selectedLevel);
    });
});

// Fonction pour vérifier si le fichier audio existe
function checkMusicExists(url) {
    return new Promise((resolve, reject) => {
        const audio = new Audio(url);
        audio.onload = () => resolve(true);
        audio.onerror = () => reject(false);
    });
}

// Fonction pour démarrer le jeu
function startGame(level) {
    levelMenu.style.display = "none";
    document.body.classList.remove("menu-active");
    cursor.style.display = "block";

    // Vérifier si la musique existe avant de commencer
    checkMusicExists(musicUrls[level])
        .then(() => {
            startCountdown(() => {
                document.getElementById("monScore").style.display = "block";
                document.getElementById("monTimer").style.display = "block";
                document.getElementById("boxBalle").style.display = "block";
                document.getElementById("particleContainer").style.display = "block"; // Afficher les particules

                // Mettre en pause la musique actuelle
                if (currentMusic) {
                    currentMusic.pause();
                }

                // Charger et démarrer la musique
                player.load(musicUrls[level]).then(() => {
                    player.start();
                    currentMusic = new Audio(musicUrls[level]);
                    currentMusic.play();
                }).catch(error => {
                    console.error("Erreur de lecture de la musique", error);
                });

                // Initialiser les éléments du jeu
                syncBallsWithTempo(); // Synchronisation
                moveBoxBalle(); // Position initiale
                changeCircleImage(); // Première image
                startTimer(); // Démarrer le chronomètre
            });
        })
        .catch(() => {
            console.error("Le fichier audio pour ce niveau est manquant.");
        });
}

// Fonction pour synchroniser les balles avec le tempo
function syncBallsWithTempo() {
    analyser = audioContext.createAnalyser();
    player.connect(analyser);
    analyser.connect(audioContext.destination);

    const rhythmInterval = 100;
    const syncInterval = setInterval(() => {
        const bassData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(bassData);

        const bass = bassData.slice(0, 10);
        const bassLevel = bass.reduce((a, b) => a + b) / bass.length;

        if (bassLevel > 100) {
            moveBoxBalle();
            changeCircleImage();
        }

        if (player.state === "stopped") {
            clearInterval(syncInterval);
        }
    }, rhythmInterval);
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
    }, 1000);
}

// Fonction de fin de jeu
function endGame() {
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

    document.getElementById("returnToMenu").addEventListener("click", () => {
        document.body.removeChild(endScreen);
        showMenu();
    });
}

// Fonction pour revenir au menu
function showMenu() {
    window.location.reload();
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
    }, 1000);
}

// Fonction pour déplacer la balle
function moveBoxBalle() {
    const size = parseInt(getComputedStyle(boxBalle).width, 10);
    const randomX = Math.random() * (window.innerWidth - size - 100);
    const randomY = Math.random() * (window.innerHeight - size - 100);
    
    boxBalle.style.left = `${randomX}px`;
    boxBalle.style.top = `${randomY}px`;
}

// Fonction pour changer l'image de la balle
function changeCircleImage() {
    boxBalle.style.backgroundImage = `url('img/${currentImageIndex}.png')`;
    currentImageIndex = (currentImageIndex % totalImages) + 1;
}

//Clic sur la balle
boxBalle.addEventListener("click", () => {
    score++;
    const sound_Url = soundUrls[soundIndex];
    if (sound_Url) {
        const audio = new Audio(sound_Url);
        audio.play().catch(err => console.error(`Erreur lors de la lecture du son : ${err.message}`));
    }
    soundIndex = (soundIndex + 1) % totalSound;
    monScore.textContent = `Score : ${score}`;

    moveBoxBalle();
    changeCircleImage();
});




