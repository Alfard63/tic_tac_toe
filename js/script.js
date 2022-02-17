import Board from './classes/board.js'
import Player from './classes/player.js'
import { hasClass, addClass} from './helpers.js'


//Create Modal
const modal = new bootstrap.Modal(document.getElementById('modal'), {
      keyboard: false,
      backdrop: 'static'    
  })
//Starts a new game with a certain depth and a startingPlayer of 1 if human is going to start
function newGame(depth = -1, startingPlayer = 1) {
   //Instantiating a new player, an empty board and modal title
   const player = new Player(parseInt(depth))
   const board = new Board(['', '', '', '', '', '', '', '', ''])
   
  const gameModal = document.getElementById('modalTitle')
   gameModal.innerHTML = `
      <span class="h1-red px-2 px-sm-3 px-md-3">T</span>IC
      <span class="h1-green px-2 px-sm-3 px-md-3">T</span>AC
      <span class="h1-blue px-2 px-sm-3 px-md-3">T</span>OE`

   //Clearing all #Board classes and populating cells HTML
   const boardDIV = document.getElementById("board")
   boardDIV.className = ''
   boardDIV.innerHTML =`
   <div class="row">
            <div class="col p-1 p-sm-2 m-1 m-sm-2 d-flex align-items-center justify-content-center">
               <div class="box cell-0"></div>
            </div>
            <div class="col p-1 p-sm-2 m-1 m-sm-2 d-flex align-items-center justify-content-center">
               <div class="box cell-1"></div>
            </div>
            <div class="col p-1 p-sm-2 m-1 m-sm-2 d-flex align-items-center justify-content-center">
               <div class="box cell-2"></div>
            </div>
         </div>

         <div class="row">
            <div class="col p-1 p-sm-2 m-1 m-sm-2 d-flex align-items-center justify-content-center">
               <div class="box cell-3"></div>
            </div>
            <div class="col p-1 p-sm-2 m-1 m-sm-2 d-flex align-items-center justify-content-center">
               <div class="box cell-4"></div>
            </div>
            <div class="col p-1 p-sm-2 m-1 m-sm-2 d-flex align-items-center justify-content-center">
               <div class="box cell-5"></div>
            </div>
         </div>

         <div class="row">
            <div class="col p-1 p-sm-2 m-1 m-sm-2 d-flex align-items-center justify-content-center">
               <div class="box cell-6"></div>
            </div>
            <div class="col p-1 p-sm-2 m-1 m-sm-2 d-flex align-items-center justify-content-center">
               <div class="box cell-7"></div>
            </div>
            <div class="col p-1 p-sm-2 m-1 m-sm-2 d-flex align-items-center justify-content-center">
               <div class="box cell-8"></div>
            </div>
         </div>
         `

   //Storing HTML cells in an array
   const htmlCells = boardDIV.getElementsByClassName('box')

   //Initializing some variables for internal use
   const starting = parseInt(startingPlayer),
      maximizing = starting
   let playerTurn = starting

   //If computer is going to start, choose a random cell as long as it is the center or a corner
   if (!starting) {
      const centerAndCorners = [0, 2, 4, 6, 8]
      const firstChoice = centerAndCorners[Math.floor(Math.random() * centerAndCorners.length)]
      const symbol = !maximizing ? 'cross' : 'circle'
      board.insert(symbol, firstChoice)
      addClass(htmlCells[firstChoice], symbol)
      addClass(htmlCells[firstChoice].parentNode, 'active')
      playerTurn = 1 //Switch turns
   }

   //Adding Click event listener for each cell
   board.state.forEach((cell, index) => {
      htmlCells[index].addEventListener('click', () => {
         //If cell is already occupied or the board is in a terminal state or it's not humans turn, return false
         if (hasClass(htmlCells[index], 'cross') || hasClass(htmlCells[index], 'circle') || board.isTerminal() || !playerTurn) return false
         const symbol = maximizing ? 'cross' : 'circle' //Maximizing player is always 'cross'
         //Update the Board class instance as well as the Board UI
         board.insert(symbol, index)
         addClass(htmlCells[index], symbol)
         addClass(htmlCells[index].parentNode, 'active')
         playerTurn = 0 //Switch turns
         //Get computer's best move and update the UI
         player.getBestMove(board, !maximizing, best => {
            const symbol = !maximizing ? 'cross' : 'circle'
            board.insert(symbol, parseInt(best))
            addClass(htmlCells[best], symbol)
            addClass(htmlCells[best].parentNode, 'active')
            playerTurn = 1 //Switch turns
         })

         //show the modal for victory, loose or draw
         if((board.isTerminal().winner === 'cross' && symbol === 'cross') || (board.isTerminal().winner === 'circle' && symbol === 'circle')) {
            gameModal.innerHTML = '<span class="clay h1-green px-2 px-sm-3 px-md-3">W</span>IN'
            console.log (gameModal)
            modal.show()
         }
         else if ((board.isTerminal().winner === 'cross' && symbol === 'circle') || (board.isTerminal().winner === 'circle' && symbol === 'cross')) {
            gameModal.innerHTML = '<span class="clay h1-red px-2 px-sm-3 px-md-3">L</span>OOSE'
            console.log (gameModal)
            modal.show()
         }
         else if (board.isTerminal().winner === 'draw') {
            gameModal.innerHTML = '<span class="clay h1-blue px-2 px-sm-3 px-md-3">D</span>ROW'
            console.log (gameModal)
            modal.show()
         }
      }, false)
      if (cell) {
         addClass(htmlCells[index], cell)
         addClass(htmlCells[index].parentNode, 'active')
      } 
   })
}

   //show the menu modal
   modal.show()
   
document.addEventListener("DOMContentLoaded", () => {
   //Start a new game when page loads with default values
   const depth = -1
   const startingPlayer = 1
   newGame(depth, startingPlayer)
   //Start a new game with chosen options when new game button is clicked
   document.getElementById("newGame").addEventListener('click', () => {
      const startingDIV = document.getElementById("starting")
      const starting = startingDIV.options[startingDIV.selectedIndex].value
      const depthDIV = document.getElementById("depth")
      const depth = depthDIV.options[depthDIV.selectedIndex].value
      newGame(depth, starting)
   })
})