let isCrossTurn = true

function addSymbol (clickedId) {
    /*     console.log(clickedId) */
    const div = document.createElement('div')    
    isCrossTurn ? (div.className = 'cross', isCrossTurn = false ) : (div.className = 'circle', isCrossTurn = true )
        /* console.log(div) */
        div.classList.add('active')
    document.getElementById(clickedId).appendChild(div)
    
}
