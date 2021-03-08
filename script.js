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
    this.isGameOver = false;
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
        row.push(new Tile(i, j, false, size));
      }
      grid.push(row);
    }

    // while (this.bombsAdded < this.bombCount) {
    //   this.addBomb(grid);
    // }

    grid[0][0].isBomb = true;

    return grid;
  }

  clickOnBoard(r, c) {
    const res = this.grid[r][c].onClickContinueGame();
    console.log(res);
    if (res) {
      console.log('game continues');
    } else {
      console.log('game over');
      this.isGameOver = true;
    }
  }

  placeTiles() {}

  isGameOver() {}
}

class Tile {
  constructor(r, c, isBomb, size) {
    this.r = r;
    this.c = c;
    this.isBomb = isBomb;
    this.display = '_';
    this.boardSize = size;
  }

  getNeighborCoordinates(startR, startC) {
    let m = Math.sqrt(this.boardSize);
    let neighborCoordinates = [];
    const dirs = [-1, 0, 1];
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

  getBombCountOfNeighbors() {
    let neighbors = this.getNeighborCoordinates(this.r, this.c);
    // console.log(object);
  }

  onClickContinueGame() {
    if (this.isBomb) {
      this.display = 'X';
      return false;
    }
    this.display = this.getBombCountOfNeighbors();
    return true;
  }
}

class GameManager {}

const board = new Board(9, 5);
console.log(JSON.stringify(board));

const tile = board.grid[1][1];
console.log(tile);
// t.getNeighborCoordinates(0, 0);
console.log(tile.getNeighborCoordinates(0, 0));
console.log(JSON.stringify(tile.getNeighborCoordinates(0, 0)));

console.log(JSON.stringify(tile.getNeighborCoordinates(1, 1)));
console.log(JSON.stringify(tile.getNeighborCoordinates(2, 1)));
// board.clickOnBoard(0, 0);
console.log(board.clickOnBoard(1, 0));
console.log(board.clickOnBoard(0, 0));
