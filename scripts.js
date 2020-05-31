const gameBoard = (function () {
  //stores x/o values of spaces on board
  let board = ['', '', '', '', '', '', '', '', ''];

  //renders display - creates div  with id tile[0-8] for each 
    //item in board
  const display = () => {
    const container = document.querySelector('#main');
    for (i = 0; i < 9; i++) {
        let tile = document.createElement('div');
        tile.id = `tile${i}`;
        tile.className = 'tile';
        tile.textContent = board[i];
        tile.addEventListener('click', game.takeTurn);
        container.appendChild(tile);
        game.displayCurrentPlayer();
    }
  }

  //places symbol of current player if selected tile is empty
  const place = e => {
    if (e.target.textContent === '') {
      e.target.textContent = game.getCurrentPlayer();
      board[e.target.id.slice(4, 5)] = game.getCurrentPlayer();
    } else {
        return false;
    }
  }

  //creates sets with the board index values of each possible 
    //win and checks each to see if size<1 and is X or O to check
    //for win 
  const checkWin = () => {
    let wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
      [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
    for (i = 0; i < wins.length; i++) {
      set = new Set();
      for (j = 0; j < 3; j++) {
        if (board[wins[i][j]]) {
          set.add(board[wins[i][j]]);
        } else {
            set.add('-');
        }
      }
      if (set.size === 1 && !set.has('-')) {
        game.over(0);
      }
    }
  };

  const checkTie = () => {
    let count = 0;
    for (i = 0;i < 9; i++) {
      if (board[i] === 'X' || board[i] === 'O') {
          count += 1;
      }
    }
    if (count == 9) {
        game.over(1);
    }
  }

  const reset = () => {
      board = ['', '', '', '', '', '', '', '', ''];
      refresh();
      document.querySelector('#display').textContent = `${game.getCurrentPlayerName()}! It\'s your turn!`;
  }

  //updates every tile with its value in gameBoard.board array
  const refresh = () => {
      for (i = 0; i < 9; i++) {
        document.querySelector(`#tile${i}`).textContent = board[i];
      }
  }

  return { display, place, checkWin, checkTie, reset };
})();

//player factory
const Player = (name, symbol) => {
    //this value is set to true when game.getWinner() function is called
    const winner = false;
  
    //return name, isCurrentPlayer, isWinner
    return { name, symbol, winner };
};

const game = (function () {
  const players = [Player('Player 1', 'X'), Player('Player 2', 'O')];

  //getCurrentPlayer returns the Player.symbol value for 
    //the current player as a string
  let currentPlayer = 'O';
  const getCurrentPlayer = () => {
    return currentPlayer;
  };

  const getCurrentPlayerName = () => {
    if (players[0].symbol === currentPlayer) {
        return players[0].name;
      } else {
          return players[1].name;
      }
  }

  //Toggles currentPlayer between ['X', 'O'] and returns new value
  const swapCurrentPlayer = () => {
    if (currentPlayer === players[0].symbol) {
        currentPlayer = players[1].symbol;
        return currentPlayer;
    } else {
        currentPlayer = players[0].symbol;
        return currentPlayer;
    }
  };

  //executed when a tile is clicked
  const takeTurn = e => {
    //if the tile is empty
    if (e.target.textContent === '') {
      gameBoard.place(e);
      gameBoard.checkWin();
      if (!(players[0].winner || players[1].winner)) {
        gameBoard.checkTie();
      }
        swapCurrentPlayer();
        displayCurrentPlayer();
    } else {
        return;
    }
  }
   
  const displayCurrentPlayer = () => {
    const display = document.querySelector('#display');
    if (!(players[0].winner || players[1].winner)) {
      display.textContent = `${getCurrentPlayerName()}! It\'s your turn!`; 
    }
  }

  //displays game over message(win or tie), lock the game
  const over = (tie) => {
    let h1 = document.querySelector('#display');
    if (tie == 1) {
      players[0].winner = true;
      players[1].winner = true;
      message = 'It\'s a tie!'
      console.log(message);
    } else {
        winner = getWinner();
        message = `${winner} wins!`
        console.log(message);
      }
    h1.textContent = message;
    lockGame();
  }
  
  //returns name of winning player
  const getWinner = () => {
    if (players[0].symbol === currentPlayer) {
      players[0].winner = true;
      return players[0].name;
    } else {
        players[1].winner = true;
        return players[1].name;
    }
  }

  //removes event listeners from tiles
  const lockGame = () => {
    for (i = 0; i < 9; i++) {
      document.querySelector(`#tile${i}`).removeEventListener('click',game.takeTurn);
    }
  }
  //adds event listeners to tiles
  const unlockGame = () => {
    for (i = 0; i < 9; i++) {
      document.querySelector(`#tile${i}`).addEventListener('click',game.takeTurn);
    }
  }
  //resets game
  const reset = () => {
    swapCurrentPlayer();
    changePlayers();
    gameBoard.reset();
    unlockGame();
  }

  const changePlayers = () => {
      players[0].name = p1.value;
      players[1].name = p2.value;
      displayCurrentPlayer();
  }

  const p1 = document.querySelector('#p1');
  const p2 = document.querySelector('#p2');
  p1.addEventListener('input', changePlayers);
  p2.addEventListener('input', changePlayers);


  const resetBtn = document.querySelector('#reset');
  resetBtn.addEventListener('click', reset); 

  return { displayCurrentPlayer, takeTurn, getCurrentPlayer, getCurrentPlayerName, over }
})();

gameBoard.display();
//place symbol
    //when clicked, check if placement is valid(empty)
    //place symbol of current player
  //check for winner
    //slice rows
    //slice columns
    //diagonals index: [0, 4, 8] [2, 4, 6]
    //put each array into a set, check if ((set.length === 1) && set)
      //if true, the value of the set is the symbol of winning player
      //set players[?].winner = true
//display new lines (winner/next player's turn)