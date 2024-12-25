// constante

const cells = document.querySelectorAll('.cell');
const gamestatus =  document.getElementById('gameStatus');
const endgamestatus =  document.getElementById('end_game_statue');
const playerOne = 'X'; const playerTwo ='O';
const menu = document.getElementById('gameMenu');
const board = document.querySelector('.board');
const twoPlayersBtn = document.getElementById('twoPlayers');
const vsRobotBtn = document.getElementById('vsRobot');
const emptyCells = [...cells].filter(cell => cell.innerHTML === '');
let isVsRobot = false;
let playerturn = playerOne ;
let canPlay = true

const winningpaterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]


// menu depart
board.style.display = 'none';

//choix du mode
twoPlayersBtn.addEventListener('click', () => {
    isVsRobot = false;
    startGame();
});

vsRobotBtn.addEventListener('click', () => {
    isVsRobot = true;
    startGame();
});

function startGame() {
    // Cacher les messages d'erreur
    hideBoxes()
    menu.classList.add('hidden');
    board.style.display = 'flex';
    document.getElementById('gameStatus').classList.remove('hidden');
}


//animation des cellules
cells.forEach((cell, index) => {
    cell.addEventListener('mouseenter', () => {

        cell.classList.add('highlight');

        // detecter et surligner les voisines
        const isNotTopRow = index >= 3;
        const isNotBottomRow = index < 6;
        const isNotFirstCol = index % 3 !== 0;
        const isNotLastCol = index % 3 !== 2;

        // bordure du haut
        if (isNotTopRow) {
            cells[index - 3].style.borderBottomColor = 'var(--hover)';
        }

        // bordure du bas
        if (isNotBottomRow) {
            cells[index + 3].style.borderTopColor = 'var(--hover)';
        }

        // bordure de gauche
        if (isNotFirstCol) {
            cells[index - 1].style.borderRightColor = 'var(--hover)';
        }

        // bordure de droite
        if (isNotLastCol) {
            cells[index + 1].style.borderLeftColor = 'var(--hover)';
        }
    });

    cell.addEventListener('mouseleave', () => {
        // reinitialiser la classe et les style
        cells.forEach(c => {
            c.classList.remove('highlight');
            c.style.borderColor = ''; // reinitialiser la couleur des bordure
        });
    });
});





// debut du morpion

cells.forEach(cell =>{
    cell.addEventListener('click', playGame, {once: true})
})


function playGame(e) {
    // verif case deja occuper ou bot entrain de jouer
    if (e.target.innerHTML !== '' || !canPlay) {
        return;
    }

    e.target.innerHTML = playerturn;

    //verif des win
    if (checkWin(playerturn)) {
        updateGamesStatus("wins" + playerturn);
        return endGame();
    } else if (checkdraw()) {
        updateGamesStatus("draw");
        return endGame();
    }

    // alterner les joueur
    updateGamesStatus(playerturn);
    playerturn = playerturn === playerOne ? playerTwo : playerOne;

    // mode Robot
    if (isVsRobot && playerturn === playerTwo) {
        canPlay = false
        setTimeout(() => {
            botPlay()
            canPlay = true
        }, 500); // paus pour simuler le temps d un humain mdr
    }
}

function getBoard() {
    // On renvoie la partie sous forme de liste: [[]]
    return [...cells].map(cell => cell.innerHTML)
}

function getPossibleMoves(boardObject) {
    // On renvoie les index des cases vides
    const possibleMoves = []
    let index = 0
    for (const cell of boardObject) {
        if (cell === '') {
            possibleMoves.push(index)
        }
        index += 1
    }
    return possibleMoves
}

function winBoardSimulation(simulationBoard, player = 'O') {
    // On regarde si il y a une victoire dans la simulation de jeu donnée
    return winningpaterns.some(combination => combination.every(index => simulationBoard[index] == player ))
}

