//constante

const monScore = document.getElementById('monScore');
const boxBalle = document.getElementById('boxBalle');
const cursor = document.getElementById("cursor");
const levelMenu = document.getElementById("levelMenu");
const levelButtons = document.querySelectorAll(".levelButton");
var Score = monScore;


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
    document.getElementById("particleContainer").style.display = "block"; 
    document.body.addEventListener("mousemove", function (e) {
        createParticle(e.clientX, e.clientY);
    });

    // afficher la zone de jeu 
    document.querySelector(".particle").style.display = "block";
    document.getElementById("monScore").style.display = "block";
    document.getElementById("monTimer").style.display = "block";
    document.getElementById("boxBalle").style.display = "block";


    console.log(`Le niveau sélectionné est : ${level}`);
    if (level === "easy") {
        // Config pour le niveau facile
    } else if (level === "medium") {
        // Configpour le niveau moyen
    } else if (level === "hard") {
        // Config pour le niveau difficile
    }
}

// a utilisé pour un bouton revenir au menu
function showMenu() {
    levelMenu.style.display = "flex"; // Montre le menu
    cursor.style.display = "none"; 
    document.querySelector(".particle").classList.add("hidden"); 
}


//curseur
document.body.addEventListener("mousemove", function (e) {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";

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


//Score
boxBalle.addEventListener('click', () => {
Score = Score+1 ;
});





