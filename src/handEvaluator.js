// Hand Evaluator for Texas Hold'em

function parseCard(cardStr) {
  const rankMap = {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'T':10,'J':11,'Q':12,'K':13,'A':14};
  const suitMap = {'C':'clubs','D':'diamonds','H':'hearts','S':'spades'};
  return { rank: rankMap[cardStr[0]], suit: suitMap[cardStr[1]] };
}

function cardStr(card) {
  const rankMap = {2:'2',3:'3',4:'4',5:'5',6:'6',7:'7',8:'8',9:'9',10:'T',11:'J',12:'Q',13:'K',14:'A'};
  const suitMap = {'clubs':'C','diamonds':'D','hearts':'H','spades':'S'};
  return rankMap[card.rank] + suitMap[card.suit];
}

function findStraightFlush(allCards) {
  const suits = ['clubs','diamonds','hearts','spades'];
  for (let suit of suits) {
    const suitCards = allCards.filter(c => c.suit === suit);
    if (suitCards.length >= 5) {
      const result = findStraight(suitCards);
      if (result) return result;
    }
  }
  return null;
}

function findFourOfAKind(allCards) {
  const rankCounts = {};
  allCards.forEach(c => rankCounts[c.rank] = (rankCounts[c.rank] || 0) + 1);
  for (let rank in rankCounts) {
    if (rankCounts[rank] === 4) {
      const quads = allCards.filter(c => c.rank == rank).sort((a,b) => a.suit.localeCompare(b.suit));
      const kickers = allCards.filter(c => c.rank != rank).sort((a,b) => b.rank - a.rank || a.suit.localeCompare(b.suit));
      return [...quads, kickers[0]];
    }
  }
  return null;
}

function findFullHouse(allCards) {
  const rankCounts = {};
  allCards.forEach(c => rankCounts[c.rank] = (rankCounts[c.rank] || 0) + 1);
  const threes = Object.keys(rankCounts).filter(r => rankCounts[r] === 3).sort((a,b) => b - a);
  const twos = Object.keys(rankCounts).filter(r => rankCounts[r] === 2).sort((a,b) => b - a);
  if (threes.length >= 1 && (twos.length >= 1 || threes.length >= 2)) {
    const threeRank = threes[0];
    const twoRank = twos.length >= 1 ? twos[0] : threes[1];
    const threeCards = allCards.filter(c => c.rank == threeRank);
    const twoCards = allCards.filter(c => c.rank == twoRank);
    return [...threeCards, ...twoCards];
  }
  return null;
}

function findFlush(allCards) {
  const suitGroups = {};
  allCards.forEach(c => {
    if (!suitGroups[c.suit]) suitGroups[c.suit] = [];
    suitGroups[c.suit].push(c);
  });
  for (let suit in suitGroups) {
    if (suitGroups[suit].length >= 5) {
      const cards = suitGroups[suit].sort((a,b) => b.rank - a.rank || a.suit.localeCompare(b.suit));
      return cards.slice(0,5);
    }
  }
  return null;
}

function findStraight(allCards) {
  const ranks = allCards.map(c => c.rank);
  const uniqueRanks = [...new Set(ranks)];
  const straightTops = [14,13,12,11,10,9,8,7,6,5];
  for (let top of straightTops) {
    let straightRanks;
    if (top === 14) {
      straightRanks = [10,11,12,13,14];
    } else if (top === 5) {
      straightRanks = [14,2,3,4,5];
    } else {
      straightRanks = [top-4, top-3, top-2, top-1, top];
    }
    if (straightRanks.every(r => uniqueRanks.includes(r))) {
      const chosen = allCards.filter(c => straightRanks.includes(c.rank));
      if (top === 5) {
        chosen.sort((a,b) => {
          const aVal = a.rank === 14 ? 1 : a.rank;
          const bVal = b.rank === 14 ? 1 : b.rank;
          return bVal - aVal;
        });
      } else {
        chosen.sort((a,b) => b.rank - a.rank);
      }
      return chosen;
    }
  }
  return null;
}

