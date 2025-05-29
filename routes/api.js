'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      // Vérifier que tous les champs requis sont présents
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      // Valider la chaîne du puzzle
      const validation = solver.validate(puzzle);
      if (validation !== true) {
        return res.json(validation);
      }

      // Valider la coordonnée (ex: A1 à I9)
      if (!/^[A-I][1-9]$/.test(coordinate.toUpperCase())) {
        return res.json({ error: 'Invalid coordinate' });
      }

      // Valider la valeur (chiffre de 1 à 9)
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      // Calculer indices ligne et colonne à partir de la coordonnée
      const rowChar = coordinate[0].toUpperCase();
    const row = rowChar.charCodeAt(0) - 65;

      const col = parseInt(coordinate[1], 10) - 1;

      // Récupérer la grille sous forme de tableau 2D
      const grid = solver.buildGrid(puzzle);

      // Si la valeur est déjà à la position donnée, la placer est valide
      if (grid[row][col] === value) {
        return res.json({ valid: true });
      }

      // Vérifier conflits possibles
      const conflicts = [];
      if (!solver.checkRowPlacement(puzzle, rowChar, col, value)) conflicts.push('row');
      if (!solver.checkColPlacement(puzzle, rowChar, col, value)) conflicts.push('column');
      if (!solver.checkRegionPlacement(puzzle, rowChar, col, value)) conflicts.push('region');

      if (conflicts.length > 0) {
        return res.json({ valid: false, conflict: conflicts });
      }

      // Pas de conflits détectés
      return res.json({ valid: true });
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      // Valider que puzzle est présent
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      // Valider la chaîne puzzle
      const validation = solver.validate(puzzle);
      if (validation !== true) {
        return res.json(validation);
      }

      // Tenter de résoudre le sudoku
      const solution = solver.solve(puzzle);

      if (!solution || solution.error) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }

      return res.json({ solution });
    });
};
