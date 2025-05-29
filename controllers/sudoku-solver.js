class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) {
      return { error: "Required field missing" };
    }

    if (puzzleString.length !== 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    }

    if (/[^1-9.]/g.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    }

    return true;
  }

  buildGrid(puzzleString) {
    if (puzzleString.length !== 81) return null;
    let grid = [];
    for (let i = 0; i < 9; i++) {
      grid.push(puzzleString.slice(i * 9, i * 9 + 9).split(''));
    }
    return grid;
  }


  checkRowPlacement(puzzleString, row, column, value) {
    const rowIndex = row.toUpperCase().charCodeAt(0) - 65;
    const grid = this.buildGrid(puzzleString);

    for (let col = 0; col < 9; col++) {
      if (grid[rowIndex][col] === value && col !== column) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const grid = this.buildGrid(puzzleString);
    const rowIndex = row.toUpperCase().charCodeAt(0) - 65;

    for (let r = 0; r < 9; r++) {
      if (grid[r][column] !== '.' && grid[r][column] === value && r !== rowIndex) {
        return false;
      }
    }
    return true;
  }





  checkRegionPlacement(puzzleString, row, column, value) {
    const rowIndex = row.toUpperCase().charCodeAt(0) - 65;
    const grid = this.buildGrid(puzzleString);

    const startRow = Math.floor(rowIndex / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;

    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (grid[r][c] === value && !(r === rowIndex && c === column)) {
          return false;
        }
      }
    }
    return true;
  }

  isValidPlacement(grid, row, col, value) {
    for (let i = 0; i < 9; i++) {
      if (
        grid[row][i] === value ||
        grid[i][col] === value ||
        grid[Math.floor(row / 3) * 3 + Math.floor(i / 3)]
            [Math.floor(col / 3) * 3 + (i % 3)] === value
      ) {
        return false;
      }
    }
    return true;
  }

  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (validation !== true) {
      return validation;
    }

    const grid = this.buildGrid(puzzleString);

    const solveRecursive = () => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] === ".") {
            for (let num = 1; num <= 9; num++) {
              const val = num.toString();
              if (this.isValidPlacement(grid, row, col, val)) {
                grid[row][col] = val;
                if (solveRecursive()) return true;
                grid[row][col] = ".";
              }
            }
            return false; // No valid number found
          }
        }
      }
      return true; // No empty cells
    };

    if (!solveRecursive()) {
      return { error: "Puzzle cannot be solved" };
    }

    // Convert grid back to string
    return grid.flat().join("");
  }
}

module.exports = SudokuSolver;
