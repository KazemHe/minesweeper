'usw strict'

const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ' '

var gInterval


var score
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
    hideModal()
    clearInterval(gInterval)
    gInterval = 0
    gGame.shownCount = 0
    gGame.isOn = true
    gBoard = buildBoard()
    addMine()
    setMinesNegsCountAll(gBoard)
    renderBoard(gBoard)

}



function levels(size) {


    if (+size === 4) {
        gLevel.size = size
        gLevel.mines = 2
        inInit()
    }
    if (+size === 8) {
        gLevel.size = size
        gLevel.mines = 14
        inInit()
    }
    if (+size === 12) {
        gLevel.size = size
        gLevel.mines = 32
        inInit()
    }


}


function buildBoard() {
    const board = []

    for (var i = 0; i < gLevel.size; i++) {
        board.push([])

        for (var j = 0; j < gLevel.size; j++) {

            board[i][j] = { isShown: false, isMine: false, isMarked: true, }

            //put mines on the board in the model (thange the element isMine to ture in)
            // if ((i === 0 && j === 0) || (i === 0 && j === 1)) board[i][j].isMine = true
        }
    }
    // console.log(board)

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
    // console.log(minesAroundCount)
    return minesAroundCount

}



function onCellClicked(text, currCell, i, j) {

    if (gInterval === 0) {
        gInterval = setInterval(timer, 10)
    }


    if (!gGame.isOn) return

    if (gBoard[i][j].isMine) gameOver(gBoard, currCell)
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



function gameOver(board, elCell) {
    clearInterval(gInterval)
    gInterval = 0
    console.log('game over')
    gGame.isOn = false

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {

            if (board[i][j].isMine) {
                board[i][j].isShown = true

            }

        }
    }

    showModal('game over')
    renderBoard(gBoard)
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



        // // To do : count all cells open/shown
        // gGame.shownCount++

    }
    var shown = document.querySelector('.shown')

    // shown.innerText = gGame.shownCount

}

//To do : add falg
function onCellMarked(ev, elCell, i, j) {
    ev.preventDefault();

}



function setNegCells(rowIdx, colIdx, board) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            // if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[i].length) continue

            if ((board[i][j].isShown === true) && !(i === rowIdx && j === colIdx)) continue
            board[i][j].isShown = true

            var elCell = getCellElment(i, j)
            elCell.classList.replace('cell', 'cellOnClick')
            if (board[i][j].minesAroundCount > 0)
                elCell.innerText = board[i][j].minesAroundCount
        }
    }

}


function isWin(board) {

    var winCount = 0

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {

            if ((board[i][j].isShown) && !(board[i][j].isMine)) winCount++
        }
    }
    if (winCount === gLevel.size ** 2 - gLevel.mines) {
        showModal('you are the best')
        // clearInterval(gInterval)
        // gInterval = 0
        return true
    }
    else return false
}



var gSecond = 0
var gMilliseconds = 0
var gMinutes = 0
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
    const elModal = document.querySelector('.modal ')
    elModal.classList.remove('hidden')

}

function hideModal() {
    var elModal = document.querySelector('.modal ')
    elModal.classList.remove('hidden')
}

