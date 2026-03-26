const { evaluateHand } = require('../src/handEvaluator');

describe('input validation', () => {
  test('throws when duplicate cards exist', () => {
    const board = ['AC', 'AC', '3H', '4S', '9D'];
    const holeCards = ['5C', 'KD'];

    expect(() => evaluateHand(board, holeCards)).toThrow();
  });

  test('throws when board does not contain exactly 5 cards', () => {
    const board = ['AC', '2D', '3H', '4S'];
    const holeCards = ['5C', 'KD'];

    expect(() => evaluateHand(board, holeCards)).toThrow();
  });

  test('throws when hole cards do not contain exactly 2 cards', () => {
    const board = ['AC', '2D', '3H', '4S', '9D'];
    const holeCards = ['5C'];

    expect(() => evaluateHand(board, holeCards)).toThrow();
  });
});