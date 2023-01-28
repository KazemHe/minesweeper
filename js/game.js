'usw strict'

const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ' '
const LIVE = '❤️'
const WIN = '😎'
const LOSE = '😡'
const RESTART = '😄'

var gSecond = 0
var gMilliseconds = 0
var gMinutes = 0
var gInterval = 0

var gLives = 3
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secspassed: 0
}
var gBoard

var gLevel = {
    size: 4,
    mines: 2,
}

function inInit() {
    resetData()
    hideModal()
    gGame.isOn = true
    gBoard = buildBoard()
    addMine()
    setMinesNegsCountAll(gBoard)
    renderBoard(gBoard)
}

function resetData() {
    var live = document.querySelector('.live')
    live.innerText = LIVE + LIVE + LIVE
    var restart = document.querySelector('.restart')
    restart.innerText = RESTART
    gGame.markedCount = 0
    gGame.shownCount = 0
    clearInterval(gInterval)
    gInterval = 0
    gSecond = 0
    gMilliseconds = 0
    gMinutes = 0
    gLives = 3
    var time = document.querySelector('.timer')
    time.innerText = '0:00'
    marked = document.querySelector('.mark')
    marked.innerText = gGame.markedCount
    var minesInGame = document.querySelector('.mine')
    minesInGame.innerText = gLevel.mines

}




function levels(size) {


    var minesInGame = document.querySelector('.mine')

    if (+size === 4) {
        gLevel.size = size
        gLevel.mines = 2
        inInit()
        minesInGame.innerText = gLevel.mines
    }
    if (+size === 8) {
        gLevel.size = size
        gLevel.mines = 14
        inInit()
        minesInGame.innerText = gLevel.mines
    }
    if (+size === 12) {
        gLevel.size = size
        gLevel.mines = 32
        inInit()
        minesInGame.innerText = gLevel.mines
    }
}

function buildBoard() {
    const board = []

    for (var i = 0; i < gLevel.size; i++) {
        board.push([])

        for (var j = 0; j < gLevel.size; j++) {

            board[i][j] = { isShown: false, isMine: false, isMarked: false, }
            //put mines on the board in the model (thange the element isMine to ture in)
            // if ((i === 0 && j === 0) || (i === 0 && j === 1)) board[i][j].isMine = true
        }
    }
    return board
}

// count the mines around for all cells

function setMinesNegsCountAll(board) {

    var minesAround = 0

    for (var i = 0; i < board.length; i++) {

        for (var j = 0; j < board[0].length; j++) {

            if (board[i][j].isMine) continue
            board[i][j].minesAroundCount = setMinesNegsCount(i, j, board)

            // console.log(board[i][j].minesAroundCount)
        }
    }
    return minesAround
}

// count the mines around the cell

function setMinesNegsCount(rowIdx, colIdx, board) {

    var minesAroundCount = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].isMine === true) minesAroundCount++
        }
    }
    return minesAroundCount
}

function onCellClicked(currCell, i, j) {

    gGame.shownCount++

    if (gBoard[i][j].isMarked) return
    if (gInterval === 0) gInterval = setInterval(timer, 10)
    if (!gGame.isOn) return

    if (gBoard[i][j].isMine) {
        gLives--
        var live = document.querySelector('.live')
        if (gLives !== -1) {

            if (gLives === 2) live.innerText = LIVE + LIVE
            else if (gLives === 1) live.innerText = LIVE
            else if (gLives === 0) live.innerText = ' '
        }

        else if (gLives === -1) gameOver(gBoard, currCell)
    }
    else {
        gBoard[i][j].isShown = true
        expandShown(gBoard, currCell, i, j)
        var win = isWin(gBoard)
        if (win) gGame.isOn = false
    }


}

function getCellElment(i, j) {
    const elId = i + '_' + j;
    return document.getElementById(elId)
}


function gameOver(board, i, j) {
    var lose = ''
    clearInterval(gInterval)

    gGame.isOn = false

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {

            if (board[i][j].isMine) {
                board[i][j].isShown = true
                var elCell = getCellElment(i, j)
                elCell.classList.replace('cell', 'cellOnClick')
                elCell.innerText = MINE

            }
        }
    }
    lose = document.querySelector('.restart')
    lose.innerText = LOSE
    showModal('game over')
}


//  When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors
function expandShown(board, elCell, i, j) {

    var elcurr = board[i][j]

    if (elcurr.minesAroundCount > 0) {

        elCell.innerText = elcurr.minesAroundCount

        elCell.classList.replace('cell', 'cellOnClick')
        gGame.shownCount++

    }
    else if (elcurr.minesAroundCount === 0) {
        setNegCells(i, j, board)



    }
}

//To do : add falg
function onCellMarked(ev, i, j) {
    ev.preventDefault();
    var marked
    var elCell = getCellElment(i, j)
    if (!gGame.isOn) return

    if (gBoard[i][j].isShown) return

    else if (gBoard[i][j].isMarked) {

        gBoard[i][j].isMarked = false
        gGame.markedCount--
        elCell.innerText = EMPTY
    }
    else {
        gGame.markedCount++    // model
        gBoard[i][j].isMarked = true   // model
        elCell.innerText = FLAG   // dom
    }

    marked = document.querySelector('.mark')
    marked.innerText = gGame.markedCount

}

function setNegCells(rowIdx, colIdx, board) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            // if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[i].length) continue

            if ((board[i][j].isShown) && !(i === rowIdx && j === colIdx) || (board[i][j].isMarked)) continue
            board[i][j].isShown = true

            var elCell = getCellElment(i, j)
            elCell.classList.replace('cell', 'cellOnClick')
            if (board[i][j].minesAroundCount > 0)
                elCell.innerText = board[i][j].minesAroundCount
        }
    }

}

function isWin(board) {
    var winEmoji = ''
    var winCount = 0

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {

            if ((board[i][j].isShown) && !(board[i][j].isMine)) winCount++
        }
    }
    if (winCount === gLevel.size ** 2 - gLevel.mines) {
        showModal('you are the best')
        clearInterval(gInterval)

        winEmoji = document.querySelector('.restart')
        winEmoji.innerHTML = WIN
        return true
    }
    else return false
}


function timer() {
    gMilliseconds += 10;

    gSecond = Math.floor(gMilliseconds / 1000);

    var millSec = gMilliseconds - gSecond * 1000;

    gMinutes = Math.floor(gSecond / 60);
    var displaySecond = gSecond - gMinutes * 60;
    var strHTML = `${gMinutes}:${displaySecond}:${millSec}`;
    var elTimer = document.querySelector('.timer');
    elTimer.innerHTML = strHTML;
}

function showModal(txt) {

    const elH2 = document.querySelector('.modal ')
    elH2.innerText = txt
    var elModal = document.querySelector('.modal ')
    elModal.classList.remove('hidden')
}

function hideModal() {
    var elModal = document.querySelector('.modal ')
    elModal.classList.add('hidden')
}



function timeOver() {

    gameOver(gBoard)
} 
