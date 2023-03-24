const inquirer = require('inquirer');

class Connect4 {

  constructor() {
    // track current player's turn
    this.player = 1;
    // total turns taken in game
    this.totalTurns = 0;
    // track print board message
    this.message = `Player ${this.player}'s turn!`;

    // track state of board
    this.board = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    }
  }

  // print current state of board
  printBoard() {
    console.log(
      `
        0   1   2   3   4   5   6
      | ${(this.board[0][5]) ? this.board[0][5] : " "} | ${(this.board[1][5]) ? this.board[1][5] : " "} | ${(this.board[2][5]) ? this.board[2][5] : " "} | ${(this.board[3][5]) ? this.board[3][5] : " "} | ${(this.board[4][5]) ? this.board[4][5] : " "} | ${(this.board[5][5]) ? this.board[5][5] : " "} | ${(this.board[6][5]) ? this.board[6][5] : " "} |
      | ${(this.board[0][4]) ? this.board[0][4] : " "} | ${(this.board[1][4]) ? this.board[1][4] : " "} | ${(this.board[2][4]) ? this.board[2][4] : " "} | ${(this.board[3][4]) ? this.board[3][4] : " "} | ${(this.board[4][4]) ? this.board[4][4] : " "} | ${(this.board[5][4]) ? this.board[5][4] : " "} | ${(this.board[6][4]) ? this.board[6][4] : " "} |
      | ${(this.board[0][3]) ? this.board[0][3] : " "} | ${(this.board[1][3]) ? this.board[1][3] : " "} | ${(this.board[2][3]) ? this.board[2][3] : " "} | ${(this.board[3][3]) ? this.board[3][3] : " "} | ${(this.board[4][3]) ? this.board[4][3] : " "} | ${(this.board[5][3]) ? this.board[5][3] : " "} | ${(this.board[6][3]) ? this.board[6][3] : " "} |
      | ${(this.board[0][2]) ? this.board[0][2] : " "} | ${(this.board[1][2]) ? this.board[1][2] : " "} | ${(this.board[2][2]) ? this.board[2][2] : " "} | ${(this.board[3][2]) ? this.board[3][2] : " "} | ${(this.board[4][2]) ? this.board[4][2] : " "} | ${(this.board[5][2]) ? this.board[5][2] : " "} | ${(this.board[6][2]) ? this.board[6][2] : " "} |
      | ${(this.board[0][1]) ? this.board[0][1] : " "} | ${(this.board[1][1]) ? this.board[1][1] : " "} | ${(this.board[2][1]) ? this.board[2][1] : " "} | ${(this.board[3][1]) ? this.board[3][1] : " "} | ${(this.board[4][1]) ? this.board[4][1] : " "} | ${(this.board[5][1]) ? this.board[5][1] : " "} | ${(this.board[6][1]) ? this.board[6][1] : " "} |
      | ${(this.board[0][0]) ? this.board[0][0] : " "} | ${(this.board[1][0]) ? this.board[1][0] : " "} | ${(this.board[2][0]) ? this.board[2][0] : " "} | ${(this.board[3][0]) ? this.board[3][0] : " "} | ${(this.board[4][0]) ? this.board[4][0] : " "} | ${(this.board[5][0]) ? this.board[5][0] : " "} | ${(this.board[6][0]) ? this.board[6][0] : " "} |
      -----------------------------
      ${this.message}
      `
    );
  }

  // accept user input
  async makeMove() {
    let response = await inquirer.prompt([
      {
        type: "list",
        name: "column",
        message: "Add your piece to which column?",
        choices: [0, 1, 2, 3, 4, 5, 6]
      }
    ])
    this.play(response.column);
    return;
  }

  // check if vertical four-in-a-row
  validateVertical(col, n) {
    // if column array length < 4 no need to validate
    if (this.board[col].length < 4) {
      return false;
    }

    // retrieve position of pieces three spaces below current piece
    let string = `${this.board[col][n-3]}${this.board[col][n-2]}${this.board[col][n-1]}${this.board[col][n]}`;
    
    // check if string includes 4 in a row
    return string.includes(`${this.player}${this.player}${this.player}${this.player}`);
  }

  // check if horizontal four-in-a-row
  validateHorizontal(col, n) {
    // intialize empty string to hold pieces in a row
    let string = "";
    
    // retrieve position of pieces three spaces left and right of current piece
    const horAdjust = [col-3, col-2, col-1, col, col+1, col+2, col+3];
    // remove column positions that do not exist on the board
    const horizontal = horAdjust.filter(pos => pos >= 0 && pos < 7);

    // retrieve value of piece in specified positions
    horizontal.forEach(pos => {
      let piece = this.board[pos][n];
      // if the space is empty add a zero
      (!piece) ? string += 0 : string += piece;
    });

    // check if string includes 4 in a row
    return string.includes(`${this.player}${this.player}${this.player}${this.player}`);
  }

  // check if diagonal four-in-a-row
  validateDiagonal(col, n) {
    // intialize empty strings to hold pieces in a diagonal
    let str1 = "";
    let str2 = "";

    // retrieve position of pieces three spaces down/left and up/right
    const sameAdj = [[col-3, n-3], [col-2, n-2], [col-1, n-1], [col, n], [col+1, n+1], [col+2, n+2], [col+3, n+3]];
    // remove column positions that do not exist on the board
    const diag1 = sameAdj.filter(pos => pos[0] >= 0 && pos[0] < 7);
    
    // retrieve value of piece in specified positions
    diag1.forEach(pos => {
      let piece = this.board[pos[0]][pos[1]];
      // if the space is empty add a zero
      (!piece) ? str1 += 0 : str1 += piece;
    });

    // retrieve position of pieces three spaces up/left and down/right
    const oppositeAdj = [[col-3, n+3], [col-2, n+2], [col-1, n+1], [col, n], [col+1, n-1], [col+2, n-2], [col+3, n-3]];
    // remove column positions that do not exist on the the board
    const diag2 = oppositeAdj.filter(pos => pos[0] >= 0 && pos[0] < 7);
    
    // retrieve value of piece in specified positions
    diag2.forEach(pos => {
      let piece = this.board[pos[0]][pos[1]];
      // if the space is empty add a zero
      (!piece) ? str2 += 0 : str2 += piece;
    });

    // if either diagonal contains four-in-a-row return true
    if (str1.includes(`${this.player}${this.player}${this.player}${this.player}`) || str2.includes(`${this.player}${this.player}${this.player}${this.player}`)) {
      return true;
    }
    return false;
  }

  // take a turn
  play(col) {
    // check if column full
    if (this.board[col].length === 6) {
      this.message = `Column is full! Player ${this.player}, please pick a different column.`;
      this.printBoard();
      this.makeMove();
      return;
    }

    // add piece to column
    this.board[col].push(this.player);
    // increase total turns
    this.totalTurns += 1;

    // retrieve current piece's position in column
    let n = this.board[col].length-1;

    // check if piece made a winning move
    let vertical = this.validateVertical(col, n);
    let horizontal = this.validateHorizontal(col, n);
    let diagonal = this.validateDiagonal(col, n);

    if (vertical || horizontal || diagonal) {
      this.message = `Player ${this.player} wins!`;
      this.printBoard();
      return;
    }

    // check if board full
    if (this.totalTurns === 42) {
      this.message = `Game ended in a tie!`;
      this.printBoard();
      return;
    }

    // change player, update message
    (this.player === 1) ? this.player = 2 : this.player = 1;
    this.message = `Player ${this.player}'s turn!`
    this.printBoard();
    this.makeMove();
  }

  // start game
  newGame() {
    console.log("Welcome to two-player Connect Four!");
    console.log("\nEach player will take turns adding a game piece to one of seven columns.");
    console.log("The pieces enter from the top of the column and drop to very bottom, stacking on top of existing pieces.");
    console.log("The objective is to be the first player to align four of the player's own pieces in a column, row, or diagonal.");
    console.log("This is the board. Player one takes the first move. Good luck!");
    this.printBoard();
    this.makeMove();
  }
}

new Connect4().newGame();