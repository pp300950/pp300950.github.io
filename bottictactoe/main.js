let botScore = 0; 
    let playerScore = 0; 
    let drawScore = 0;
    const botPlayer = 'O';
    const humanPlayer = 'X';
    const boardSize = 3;
    let board = [];

    function startGame() {
      board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
      renderBoard();
    }

    function makeBotMove() {
      let bestScore = -Infinity;
      let move;
      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          if (board[i][j] === null) {
            board[i][j] = botPlayer;
            let score = minimax(board, 0, false);
            board[i][j] = null;

            if (score > bestScore) {
              bestScore = score;
              move = { i, j };
            }
          }
        }
      }

      board[move.i][move.j] = botPlayer;
      renderBoard();
      if (checkWin(botPlayer)) {
        botScore++;
        document.getElementById('bot-score').innerText = botScore;
        setTimeout(() => {
          alert('บอทชนะ  ขอตึงๆ ได้ไหมเอ่ย คะเเนนบอท: ' + botScore + ', คะเเนนผู้เล่น: ' + playerScore + ', เสมอ: ' + drawScore);
          startGame();
        }, 100);
      } else if (checkDraw()) {
        drawScore++;
        document.getElementById('draw-score').innerText = drawScore;
        setTimeout(() => {
          alert('เสมอจร้า  คะเเนนบอท: ' + botScore + ', คะเเนนผู้เล่น: ' + playerScore + ', เสมอ: ' + drawScore);
          startGame();
        }, 100);
      }
    }
    function checkWin(player) {
      for (let i = 0; i < boardSize; i++) {
        let rowWin = true;
        let colWin = true;

        for (let j = 0; j < boardSize; j++) {
          if (board[i][j] !== player) {
            rowWin = false;
          }

          if (board[j][i] !== player) {
            colWin = false;
          }
        }

        if (rowWin || colWin) {
          return true;
        }
      }
      let diagonalWin = true;
      let antiDiagonalWin = true;
      for (let i = 0; i < boardSize; i++) {
        if (board[i][i] !== player) {
          diagonalWin = false;
        }
        if (board[i][boardSize - 1 - i] !== player) {
          antiDiagonalWin = false;
        }
      }
      if (diagonalWin || antiDiagonalWin) {
        return true;
      }

      return false;
    }
    function checkDraw() {
      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          if (board[i][j] === null) {
            return false;
          }
        }
      }
      return true;
    }
    function renderBoard() {
      const boardContainer = document.querySelector('.board');
      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          const cell = boardContainer.children[i * boardSize + j];
          cell.innerText = board[i][j] || '';
        }
      }
    }
    function makeMove(row, col) {
      if (board[row][col] === null && !checkWin(humanPlayer) && !checkDraw()) {
        board[row][col] = humanPlayer;
        renderBoard();

        if (checkWin(humanPlayer)) {
          playerScore++;
          document.getElementById('player-score').innerText = playerScore;
          setTimeout(() => {
            alert('คุณชนะ โกงป่ะเนี่ย คะเเนนบอท: ' + botScore + ', คะเเนนผู้เล่น: ' + playerScore + ', เสมอ: ' + drawScore);
            startGame();
          }, 100);
        } else if (checkDraw()) {
          drawScore++;
          document.getElementById('draw-score').innerText = drawScore;
          setTimeout(() => {
            alert('เสมอจร้า คะเเนนบอท: ' + botScore + ', คะเเนนผู้เล่น: ' + playerScore + ', เสมอ: ' + drawScore);
            startGame();
          }, 100);
        } else {
          setTimeout(makeBotMove, 5);
        }
      }
    }
    function resetBoard() {
      botScore = 0;
      playerScore = 0;
      drawScore = 0;
      document.getElementById('bot-score').innerText = botScore;
      document.getElementById('player-score').innerText = playerScore;
      document.getElementById('draw-score').innerText = drawScore;
      startGame();
    }
    function minimax(board, depth, isMaximizingPlayer) {
      if (checkWin(humanPlayer)) {
        return -1;
      }

      if (checkWin(botPlayer)) {
        return 1;
      }

      if (checkDraw()) {
        return 0;
      }

      if (isMaximizingPlayer) {
        let bestScore = -Infinity;

        for (let i = 0; i < boardSize; i++) {
          for (let j = 0; j < boardSize; j++) {
            if (board[i][j] === null) {
              board[i][j] = botPlayer;
              let score = minimax(board, depth + 1, false);
              board[i][j] = null;
              bestScore = Math.max(score, bestScore);
            }
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;

        for (let i = 0; i < boardSize; i++) {
          for (let j = 0; j < boardSize; j++) {
            if (board[i][j] === null) {
              board[i][j] = humanPlayer;
              let score = minimax(board, depth + 1, true);
              board[i][j] = null;
              bestScore = Math.min(score, bestScore);
            }
          }
        }
        return bestScore;
      }
    }

    window.addEventListener('DOMContentLoaded', () => {
      startGame();
    });
    function resetBoard() {
  botScore = 0;
  playerScore = 0;
  drawScore = 0;
  document.getElementById('bot-score').innerText = botScore;
  document.getElementById('player-score').innerText = playerScore;
  document.getElementById('draw-score').innerText = drawScore;
  startGame();
}
