
const items = ["rock", "paper", "scissors"]
const button = document.getElementById('play')
const menu = document.getElementById('menu')
const choices = document.querySelectorAll('.item')
const playingElement = document.getElementById('playing')
const resultsElement = document.getElementById('results')
const userElement = document.getElementById('user')
const computerElement = document.getElementById('computer')
const winnerElement = document.getElementById('winner')
const userRouletteImages = document.querySelectorAll('.userRoulette')

let currentGame = {
    winner: null,
    computer: '',
    user: ''
}

let winText = ''
let score = 0

button.addEventListener('click', play)
choices.forEach(el => {
    el.addEventListener('click', () => {
        const userChoice = chooseItem(el)
        const computerChoice = chooseComputer()
        // Show results screen, animated, then show results
        startAnimation()
        currentGame.winner = getWinner(currentGame.computer, currentGame.user)
        if (currentGame.winner === 'user') {
            winText = 'Vous avez gagné !'
        } else if (currentGame.winner == 'computer') {
            winText = 'Vous avez perdu'
        } else {
            winText = 'Match nul !'
        }
        userElement.src = `/static/img/${userChoice}.png`
        for (const image of userRouletteImages) {
            image.src = `/static/img/${userChoice}.png`
        }
        setTimeout(() => {
            resultsElement.classList.remove('animated')
            computerElement.src = `/static/img/${computerChoice}.png`
            winnerElement.textContent = winText
            menu.classList.remove('hidden')
            sendScore(score, 'pfc')
        }, 1800)
        setTimeout(() => {
            winnerElement.textContent = 'Feuille !'
        }, 600)
        setTimeout(() => {
            winnerElement.textContent = 'Ciseaux !'
        }, 1400)
    })
})

function resetAnimation() {
    resultsElement.classList.remove('animated')
    winnerElement.textContent = 'Pierre !'
    computerElement.src = `/static/img/rock.png`
    userElement.src = `/static/img/rock.png`
    for (const image of userRouletteImages) {
        image.src = `/static/img/rock.png`
    }
}

function getWinner(computer, user) {
    const computerIndex = items.indexOf(computer)
    const userIndex = items.indexOf(user)
    if (computerIndex == userIndex) {
        score = 1
        return null
    } else if ((computerIndex + 1) % 3 == userIndex) {
        score = 5
        return 'user'
    } else {
        score = 0
        return 'computer'
    }
}

function chooseItem(itemElement) {
    const choice = itemElement.getAttribute('data-item')
    currentGame.user = choice
    return choice
}

function chooseComputer() {
    const choice = items[Math.floor(Math.random() * items.length)]
    currentGame.computer = choice
    return choice
}

function play() {
    resetAnimation()
    hideBoxes()
    button.classList.add('hidden')
    menu.classList.add('hidden')
    playingElement.classList.remove('hidden')
    resultsElement.classList.add('hidden')
}

function startAnimation() {
    button.classList.remove('hidden')
    playingElement.classList.add('hidden')
    resultsElement.classList.remove('hidden')
    resultsElement.classList.add('animated')
}
