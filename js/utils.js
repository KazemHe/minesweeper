'use strict'

function renderBoard(mat) {
    var cell
    var strHTML = '<table><tbody>'

    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>\n'

        for (var j = 0; j < mat[0].length; j++) {
            cell = mat[i][j]

            const className = `cell `
            const elId = i + '_' + j;
            strHTML += `<td id="${elId}" onclick="onCellClicked(this,${i},${j})"  oncontextmenu="onCellMarked(event,${i},${j})" class="${className}">`


            strHTML += `</td>\n`
        }
        strHTML += '</tr>'
    }

    strHTML += '</tbody></table>'


    var elContainer = document.querySelector('div')
    // console.log(elContainer)
    elContainer.innerHTML = strHTML

}



function addMine() {

    for (var i = 0; i < gLevel.mines; i++) {
        const emptyPos = getRandomPos(gBoard)
        if (!emptyPos) return
        gBoard[emptyPos.i][emptyPos.j].isMine = true

    }

    return renderBoard(gBoard)
}


function getRandomPos(board) {

    const emptyPos = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (!board[i][j].isShown) {
                emptyPos.push({ i, j })
            }
        }
    }
    var randIdx = getRandomInt(0, emptyPos.length)

    return emptyPos[randIdx]
}



function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}