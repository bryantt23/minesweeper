// https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Board {
  constructor(size, bombCount) {
    this.size = size;
    this.bombCount = bombCount;
    this.bombsAdded = 0;
    this.grid = this.buildGrid(size);
    this.isGameLost = false;
  }

  addBomb(grid) {
    let m = grid.length;
    let r = randomNum(0, m - 1),
      c = randomNum(0, m - 1);
    if (!grid[r][c].isBomb) {
      grid[r][c].isBomb = true;
      this.bombsAdded++;
    }
  }

  buildGrid(size) {
    let m = Math.sqrt(size);
    let grid = [];
    for (let i = 0; i < m; i++) {
      let row = [];
      for (let j = 0; j < m; j++) {
        row.push(new Tile(i, j, false, this));
      }
      grid.push(row);
    }

    while (this.bombsAdded < this.bombCount) {
      this.addBomb(grid);
    }

    // grid[0][0].isBomb = true;
    // grid[1][1].isBomb = true;
    // grid[2][0].isBomb = true;

    return grid;
  }

  clickOnBoard(r, c) {
    const res = this.grid[r][c].onClickContinueGame();
    console.log(res);
    if (res) {
      console.log('game continues');
    } else {
      console.log('Game Over');
      this.isGameLost = true;
    }
  }

  displayBoardCheat() {
    let m = this.grid.length;
    for (let i = 0; i < m; i++) {
      let res = '';
      for (let j = 0; j < m; j++) {
        res += this.grid[i][j].isBomb ? 'B ' : '_ ';
      }
      console.log(res);
    }
  }

  displayBoard() {
    let m = this.grid.length;
    for (let i = 0; i < m; i++) {
      let res = '';
      for (let j = 0; j < m; j++) {
        res += this.grid[i][j].display + ' ';
      }
      console.log(res);
    }
  }

  placeTiles() {}

  isGameWon() {
    let m = this.grid.length;
    let nonBombsDisplayed = 0;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < m; j++) {
        const grid = this.grid[i][j];
        if (grid.display !== '*') {
          nonBombsDisplayed++;
        }
      }
    }
    console.log(this);
    const win = nonBombsDisplayed === this.size - this.bombCount;
    if (win) {
      console.log('You win!');
    }
    return win;
  }

  //is game won, is game lost
  isTheGameOver() {
    // debugger;
    if (this.isGameWon() || this.isGameLost) {
      console.log(true);
      this.displayBoardCheat();
      return true;
    } else {
      console.log(false);
      return false;
    }
  }
}

class Tile {
  constructor(r, c, isBomb, board) {
    this.r = r;
    this.c = c;
    this.isBomb = isBomb;
    this.display = '*';
    this.board = board;
  }

  getNeighborCoordinates(startR, startC) {
    let m = Math.sqrt(this.board.size);
    let neighborCoordinates = [];
    const dirs = [-1, 1];
    for (let i = 0; i < dirs.length; i++) {
      for (let j = 0; j < dirs.length; j++) {
        const r = dirs[i],
          c = dirs[j];
        const nextR = startR + r,
          nextC = startC + c;
        if (nextR === startR && nextC === startC) continue;
        if (nextC < 0 || nextC === m || nextR < 0 || nextR === m) continue;
        neighborCoordinates.push([nextR, nextC]);
      }
    }
    return neighborCoordinates;
  }

  clickNeighbors(startR, startC) {}

  // getBombCountOfNeighbors(neighbors) {
  //   let bombCt = 0;
  //   for (let n in neighbors) {
  //     console.log(neighbors[n]);
  //     const [r, c] = neighbors[n];
  //     console.log(r, c);
  //     if (this.board.grid[r][c].isBomb) {
  //       bombCt++;
  //     }
  //   }
  //   return bombCt;
  // }

  getBombCountOfNeighbors(r, c) {
    return (
      this.hasBomb(r + 1, c) +
      this.hasBomb(r, c + 1) +
      this.hasBomb(r - 1, c) +
      this.hasBomb(r, c - 1)
    );
  }

  hasBomb(r, c) {
    let m = Math.sqrt(this.board.size);
    if (c < 0 || c === m || r < 0 || r === m) return 0;

    return this.board.grid[r][c].isBomb ? 1 : 0;
  }

  expandRecursively(r, c) {
    // console.log(r, c);
    //base case
    let m = Math.sqrt(this.board.size);
    if (c < 0 || c === m || r < 0 || r === m) return;
    if (this.board.grid[r][c].isBomb) return;
    if (this.board.grid[r][c].display !== '*') return;
    // let neighbors = this.getNeighborCoordinates(r, c);
    this.board.grid[r][c].display = this.getBombCountOfNeighbors(r, c);
    // debugger;
    // for (let n in neighbors) {
    //   console.log(neighbors[n]);
    //   const [rr, cc] = neighbors[n];
    //   this.expandRecursively(rr, cc);
    // }
    this.expandRecursively(r + 1, c);
    this.expandRecursively(r, c + 1);
    this.expandRecursively(r - 1, c);
    this.expandRecursively(r, c - 1);
  }

  onClickContinueGame() {
    if (this.isBomb) {
      this.display = 'X';
      return false;
    }
    // let neighbors = this.getNeighborCoordinates(this.r, this.c);
    // this.display = this.getBombCountOfNeighbors(neighbors);

    // debugger;
    this.expandRecursively(this.r, this.c);

    return true;
  }
}

class GameManager {
  constructor(size, bombsCount) {
    this.board = new Board(size, bombsCount);
  }

  start() {
    this.board.displayBoardCheat();
    while (!this.board.isTheGameOver()) {
      this.getInput();
    }
  }

  getInput() {
    console.log(this.board);
    console.log(this.board.grid);
    // console.log(JSON.stringify(this.board.grid));

    this.board.displayBoard();
    const input = prompt('Enter a coordinate');
    if (!input) {
      throw new Error('exiting');
    }
    const [r, c] = input.split(' ');
    this.board.clickOnBoard(r, c);
    this.board.displayBoard();
    console.log(this.board);
  }
}

/*
const board = new Board(9, 3);
// console.log(JSON.stringify(board));
console.log(board);
board.displayBoard();

const tile = board.grid[1][1];
console.log(tile);
// t.getNeighborCoordinates(0, 0);
console.log(tile.getNeighborCoordinates(0, 0));
// console.log(JSON.stringify(tile.getNeighborCoordinates(0, 0)));

// console.log(JSON.stringify(tile.getNeighborCoordinates(1, 1)));
// console.log(JSON.stringify(tile.getNeighborCoordinates(2, 1)));
// board.clickOnBoard(0, 0);
board.clickOnBoard(1, 0);
board.displayBoard();
console.log(board.isTheGameOver());
board.isTheGameOver();
// console.log(JSON.stringify(board));
// board.clickOnBoard(0, 0);
// board.displayBoard();
*/

const game = new GameManager(25, 10);
game.start();
