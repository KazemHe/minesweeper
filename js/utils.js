'use strict'

function renderBoard(mat) {
    var cell
    var strHTML = '<table><tbody>'

    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>\n'

        for (var j = 0; j < mat[0].length; j++) {
            cell = mat[i][j]

            const className = `cell currCell${i}-${j}`
            const elId = i+'_'+j;
            strHTML += `<td id="${elId}" onclick="onCellClicked(innerText,this,${i},${j})"  oncontextmenu="onCellMarked(event,className,${i},${j})" class="${className}">`
            // const minesAround = cell.minesAroundCount

            if (cell.isMine && cell.isShown) strHTML += MINE


            // else if (minesAround > 0) {

            //     if (cell.isShown)
            //         strHTML += `${minesAround}`

            // }

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
        const emptyPos = getRandompos(gBoard)
        if (!emptyPos) return
        gBoard[emptyPos.i][emptyPos.j].isMine = true

    }

    return renderBoard(gBoard)
}


function getRandompos(borad) {

    const emptyPos = []
    for (var i = 0; i < borad.length; i++) {
        for (var j = 0; j < borad[i].length; j++) {
            if (!borad[i][j].isShown) {
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