function botPlay() {
    const boardStatus = getBoard() // On récupère le tableau de jeu (liste avec le contenu des cellules)
    const possibleMoves = getPossibleMoves(boardStatus) // On récupère les moves possibles (cases vides)

    // Si c'est le premier tour, on joue aléatoirement pour éviter de faire le même mouvement à chaque partie
    const firstTurn = possibleMoves.length === 8
    let dangerPosition= false // On garde en mémoire si l'adversaire peut gagner au prochain tour
    let boardCopy
    let cellNumber = possibleMoves[0]
    if (!firstTurn) {
        const enemyPlayer = playerturn === 'O' ? 'X': 'O'
        // D'abord, on regarde si l'adversaire peut gagner en un mouvement, pour le bloquer (haha 😈)
        for (const move of possibleMoves) {
            boardCopy = [...boardStatus]
            // On simule un mouvement de l'adversaire
            boardCopy[move] = enemyPlayer
            if (winBoardSimulation(boardCopy, enemyPlayer)) {
                dangerPosition = true
                cellNumber = move
                break
            }
        }
    }


    if (!dangerPosition && !firstTurn) {
        // On parcours les cases vides, on simule un déplacement, et on regarde si il y a victoire
        // Si il n'y a pas de victoire possible en un mouvement, on répète l'opération
        let secondLayerPossibleMoves
        for (const move of possibleMoves) {
            boardCopy = [...boardStatus]
            boardCopy[move] = playerturn
            if (winBoardSimulation(boardCopy)) {
                cellNumber = move
                break
            }
            secondLayerPossibleMoves = getPossibleMoves(boardCopy)
            for (const secondLayerMove of secondLayerPossibleMoves) {
                boardCopy[move] = playerturn
                if (winBoardSimulation(boardCopy)) {
                    cellNumber = move
                    break
                }
            }
        }
    }

    if (firstTurn) {
        cellNumber = possibleMoves[Math.round(Math.random() * possibleMoves.length)]
    }

    const cell = cells[cellNumber];
    if (cell) {
        cell.innerHTML = playerturn;

        if (checkWin(playerturn)) {
            updateGamesStatus("wins" + playerturn);
            return endGame();
        } else if (checkdraw()) {
            updateGamesStatus("draw");
            return endGame();
        }

        // repasser au j 1
        updateGamesStatus(playerturn);
        playerturn = playerOne;
    }
}

function checkWin(playerturn){
    return winningpaterns.some(combination =>{
        return combination.every(index =>{
            return cells[index].innerHTML == playerturn
        })
    })
}

function checkdraw(){
    return [...cells].every(cell =>{
        return cell.innerHTML == playerOne || cell.innerHTML == playerTwo;

    });
}

function updateGamesStatus(status){
    let statusTexte, points, gameEnd;

    switch(status){
        case 'X':
            statusTexte = "Au tour du joueur 2(O)";
            break;
        case 'O':
            statusTexte = "Au tour du joueur 1(X)";
            break;
        case 'winsX':
            statusTexte = "Le joueur 1(X) a gagné!";
            points = 5
            gameEnd = true
            break;
        case 'winsO':
            points = 0
            statusTexte = isVsRobot ? "Le robot(O) a gagné!" : "Le joueur 2(O) a gagné!";
            gameEnd = true
            break;
        case 'draw':
            points = 1
            statusTexte = "Égalité!";
            gameEnd = true
            break;
    }

    if (isVsRobot && gameEnd) {
        sendScore(points, 'morpion')
    }

    gamestatus.innerHTML = statusTexte;
    endgamestatus.innerHTML = statusTexte;

}

function endGame() {
    document.getElementById('game_end').style.display = "flex"
    gamestatus.classList.add('hidden')
    replayCooldown()
}

function replayCooldown() {
    const button = document.getElementById('reload')
    button.disabled = true
    button.textContent = 'Rejouer dans 3...'
    setTimeout(() => button.textContent = 'Rejouer dans 2...', 1000)
    setTimeout(() => button.textContent = 'Rejouer dans 1...', 2000)
    setTimeout(() => button.textContent = 'Rejouer dans 0...', 3000)
    setTimeout(() => {
        button.removeAttribute('disabled')
        button.textContent = 'Rejouer'
    }, 4000)
}

function reloadGame(){window.location.reload()}
