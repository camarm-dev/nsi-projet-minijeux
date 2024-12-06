const gameEndStatus = document.getElementById('gameEndStatus')
const arcade = document.querySelector('.arcade')
const menu = document.getElementById('menu')
const playButton = document.getElementById('play')
const input = document.getElementById('input')
const history = document.getElementById('history')

let tries = 0
let price = 0

function play() {
    // Un nombre entre 1 et 1000
    price = Math.floor(Math.random() * 1000)
    menu.classList.add("hidden")
    arcade.classList.remove("disabled")
    history.innerHTML = '<div class="message">Trouve le nombre entre 0 et 1000 !</div>'
    input.classList.remove('hidden')
}

function endGame() {
    input.classList.add('hidden')
    gameEndStatus.innerText = `Vous avez trouvé en ${tries} essais.`
    playButton.innerText = "Rejouer"
    tries = 0
    menu.classList.remove("hidden")
    arcade.classList.add("disabled")
}

function addToHistory(guess, message) {
    const inputElement = document.createElement('div')
    inputElement.classList.add('input')
    inputElement.innerHTML = `<span>invite@justeprix $~</span><span class="guess">${guess}</span>`
    history.appendChild(inputElement)
    const messageElement = document.createElement('div')
    messageElement.classList.add('message')
    messageElement.innerText = message
    history.appendChild(messageElement)
}

function guess(value) {
    input.value = ""
    tries += 1
    if (value > price) {
        addToHistory(value, "Plus petit !")
    } else if (value < price) {
        addToHistory(value, "Plus grand !")
    } else {
        addToHistory(value, "Juste prix !")
        endGame()
    }
}

input.addEventListener('keyup', (event) => {
    if (event.key == "Enter") {
        guess(input.value)
    }
})
playButton.addEventListener('click', play)
