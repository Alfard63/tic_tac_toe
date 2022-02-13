// init variables
const box1 = document.getElementById('box1-child')
const box2 = document.getElementById('box2-child')
const box3 = document.getElementById('box3-child')
const box4 = document.getElementById('box4-child')
const box5 = document.getElementById('box5-child')
const box6 = document.getElementById('box6-child')
const box7 = document.getElementById('box7-child')
const box8 = document.getElementById('box8-child')
const box9 = document.getElementById('box9-child')

var isCrossTurn = true

var crossScore = 0
var circleScore = 0

var emptyBox = [
    'box1', 'box2', 'box3',
    'box4', 'box5', 'box6',
    'box7', 'box8', 'box9',
]

var menuModal = new bootstrap.Modal(document.getElementById('menuModal'), {
    keyboard: false,
    backdrop: 'static'
})

var winModal = new bootstrap.Modal(document.getElementById('winModal'), {
    keyboard: false
  })

  var looseModal = new bootstrap.Modal(document.getElementById('looseModal'), {
    keyboard: false
  })

menuModal.show()
/***********************************************************************************************/
/************************************* GAME FOR TWO PLAYER *************************************/
/***********************************************************************************************/


// this function determine wich symbol is used to play
function chooseSymbol() {
    return isCrossTurn ? 'cross' : 'circle'
}


// this function get the id of the box who was clicked
// if the box doesn't have the class 'active' so we add 'active' class
// and add the symbol to his child.
// we delete the clicked box to the 'emptyBox' array
// and then we execute the function 'stateOfPlay'

function mClick(id) {

    if (!document.getElementById(id).classList.contains('active')) {
            document.getElementById(id).classList.add('active')
            document.getElementById(id + '-child').classList.add(chooseSymbol())

            let boxIndex = emptyBox.indexOf(id)

            emptyBox.splice(boxIndex, 1)

            stateOfPlay(chooseSymbol())
    }

}

// this function verify if the current symbol win
// else it verify le loosing condition (all boxes are used)
// else it change the symbol turn

function stateOfPlay(symbol) {

    if (
        box1.classList.contains(symbol) && box2.classList.contains(symbol) && box3.classList.contains(symbol) ||
        box4.classList.contains(symbol) && box5.classList.contains(symbol) && box6.classList.contains(symbol) ||
        box7.classList.contains(symbol) && box8.classList.contains(symbol) && box9.classList.contains(symbol) ||
        box1.classList.contains(symbol) && box4.classList.contains(symbol) && box7.classList.contains(symbol) ||
        box2.classList.contains(symbol) && box5.classList.contains(symbol) && box8.classList.contains(symbol) ||
        box3.classList.contains(symbol) && box6.classList.contains(symbol) && box9.classList.contains(symbol) ||
        box1.classList.contains(symbol) && box5.classList.contains(symbol) && box9.classList.contains(symbol) ||
        box3.classList.contains(symbol) && box5.classList.contains(symbol) && box7.classList.contains(symbol)
    ) {
        winModal.show()
        symbol === 'cross' ? crossScore++ : circleScore++
        resetBlock()
    }
    else if (emptyBox.length === 0) {
        looseModal.show()
        resetBlock()
    }
    else {
        isCrossTurn ? isCrossTurn = false : isCrossTurn = true
        document.getElementById('symbolTurn').classList.remove('cross', 'circle')
        document.getElementById('symbolTurn').classList.add(chooseSymbol())
    }
}

function mOver(id) {
    if (!document.getElementById(id).classList.contains('active')) {
        document.getElementById(id + '-child').classList.add(chooseSymbol())
    }
}

function mOut(id) {
    if (!document.getElementById(id).classList.contains('active')) {
        document.getElementById(id + '-child').classList.remove(chooseSymbol())
    }
}

function resetBlock() {
    for (let i = 1; i < 10; i++) {
        document.getElementById('box' + i).classList.remove('active')
        document.getElementById('box' + i + '-child').classList.remove('cross', 'circle')
    }
    isCrossTurn = true
    emptyBox = [
        'box1', 'box2', 'box3',
        'box4', 'box5', 'box6',
        'box7', 'box8', 'box9',
    ]
    document.getElementById('symbolTurn').classList.remove('cross', 'circle')
    document.getElementById('symbolTurn').classList.add(chooseSymbol())

    document.getElementById('crossScore').innerHTML = crossScore
    document.getElementById('circleScore').innerHTML = circleScore
}