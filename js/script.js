import Board from './classes/board.js'
import Player from './classes/player.js'
import { hasClass, addClass, removeClass } from './helpers.js'

//Create Modal
const modal = new bootstrap.Modal(document.getElementById('modal'), {
   keyboard: false,
   backdrop: 'static'
})
const modalTitle = document.getElementById('modalTitle') 

//Initializing sound effects
const looseSong = new Audio('../songs/loose.mp3')
const winSong = new Audio('../songs/win.wav')
const clickSong = new Audio('../songs/click.ogg')

//Initializing some variables
let numberOfPlayers = 1
let waitingTime = Math.floor((Math.random() * 300) + 1000)


//Starts a new game with a certain depth and a startingPlayer of 1 if human is going to start
function newGame(depth = -1, startingPlayer = 1) {
   //Instantiating a new player, an empty board and modal title
   const player = new Player(parseInt(depth))
   const board = new Board(['', '', '', '', '', '', '', '', ''])

   //Clearing all #Board classes and populating cells HTML
   const boardDIV = document.getElementById("board")
   boardDIV.className = ''
   boardDIV.innerHTML = `
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
   let symbol = 'cross'
   let playerTurn = starting
   console.log('create variable: ' + symbol)
   if (numberOfPlayers === 2) { playerTurn = 1 }
   

   if (numberOfPlayers === 1) {
      //If computer is going to start, choose a random cell as long as it is the center or a corner
      if (!starting) {
         const centerAndCorners = [0, 2, 4, 6, 8]
         const firstChoice = centerAndCorners[Math.floor(Math.random() * centerAndCorners.length)]
         symbol = !maximizing ? 'cross' : 'circle'
         console.log('AI play: ' + symbol)
         board.insert(symbol, firstChoice)
         clickSong.play()
         addClass(htmlCells[firstChoice], symbol)
         addClass(htmlCells[firstChoice].parentNode, 'active')
         playerTurn = 1 //Switch turns
      }
   }

   //Adding Click, Mouseenter and mouseout events listener for each cell
   board.state.forEach((cell, index) => {
      htmlCells[index].parentNode.addEventListener('mouseover', () => {
         if (hasClass(htmlCells[index].parentNode, 'active') || board.isTerminal() || (!playerTurn && numberOfPlayers === 1)) return false
         if (numberOfPlayers === 1) {
            symbol = maximizing ? 'cross' : 'circle'
         }
         else {
            symbol = playerTurn ? 'cross' : 'circle'
         }
         addClass(htmlCells[index], symbol)
      }, false)

      htmlCells[index].parentNode.addEventListener('mouseout', () => {
         if (hasClass(htmlCells[index].parentNode, 'active') || board.isTerminal() || (!playerTurn && numberOfPlayers === 1)) return false
         if (numberOfPlayers === 1) {
            symbol = maximizing ? 'cross' : 'circle'
         }
         else {
            symbol = playerTurn ? 'cross' : 'circle'
         }
         removeClass(htmlCells[index], symbol)
      }, false)

      htmlCells[index].parentNode.addEventListener('click', () => {
         clickSong.play()
         //If cell is already occupied or the board is in a terminal state or it's not humans turn, return false
         if (hasClass(htmlCells[index].parentNode, 'active') || board.isTerminal() || (!playerTurn && numberOfPlayers === 1)) return false
         if (numberOfPlayers === 1) {
            symbol = maximizing ? 'cross' : 'circle'
            console.log(symbol)
          }
         else {
            symbol = playerTurn ? 'cross' : 'circle'
            console.log(symbol)
         } 


         //Update the Board class instance as well as the Board UI
         board.insert(symbol, index)
         addClass(htmlCells[index], symbol)
         addClass(htmlCells[index].parentNode, 'active')

         //Switch turns
         if (numberOfPlayers === 1) {
            playerTurn = 0
         }
         else {
            playerTurn = playerTurn ? 0 : 1
         }
         //start waiting time 
         setTimeout(() => {
            console.log(waitingTime)
            if (numberOfPlayers === 1) {
               waitingTime = Math.floor((Math.random() * 300) + 1000)
               //Get computer's best move and update the UI
               player.getBestMove(board, !maximizing, best => {
                  const symbol = !maximizing ? 'cross' : 'circle'
                  board.insert(symbol, parseInt(best))
                  clickSong.play()
                  addClass(htmlCells[best], symbol)
                  addClass(htmlCells[best].parentNode, 'active')
                  playerTurn = 1 //Switch turns


               })
            }

            //show the modal for victory, loose or draw

            if ((board.isTerminal().winner === 'cross' && symbol === 'cross') || (board.isTerminal().winner === 'circle' && symbol === 'circle')) {
               modalTitle.classList.add('d-flex', 'flex-column', 'justify-content-center', 'align-items-center')
               modalTitle.innerHTML = `<div><span class="clay h1-green px-2 px-sm-3 px-md-3">W</span>IN</div>
               <span class="py-2 ${board.isTerminal().winner}"></span>
            `
            winSong.play()
               modal.show()
            }
            else if (numberOfPlayers === 1 && ((board.isTerminal().winner === 'cross' && symbol === 'circle') || (board.isTerminal().winner === 'circle' && symbol === 'cross'))) {
               modalTitle.innerHTML = '<div><span class="clay h1-red px-2 px-sm-3 px-md-3">L</span>OOSE</div>'
               looseSong.play()
               modal.show()
            }
            else if (board.isTerminal().winner === 'draw') {
               modalTitle.innerHTML = '<div><span class="clay h1-blue px-2 px-sm-3 px-md-3">D</span>RAW</div>'
               looseSong.play()
               modal.show()
            }
         }, waitingTime) 
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
      waitingTime = 0
   })

   //Start a new game with chosen options when new game button is clicked
   document.getElementById("newGame").addEventListener('click', () => {
      clickSong.play()
      const startingDIV = document.getElementById("starting")
      const starting = startingDIV.options[startingDIV.selectedIndex].value
      const depthDIV = document.getElementById("depth")
      const depth = depthDIV.options[depthDIV.selectedIndex].value
      newGame(depth, starting)
   })
})