function findThreeOfAKind(allCards) {
  const rankCounts = {};
  allCards.forEach(c => rankCounts[c.rank] = (rankCounts[c.rank] || 0) + 1);
  for (let rank in rankCounts) {
    if (rankCounts[rank] === 3) {
      const three = allCards.filter(c => c.rank == rank).sort((a,b) => a.suit.localeCompare(b.suit));
      const kickers = allCards.filter(c => c.rank != rank).sort((a,b) => b.rank - a.rank || a.suit.localeCompare(b.suit)).slice(0,2);
      return [...three, ...kickers.slice(0,2)];
    }
  }
  return null;
}

function findTwoPair(allCards) {
  const rankCounts = {};
  allCards.forEach(c => rankCounts[c.rank] = (rankCounts[c.rank] || 0) + 1);
  const pairs = Object.keys(rankCounts).filter(r => rankCounts[r] >= 2).sort((a,b) => b - a);
  if (pairs.length >= 2) {
    const highPair = pairs[0], lowPair = pairs[1];
    const highCards = allCards.filter(c => c.rank == highPair).sort((a,b) => a.suit.localeCompare(b.suit));
    const lowCards = allCards.filter(c => c.rank == lowPair).sort((a,b) => a.suit.localeCompare(b.suit));
    const kicker = allCards.filter(c => c.rank != highPair && c.rank != lowPair).sort((a,b) => b.rank - a.rank || a.suit.localeCompare(b.suit))[0];
    return [...highCards, ...lowCards, kicker];
  }
  return null;
}

function findOnePair(allCards) {
  const rankCounts = {};
  allCards.forEach(c => rankCounts[c.rank] = (rankCounts[c.rank] || 0) + 1);
  const pairs = Object.keys(rankCounts).filter(r => rankCounts[r] >= 2).sort((a,b) => b - a);
  if (pairs.length >= 1) {
    const pairRank = pairs[0];
    const pairCards = allCards.filter(c => c.rank == pairRank).sort((a,b) => a.suit.localeCompare(b.suit));
    const kickers = allCards.filter(c => c.rank != pairRank).sort((a,b) => b.rank - a.rank || a.suit.localeCompare(b.suit)).slice(0,3);
    return [...pairCards, ...kickers.slice(0,3)];
  }
  return null;
}

function evaluateHand() {
  let allCards;
  if (arguments.length === 1) {
    const sevenCards = arguments[0];
    if (sevenCards.length !== 7) throw new Error('Must have exactly 7 cards');
    allCards = sevenCards.map(parseCard);
  } else {
    const [board, holeCards] = arguments;
    if (board.length !== 5) throw new Error('Board must have exactly 5 cards');
    if (holeCards.length !== 2) throw new Error('Hole cards must have exactly 2 cards');
    allCards = [...board, ...holeCards].map(parseCard);
  }
  const seen = new Set();
  for (let c of allCards) {
    const key = c.rank + c.suit;
    if (seen.has(key)) throw new Error('Duplicate cards');
    seen.add(key);
  }
  let result = findStraightFlush(allCards);
  if (result) return { category: 'Straight flush', chosen5: result.map(cardStr) };
  result = findFourOfAKind(allCards);
  if (result) return { category: 'Four of a kind', chosen5: result.map(cardStr) };
  result = findFullHouse(allCards);
  if (result) return { category: 'Full house', chosen5: result.map(cardStr) };
  result = findFlush(allCards);
  if (result) return { category: 'Flush', chosen5: result.map(cardStr) };
  result = findStraight(allCards);
  if (result) return { category: 'Straight', chosen5: result.map(cardStr) };
  result = findThreeOfAKind(allCards);
  if (result) return { category: 'Three of a kind', chosen5: result.map(cardStr) };
  result = findTwoPair(allCards);
  if (result) return { category: 'Two pair', chosen5: result.map(cardStr) };
  result = findOnePair(allCards);
  if (result) return { category: 'One pair', chosen5: result.map(cardStr) };
  allCards.sort((a,b) => b.rank - a.rank || a.suit.localeCompare(b.suit));
  return { category: 'High card', chosen5: allCards.slice(0,5).map(cardStr) };
}

module.exports = { evaluateHand };