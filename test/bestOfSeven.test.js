const { evaluateHand } = require('../src/handEvaluator');

describe('best of seven selection', () => {
  test('can use both hole cards', () => {
    const board = ['AC', 'KD', 'QH', '2S', '3D'];
    const holeCards = ['JC', 'TC'];

    const result = evaluateHand(board, holeCards);

    expect(result.category).toBe('Straight');
    expect(result.chosen5).toEqual(['AC', 'KD', 'QH', 'JC', 'TC']);
  });

  test('can use one hole card', () => {
    const board = ['AH', 'JH', '9H', '4H', '2C'];
    const holeCards = ['6H', 'KD'];

    const result = evaluateHand(board, holeCards);

    expect(result.category).toBe('Flush');
    expect(result.chosen5).toEqual(['AH', 'JH', '9H', '6H', '4H']);
  });

  test('can use zero hole cards when board plays', () => {
    const board = ['5C', '6D', '7H', '8S', '9D'];
    const holeCards = ['AC', 'KD'];

    const result = evaluateHand(board, holeCards);

    expect(result.category).toBe('Straight');
    expect(result.chosen5).toEqual(['9D', '8S', '7H', '6D', '5C']);
  });

  test('chooses the best possible category among 7 cards', () => {
    const board = ['AH', 'KH', 'QH', 'JH', '2D'];
    const holeCards = ['TH', 'AS'];

    const result = evaluateHand(board, holeCards);

    expect(result.category).toBe('Straight flush');
    expect(result.chosen5).toEqual(['AH', 'KH', 'QH', 'JH', 'TH']);
  });
});