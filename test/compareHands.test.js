const { comparePlayers } = require('../src/compareHands');

describe('comparePlayers', () => {
  test('returns one winner when categories differ', () => {
    const board = ['AC', 'AD', '8H', '4S', '2D'];

    const players = [
      { playerId: 'p1', holeCards: ['AH', '7D'] }, 
      { playerId: 'p2', holeCards: ['KC', 'QD'] } 
    ];

    const result = comparePlayers(board, players);

    expect(result.winners).toEqual(['p1']);
    expect(result.results[0].playerId).toBe('p1');
    expect(result.results[0].category).toBe('Three of a kind');
  });

  test('breaks tie in straight by highest card', () => {
    const board = ['4C', '5D', '6H', '7S', 'KD'];

    const players = [
      { playerId: 'p1', holeCards: ['8C', '2D'] },
      { playerId: 'p2', holeCards: ['3C', '2H'] }
    ];

    const result = comparePlayers(board, players);

    expect(result.winners).toEqual(['p1']);
  });

  test('breaks tie in four of a kind using kicker', () => {
    const board = ['7C', '7D', '7H', '7S', '2D'];

    const players = [
      { playerId: 'p1', holeCards: ['AC', 'KC'] },
      { playerId: 'p2', holeCards: ['QC', 'JC'] }
    ];

    const result = comparePlayers(board, players);

    expect(result.winners).toEqual(['p1']);
  });

  test('breaks tie in full house using the triplet rank first', () => {
    const board = ['KC', 'KD', '2H', '2S', '9D'];

    const players = [
      { playerId: 'p1', holeCards: ['KH', '3C'] }, 
      { playerId: 'p2', holeCards: ['2C', 'AS'] }  
    ];

    const result = comparePlayers(board, players);

    expect(result.winners).toEqual(['p1']);
  });

  test('breaks tie in flush by comparing cards in descending order', () => {
    const board = ['AH', 'JH', '8H', '4H', '2D'];

    const players = [
      { playerId: 'p1', holeCards: ['9H', '3C'] }, 
      { playerId: 'p2', holeCards: ['7H', 'KC'] }  
    ];

    const result = comparePlayers(board, players);

    expect(result.winners).toEqual(['p1']);
  });

  test('breaks tie in three of a kind with kickers', () => {
    const board = ['QC', 'QD', 'QH', '4S', '2D'];

    const players = [
      { playerId: 'p1', holeCards: ['AC', 'KD'] },
      { playerId: 'p2', holeCards: ['AC', 'JD'] }
    ];

    const result = comparePlayers(board, players);

    expect(result.winners).toEqual(['p1']);
  });

  test('breaks tie in two pair using higher pair, then lower pair, then kicker', () => {
    const board = ['AC', 'AD', '8H', '8S', '2D'];

    const players = [
      { playerId: 'p1', holeCards: ['KC', '3D'] },
      { playerId: 'p2', holeCards: ['QC', '4D'] }
    ];

    const result = comparePlayers(board, players);

    expect(result.winners).toEqual(['p1']);
  });

  test('breaks tie in one pair using kickers in descending order', () => {
    const board = ['AC', 'JD', '8H', '4S', '2D'];

    const players = [
      { playerId: 'p1', holeCards: ['JC', 'KD'] },
      { playerId: 'p2', holeCards: ['JS', 'QD'] }
    ];

    const result = comparePlayers(board, players);

    expect(result.winners).toEqual(['p1']);
  });

  test('breaks tie in high card using descending card comparison', () => {
    const board = ['AC', 'JD', '8H', '4S', '2D'];

    const players = [
      { playerId: 'p1', holeCards: ['KC', '7D'] },
      { playerId: 'p2', holeCards: ['QC', '9D'] }
    ];

    const result = comparePlayers(board, players);

    expect(result.winners).toEqual(['p1']);
  });

  test('returns split pot when board plays for everyone', () => {
    const board = ['5C', '6D', '7H', '8S', '9D'];

    const players = [
      { playerId: 'p1', holeCards: ['AC', 'AD'] },
      { playerId: 'p2', holeCards: ['KC', 'QD'] }
    ];

    const result = comparePlayers(board, players);

    expect(result.winners).toEqual(['p1', 'p2']);
    expect(result.results[0].chosen5).toEqual(['9D', '8S', '7H', '6D', '5C']);
    expect(result.results[1].chosen5).toEqual(['9D', '8S', '7H', '6D', '5C']);
  });
});