
// constante

const cells = document.querySelectorAll('.cell');
const gamestatus =  document.getElementById('gameStatus');
const endgamestatus =  document.getElementById('end_game_statue');
const playerOne = 'X'; const playerTwo ='O';
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


function playGame(e){
    e.target.innerHTML = playerturn;

    //verif des wins
    if (checkWin(playerturn)){
        updateGamesStatus("wins" + playerturn);
        return endGame();
    } else if(checkdraw()){
        updateGamesStatus("draw");
        return endGame();
    }

    //tours
    updateGamesStatus(playerturn)
    playerturn == playerOne ? playerturn = playerTwo : playerturn = playerOne ;
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
    let statusTexte;

    switch(status){
        case 'X':
            statusTexte = "Au tour du joueur 2(O)";
            break;
        case 'O':
            statusTexte = "Au tour du joueur 1(X)";
            break;
        case 'winsX':
            statusTexte = "Le joueur 1(X) a gagné!";
            break;
        case 'winsO':
            statusTexte = "Le joueur 2(O) a gagné!";
            break;
        case 'draw':
            statusTexte = "Egalité!";
            break;
    }

    gamestatus.innerHTML = statusTexte;
    endgamestatus.innerHTML = statusTexte;

}

function endGame(){document.getElementById('game_end').style.display = "block"}
function realoadGame(){window.location.reload()}