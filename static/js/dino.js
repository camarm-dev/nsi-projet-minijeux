const scoreElement = document.getElementById('score')
const gameEndStatus = document.getElementById('gameEndStatus')
const arcade = document.querySelector('.arcade')
const game = document.getElementById('game')
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
let randomizationInterval = []

function isCollide(object1, object2) {
    // Check if two objects collides
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
    hideBoxes()
    // Show game
    menu.classList.add("hidden")
    arcade.classList.remove("disabled")

    // Reset animations
    arcade.classList.add("reset")
    setTimeout(() => {
        arcade.classList.remove("reset")
    }, 200)

    // Start game
    scoreInterval = setInterval(updateScore, 2000)
    gameInterval = setInterval(engine, 50)
    setTimeout(() => {
        randomizationInterval.push(setInterval(() => cactus1.style.left = (Math.random() * 100) + 'px', 3000))
    }, 2500) // Start after calculate time: the end of cactus animation. Is executed every 3s (cactus animation duration)
    setTimeout(() => {
        randomizationInterval.push(setInterval(() => cactus2.style.left = (Math.random() * 100) + 'px', 3000))
    }, 7500 + 2500) // Start after calculate time: the animation start (7.5s) + duration to reach end of cactus animation. Is executed every 3s (cactus animation duration)
    setTimeout(() => {
        randomizationInterval.push(setInterval(() => bird.style.left = (Math.random() * 100) + 'px', 4000))
    }, 10000 + 3500) // Start after calculate time: the animation start (10s) + duration to reach end of bird animation. Is executed every 4s (bird animation duration)
    // Time are calculated from animation durantions time, to be sure images are hidden before moving them.
}

function engine() {
    if (isDead()) {
        playing = false
        gameEndStatus.innerText = `Votre score est ${score}.`
        scoreElement.innerText = "0"
        playButton.innerText = "Rejouer"
        sendScore(score, 'dino')
        score = 0
        menu.classList.remove("hidden")
        arcade.classList.add("disabled")
        clearInterval(scoreInterval)
        clearInterval(gameInterval)
        for (const interval of randomizationInterval) {
            clearInterval(interval)
        }
    }
}

window.addEventListener('keydown', (event) => {
    if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault()
        jump()
    }
})
game.addEventListener('click', jump)
playButton.addEventListener('click', play)
