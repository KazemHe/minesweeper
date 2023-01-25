'usw strict'

const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ' '



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
    gBoard = buildBoard()
    // addMine()
    renderBoard(gBoard)
    setMinesNegsCountAll(gBoard)
    // console.log(gBoard)
    // setMinesNegsCount(1, 2, gBoard)
}

// Create a 4x4 gBoard Matrix containing Objects 
// To do : Set 2 of them to be mines 

function buildBoard() {
    const board = []

    for (var i = 0; i < gLevel.size; i++) {
        board.push([])

        for (var j = 0; j < gLevel.size; j++) {

            board[i][j] = { isShown: false, isMine: false, isMarked: true, }

            //put mines on the board in the model (thange the element isMine to ture in)
            if ((i === 0 && j === 3) || (i === 2 && j === 3) || (i === 2 && j === 2)) board[i][j].isMine = true
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

function setMinesNegsCount(rowIdx, colIdx, borad) {


    var minesAroundCount = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= borad.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= borad[i].length) continue
            if (borad[i][j].isMine === true) minesAroundCount++
        }
    }
    // console.log(minesAroundCount)
    return minesAroundCount

}



function onCellClicked(cell, button, i, j) {


    // addMine()
    // var currCell = cell
    // if(currCell === MINE ){
    //     gameOver ()
    // }
    // var currCell = cell[i][j]
    // console.log(currCell)
    if (gBoard[i][j].isMine) {
        renderBoard(gBoard)
        gameOver()

    }

    else {
        gBoard[i][j].isShown = true
        renderBoard(gBoard)
    }

    // else if (gBoard[i][j].minesAroundCount > 0){
    //    var nums = setMinesNegsCount(i, j,gborad)
    //    console.log(nums)
    // }




}

function show(i, j, board) {

    board[i][j].isShown = true

}


// open all cells
// stop timer 

function gameOver() {
    console.log('game over')

}

//  When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors


// function expandShown(board, elCell, i, j) {


// }


// function renderCell(board, i, j) {
//     var strHTML

//     board[i][i]
//     var currcell = document.querySelector(cell)
//     currcell.style.color

// }


