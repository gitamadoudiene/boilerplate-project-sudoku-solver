const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server'); // ou app selon ta config

chai.use(chaiHttp);

const puzzlesAndSolutions = require('../controllers/puzzle-strings.js');

suite('Functional Tests', () => {
  
  suite('POST /api/solve', () => {

    test('Solve a puzzle with valid puzzle string', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: puzzlesAndSolutions.puzzlesAndSolutions[0][0] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'solution');
          assert.equal(res.body.solution, puzzlesAndSolutions.puzzlesAndSolutions[0][1]);
          done();
        });
    });

    test('Solve a puzzle with missing puzzle string', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Required field missing' });
          done();
        });
    });

    test('Solve a puzzle with invalid characters', (done) => {
      const invalidPuzzle = '1'.repeat(80) + 'x';
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: invalidPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
          done();
        });
    });

    test('Solve a puzzle with incorrect length', (done) => {
      const shortPuzzle = '1'.repeat(80);
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: shortPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
          done();
        });
    });

    test('Solve a puzzle that cannot be solved', (done) => {
      // Modifions un puzzle pour qu'il ne soit pas solvable
      let puzzle = puzzlesAndSolutions.puzzlesAndSolutions[0][0].split('');
      puzzle[0] = '9';
      puzzle = puzzle.join('');
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
          done();
        });
    });

  });

  suite('POST /api/check', () => {

    test('Check a puzzle placement with all fields', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions.puzzlesAndSolutions[0][0],
          coordinate: 'A2',
          value: '3'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'valid');
          done();
        });
    });

    test('Check a puzzle placement with single placement conflict', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions.puzzlesAndSolutions[0][0],
          coordinate: 'A2',
          value: '2' // suppose que 2 provoque un conflit dans la rangée par exemple
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.isArray(res.body.conflict);
          assert.include(res.body.conflict, 'row');
          done();
        });
    });

    test('Check a puzzle placement with multiple placement conflicts', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions.puzzlesAndSolutions[0][0],
          coordinate: 'A2',
          value: '1' // suppose que 1 provoque conflit row et column
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.includeMembers(res.body.conflict, ['row', 'column']);
          done();
        });
    });

    test('Check a puzzle placement with all placement conflicts', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions.puzzlesAndSolutions[0][0],
          coordinate: 'A2',
          value: '5' // suppose conflit row, column et region
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.includeMembers(res.body.conflict, ['row', 'column', 'region']);
          done();
        });
    });

    test('Check a puzzle placement with missing required fields', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions.puzzlesAndSolutions[0][0],
          value: '5'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Required field(s) missing' });
          done();
        });
    });

    test('Check a puzzle placement with invalid characters', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '1'.repeat(80) + 'x',
          coordinate: 'A2',
          value: '5'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
          done();
        });
    });

    test('Check a puzzle placement with incorrect length', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '1'.repeat(80),
          coordinate: 'A2',
          value: '5'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
          done();
        });
    });

    test('Check a puzzle placement with invalid placement coordinate', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions.puzzlesAndSolutions[0][0],
          coordinate: 'Z9',
          value: '5'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid coordinate' });
          done();
        });
    });

    test('Check a puzzle placement with invalid placement value', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions.puzzlesAndSolutions[0][0],
          coordinate: 'A2',
          value: '0'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid value' });
          done();
        });
    });

  });

});
