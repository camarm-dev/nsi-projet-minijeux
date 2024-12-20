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
    // verif case deja occuper
    if (e.target.innerHTML !== '') {
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
        setTimeout(botPlay, 500); // paus pour simuler le temps d un humain mdr
    }
}

function botPlay() {
    const emptyCells = [...cells].filter(cell => cell.innerHTML === '');
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    if (randomCell) {
        randomCell.innerHTML = playerturn;

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
}
function realoadGame(){window.location.reload()}
