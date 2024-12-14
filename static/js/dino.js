const scoreElement = document.getElementById('score')
const gameEndStatus = document.getElementById('gameEndStatus')
const arcade = document.querySelector('.arcade')
const menu = document.getElementById('menu')
const dino = document.getElementById('dino')
const cactus1 = document.getElementById('cactus1')
const cactus2 = document.getElementById('cactus2')
const bird = document.getElementById('bird')
const playButton = document.getElementById('play')

let score = 0
// Pour arrêter le jeu si le joueur meurt
let playing = true;
// Pour stopper les fonctions à intervals de temps
let scoreInterval = 0
let gameInterval = 0

function isCollide(object1, object2) {
    // Check if TODO documenter la fonction
    const object1Rect = object1.getBoundingClientRect()
    const object2Rect = object2.getBoundingClientRect()
    return !(
        ((object1Rect.top + object1Rect.height) < object2Rect.top) ||
        (object1Rect.top > (object2Rect.top + object2Rect.height)) ||
        ((object1Rect.left + object1Rect.width) < object2Rect.left) ||
        (object1Rect.left > (object2Rect.left + object2Rect.width))
    );
}

function isDead() {
    return isCollide(dino, cactus1) || isCollide(dino, cactus2) || isCollide(dino, bird)
    // return false
}

function jump() {
    // Check if not already jumping
    if (dino.classList.contains("jumping")) return
    dino.classList.add('jumping')
    setTimeout(() => {
        dino.classList.remove('jumping')
    }, 500)
}

function updateScore() {
    score += 1
    scoreElement.innerText = score
}

function play() {
    // Show game
    menu.classList.add("hidden")
    arcade.classList.remove("disabled")

    // Reset animations
    arcade.classList.add("reset")
    setTimeout(() => arcade.classList.remove("reset"), 10)

    // Start game
    scoreInterval = setInterval(updateScore, 2000)
    gameInterval = setInterval(engine, 50)
}

function engine() {
    if (isDead()) {
        playing = false
        gameEndStatus.innerText = `Votre score est ${score}.`
        scoreElement.innerText = "0"
        playButton.innerText = "Rejouer"
        score = 0
        menu.classList.remove("hidden")
        arcade.classList.add("disabled")
        clearTimeout(scoreInterval)
        clearTimeout(gameInterval)
    }
}

window.addEventListener('keydown', (event) => {
    console.log(event.code)
    if (event.code === "Space") {
        event.preventDefault()
        jump()
    }
})
playButton.addEventListener('click', play)
