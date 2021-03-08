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
        row.push(new Tile(i, j, false));
      }
      grid.push(row);
    }

    while (this.bombsAdded < this.bombCount) {
      this.addBomb(grid);
    }

    return grid;
  }

  placeTiles() {}

  isGameOver() {}
}

class Tile {
  constructor(r, c, isBomb) {
    this.r = r;
    this.c = c;
    this.isBomb = isBomb;
  }

  clickNeighbors() {}

  onTileClick() {
    if (this.isBomb) {
    }
  }
}

class GameManager {}

const board = new Board(9, 5);
console.log(JSON.stringify(board));
