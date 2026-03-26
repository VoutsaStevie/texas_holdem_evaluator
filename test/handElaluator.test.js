const { evaluateHand } = require('../src/handEvaluator');

describe('evaluateHand', () => {
  test('detects a high card hand and returns the best 5 cards', () => {
    const board = ['AC', 'JD', '8H', '4S', '2D'];
    const holeCards = ['KC', '7D'];

    const result = evaluateHand(board, holeCards);

    expect(result.category).toBe('High card');
    expect(result.chosen5).toEqual(['AC', 'KC', 'JD', '8H', '7D']);
  });

  test('detects one pair and returns the pair first then kickers', () => {
    const board = ['AC', 'JD', '8H', '4S', '2D'];
    const holeCards = ['JC', '7D'];

    const result = evaluateHand(board, holeCards);

    expect(result.category).toBe('One pair');
    expect(result.chosen5).toEqual(['JC', 'JD', 'AC', '8H', '7D']);
  });

  test('detects two pair and orders chosen5 as higher pair, lower pair, kicker', () => {
    const board = ['AC', 'AD', '8H', '4S', '2D'];
    const holeCards = ['8C', '7D'];

    const result = evaluateHand(board, holeCards);

    expect(result.category).toBe('Two pair');
    expect(result.chosen5).toEqual(['AC', 'AD', '8C', '8H', '7D']);
  });

  test('detects three of a kind', () => {
    const board = ['AC', 'AD', '8H', '4S', '2D'];
    const holeCards = ['AH', '7D'];

    const result = evaluateHand(board, holeCards);

    expect(result.category).toBe('Three of a kind');
    expect(result.chosen5).toEqual(['AC', 'AD', 'AH', '8H', '7D']);
  });

  test('detects an ace-low straight (wheel)', () => {
    const board = ['AC', '2D', '3H', '4S', '9D'];
    const holeCards = ['5C', 'KD'];

    const result = evaluateHand(board, holeCards);

    expect(result.category).toBe('Straight');
    expect(result.chosen5).toEqual(['5C', '4S', '3H', '2D', 'AC']);
  });

  test('detects an ace-high straight', () => {
    const board = ['TC', 'JD', 'QH', 'KS', '2D'];
    const holeCards = ['AC', '3D'];

    const result = evaluateHand(board, holeCards);

    expect(result.category).toBe('Straight');
    expect(result.chosen5).toEqual(['AC', 'KS', 'QH', 'JD', 'TC']);
  });

  test('detects a flush and returns the best five suited cards', () => {
    const board = ['AH', 'JH', '9H', '4H', '2C'];
    const holeCards = ['6H', 'KD'];

    const result = evaluateHand(board, holeCards);

    expect(result.category).toBe('Flush');
    expect(result.chosen5).toEqual(['AH', 'JH', '9H', '6H', '4H']);
  });

  test('detects a full house', () => {
    const board = ['AC', 'AD', 'AH', '8S', '8D'];
    const holeCards = ['2C', '3D'];

    const result = evaluateHand(board, holeCards);

    expect(result.category).toBe('Full house');
    expect(result.chosen5).toEqual(['AC', 'AD', 'AH', '8S', '8D']);
  });

  test('detects four of a kind', () => {
    const board = ['7C', '7D', '7H', '7S', '2D'];
    const holeCards = ['AC', 'KD'];

    const result = evaluateHand(board, holeCards);

    expect(result.category).toBe('Four of a kind');
    expect(result.chosen5).toEqual(['7C', '7D', '7H', '7S', 'AC']);
  });

  test('detects a straight flush', () => {
    const board = ['9H', 'TH', 'JH', 'QH', '2D'];
    const holeCards = ['KH', '3C'];

    const result = evaluateHand(board, holeCards);

    expect(result.category).toBe('Straight flush');
    expect(result.chosen5).toEqual(['KH', 'QH', 'JH', 'TH', '9H']);
  });
});