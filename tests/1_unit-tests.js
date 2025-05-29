const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver = new SudokuSolver();

const puzzlesAndSolutions = require('../controllers/puzzle-strings.js');

suite('Unit Tests', () => {
  
  test('Logic handles a valid puzzle string of 81 characters', () => {
    const validPuzzle = puzzlesAndSolutions.puzzlesAndSolutions[0][0];
    const validation = solver.validate(validPuzzle);
    assert.isTrue(validation === true);
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const invalidPuzzle = '1'.repeat(80) + 'x';
    const validation = solver.validate(invalidPuzzle);
    assert.deepEqual(validation, { error: 'Invalid characters in puzzle' });
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const shortPuzzle = '1'.repeat(80);
    const validation = solver.validate(shortPuzzle);
    assert.deepEqual(validation, { error: 'Expected puzzle to be 81 characters long' });
  });

  test('Logic handles a valid row placement', () => {
    const puzzle = puzzlesAndSolutions.puzzlesAndSolutions[0][0];
    assert.isTrue(solver.checkRowPlacement(puzzle, 'A', 1, '7'));
  });

  test('Logic handles an invalid row placement', () => {
    const puzzle = puzzlesAndSolutions.puzzlesAndSolutions[0][0];
    assert.isFalse(solver.checkRowPlacement(puzzle, 'A', 1, '5'));
  });
//Pas une bonnepratique
  test('Logic handles a valid column placement', () => {
    const puzzle = puzzlesAndSolutions.puzzlesAndSolutions[0][0];
    assert.isTrue(solver.checkColPlacement(puzzle, 'A', 1, '7'));
  });

  test('Logic handles an invalid column placement', () => {
    const puzzle = puzzlesAndSolutions.puzzlesAndSolutions[0][0];
    assert.isFalse(solver.checkColPlacement(puzzle, 'A', 1, '5'));
  });
  // Pas une bonnepratique

  test('Logic handles a valid region (3x3 grid) placement', () => {
    const puzzle = puzzlesAndSolutions.puzzlesAndSolutions[0][0];
    assert.isTrue(solver.checkRegionPlacement(puzzle, 'A', 1, '7'));
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    const puzzle = puzzlesAndSolutions.puzzlesAndSolutions[0][0];
    assert.isFalse(solver.checkRegionPlacement(puzzle, 'A', 1, '5'));
  });

  test('Valid puzzle strings pass the solver', () => {
    const puzzle = puzzlesAndSolutions.puzzlesAndSolutions[0][0];
    const solution = solver.solve(puzzle);
    assert.isString(solution);
    assert.equal(solution.length, 81);
  });

  test('Invalid puzzle strings fail the solver', () => {
    const invalidPuzzle = '1'.repeat(80) + 'x';
    const solution = solver.solve(invalidPuzzle);
    assert.deepEqual(solution, { error: 'Invalid characters in puzzle' });
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const puzzle = puzzlesAndSolutions.puzzlesAndSolutions[0][0];
    const expectedSolution = puzzlesAndSolutions.puzzlesAndSolutions[0][1];
    const solution = solver.solve(puzzle);
    assert.equal(solution, expectedSolution);
  });

});
