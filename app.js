const cellElements = document.querySelectorAll('[data-cell]');
const subBoards = document.querySelectorAll ('.sub-board');
const endgameScreen = document.getElementById('endgameScreen');
const winMessageText = document.querySelector('[data-endgame-msg-text]');
const board = document.getElementById('board')
const cellElementMatrix = populateCellElementMatrix();
const restartButton = document.getElementById('restart-button'); 

let currentTurn = board.classList[1]; // can have 'x' or 'O' 
const WIN_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];
function populateCellElementMatrix (){
    const Matrix = new Array(9)
    for (i=0 ; i < 9 ; i++){
        Matrix[i] = subBoards[i].querySelectorAll('[data-cell]')
    }
    return Matrix
}

//  Start-game , End-game and Reset ================================================================= 
startGame()
restartButton.addEventListener('click',resetGame)

function startGame(){
    cellElementMatrix.forEach(subBoard =>subBoard.forEach(cell => {
        cell.addEventListener('click', handleClick, {once: true})
    }))
}

function endGame(winState){
    switch (winState){
        case 'x':
            winMessageText.innerText = 'X Is The Winner';
            break;  
        case 'O':
            winMessageText.innerText = 'O Is The Winner';
            break;  
        case 'draw':
            winMessageText.innerText =  "It's a Draw Play again"
            break;  
    }
    endgameScreen.classList.add('show')
}

function resetGame() {
    
    if (endgameScreen.classList.contains('show')){
        endgameScreen.classList.remove('show')
    }

    for (i=0 ; i<9 ; i++) {
        cellElementMatrix[i].forEach(cell => {
            cell.classList.replace('x','free')
            cell.classList.replace('O','free')
            cell.removeEventListener('click',handleClick)
        });
    }
    subBoards.forEach(subBoard => {
        subBoard.classList.replace('x','free')
        subBoard.classList.replace('O','free')
        subBoard.classList.replace('draw','free')

        subBoard.querySelector('.sub-board-state-screen').classList.replace('x','free')
        subBoard.querySelector('.sub-board-state-screen').classList.replace('O','free')
        subBoard.querySelector('.sub-board-state-screen').classList.replace('draw','free')
    });

    startGame()
}

//  Click handeling ===============================================================================
function handleClick(ellement){
    const cell = ellement.target;

    placeMark (cell,currentTurn);    
    checkSubBoardForWin();
    
    if (checkForWin(currentTurn,subBoards)) {
        endGame(currentTurn);
    } else if (isDraw(subBoards)) {
        endGame('draw');
    }
    
    switchTurn ();
}

//  Up-keep  ==================================================================================
function placeMark (cell,currentTurn){
    cell.classList.replace('free' , currentTurn)
}

function switchTurn () {
    if (currentTurn === 'x') {
        board.classList.replace ('x' , 'O')        
    }
    else {
        board.classList.replace ('O' , 'x')
    }
    currentTurn = board.classList[1]
}

function paintSubBoard (subBoard , winState) {
    const screen = subBoard.querySelector('.sub-board-state-screen');
    screen.classList.replace('free',winState)
}

//  Testing for Win and Drow  =================================================================

function checkForWin (currentTurn,ellement) {
    return WIN_COMBOS.some(combination =>{
        return combination.every(index => {
            return ellement[index].classList.contains(currentTurn)
        })
    })
}

function checkSubBoardForWin(){ 
    for (i=0 ; i<9 ; i++){
        if (subBoards[i].classList.contains('free')) {
            if (checkForWin(currentTurn,cellElementMatrix[i])) {
                subBoards[i].classList.replace('free',currentTurn);
                paintSubBoard (subBoards[i] , currentTurn)
            } else {
                if (isDraw(cellElementMatrix[i])) {
                    paintSubBoard (subBoards[i] , 'draw')
                    subBoards[i].classList.replace('free', 'draw')
                }
            }
        }
    }
}

function isDraw(ellement){
    return [...ellement].every(cell => {
        return !cell.classList.contains('free');
    })
}

