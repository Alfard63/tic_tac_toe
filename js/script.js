import Board from './classes/board.js'
import Player from './classes/player.js'
import { hasClass, addClass} from './helpers.js'

//Create Modal
const modal = new bootstrap.Modal(document.getElementById('modal'), {
      keyboard: false,
      backdrop: 'static'    
  })
const modalTitle = document.getElementById('modalTitle')

let numberOfPlayers = 1 

//Starts a new game with a certain depth and a startingPlayer of 1 if human is going to start
function newGame(depth = -1, startingPlayer = 1) {
   //Instantiating a new player, an empty board and modal title
   const player = new Player(parseInt(depth))
   const board = new Board(['', '', '', '', '', '', '', '', ''])

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
   
   if (numberOfPlayers === 1) {
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
   }
   
   //Adding Click event listener for each cell
   board.state.forEach((cell, index) => {
      htmlCells[index].addEventListener('click', () => {
         //If cell is already occupied or the board is in a terminal state or it's not humans turn, return false
         if (hasClass(htmlCells[index], 'cross') || hasClass(htmlCells[index], 'circle') || board.isTerminal() ||(!playerTurn && numberOfPlayers === 1) ) return false
         const symbol = playerTurn ? 'cross' : 'circle'

         //Update the Board class instance as well as the Board UI
         board.insert(symbol, index)
         addClass(htmlCells[index], symbol)
         addClass(htmlCells[index].parentNode, 'active')

         playerTurn = !playerTurn //Switch turns
         
         if (numberOfPlayers === 1) {
            //Get computer's best move and update the UI
            player.getBestMove(board, !maximizing, best => {
            const symbol = !maximizing ? 'cross' : 'circle'
            board.insert(symbol, parseInt(best))
            addClass(htmlCells[best], symbol)
            addClass(htmlCells[best].parentNode, 'active')
            playerTurn = 1 //Switch turns
         })
         } 
         
         //show the modal for victory, loose or draw
         
         if(numberOfPlayers === 1 && ((board.isTerminal().winner === 'cross' && symbol === 'cross') || (board.isTerminal().winner === 'circle' && symbol === 'circle'))) {
            modalTitle.innerHTML = `<span class="clay h1-green px-2 px-sm-3 px-md-3">W</span>IN`
            modal.show()
         }
         else if (numberOfPlayers === 2 && ((board.isTerminal().winner === 'cross' && symbol === 'cross') || (board.isTerminal().winner === 'circle' && symbol === 'circle'))) {
            modalTitle.classList.add('d-flex','flex-column', 'justify-content-center', 'align-items-center')
            modalTitle.innerHTML = `<div><span class="clay h1-green px-2 px-sm-3 px-md-3">W</span>IN</div>
               <span class=" py-2 ${board.isTerminal().winner}"></span>
            `
            modal.show()
         }
         else if (numberOfPlayers === 1 && ((board.isTerminal().winner === 'cross' && symbol === 'circle') || (board.isTerminal().winner === 'circle' && symbol === 'cross'))) {
            modalTitle.innerHTML = '<span class="clay h1-red px-2 px-sm-3 px-md-3">L</span>OOSE'
            modal.show()
         }
         else if (board.isTerminal().winner === 'draw') {
            modalTitle.innerHTML = '<span class="clay h1-blue px-2 px-sm-3 px-md-3">D</span>ROW'
            modal.show()
         }
      }, false)
      if (cell) {
         addClass(htmlCells[index], cell)
         addClass(htmlCells[index].parentNode, 'active')
      } 
   })
}

   
document.addEventListener("DOMContentLoaded", () => {
   
 
   modalTitle.innerHTML = `
      <span class="h1-red px-2 px-sm-3 px-md-3">T</span>IC
      <span class="h1-green px-2 px-sm-3 px-md-3">T</span>AC
      <span class="h1-blue px-2 px-sm-3 px-md-3">T</span>OE`


   //show the menu modal
   modal.show()

   //Define the number of player
   document.getElementById("1Player").addEventListener('click', () => {
      numberOfPlayers = 1
   })
   document.getElementById("2Players").addEventListener('click', () => {
      numberOfPlayers = 2
   })

   //Start a new game with chosen options when new game button is clicked
   document.getElementById("newGame").addEventListener('click', () => {
         const startingDIV = document.getElementById("starting")
         const starting = startingDIV.options[startingDIV.selectedIndex].value
         const depthDIV = document.getElementById("depth")
         const depth = depthDIV.options[depthDIV.selectedIndex].value
         newGame(depth, starting)
   })
})