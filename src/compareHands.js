const { evaluateHand } = require('./handEvaluator');

function parseCard(cardStr) {
  const rankMap = {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'T':10,'J':11,'Q':12,'K':13,'A':14};
  const suitMap = {'C':'clubs','D':'diamonds','H':'hearts','S':'spades'};
  return { rank: rankMap[cardStr[0]], suit: suitMap[cardStr[1]] };
}

function compareHands(hand1, hand2) {
  const categories = ['Straight flush', 'Four of a kind', 'Full house', 'Flush', 'Straight', 'Three of a kind', 'Two pair', 'One pair', 'High card'];
  const catIndex1 = categories.indexOf(hand1.category);
  const catIndex2 = categories.indexOf(hand2.category);
  if (catIndex1 < catIndex2) return -1; // hand1 better
  if (catIndex1 > catIndex2) return 1;
  return tieBreak(hand1, hand2, hand1.category);
}

function tieBreak(hand1, hand2, category) {
  const cards1 = hand1.chosen5.map(parseCard);
  const cards2 = hand2.chosen5.map(parseCard);
  if (category === 'Straight' || category === 'Straight flush') {
    const high1 = Math.max(...cards1.map(c => c.rank === 14 && cards1.some(d => d.rank === 2) ? 1 : c.rank));
    const high2 = Math.max(...cards2.map(c => c.rank === 14 && cards2.some(d => d.rank === 2) ? 1 : c.rank));
    return high2 - high1;
  }
  if (category === 'Four of a kind') {
    const quadRank1 = cards1.find(c => cards1.filter(d => d.rank === c.rank).length === 4).rank;
    const quadRank2 = cards2.find(c => cards2.filter(d => d.rank === c.rank).length === 4).rank;
    if (quadRank1 !== quadRank2) return quadRank2 - quadRank1;
    const kicker1 = cards1.find(c => cards1.filter(d => d.rank === c.rank).length === 1).rank;
    const kicker2 = cards2.find(c => cards2.filter(d => d.rank === c.rank).length === 1).rank;
    return kicker2 - kicker1;
  }
  if (category === 'Full house') {
    const threeRank1 = cards1.find(c => cards1.filter(d => d.rank === c.rank).length === 3).rank;
    const threeRank2 = cards2.find(c => cards2.filter(d => d.rank === c.rank).length === 3).rank;
    if (threeRank1 !== threeRank2) return threeRank2 - threeRank1;
    const pairRank1 = cards1.find(c => cards1.filter(d => d.rank === c.rank).length === 2).rank;
    const pairRank2 = cards2.find(c => cards2.filter(d => d.rank === c.rank).length === 2).rank;
    return pairRank2 - pairRank1;
  }
  if (category === 'Flush') {
    for (let i = 0; i < 5; i++) {
      if (cards1[i].rank !== cards2[i].rank) return cards2[i].rank - cards1[i].rank;
    }
    return 0;
  }
  if (category === 'Three of a kind') {
    const tripRank1 = cards1.find(c => cards1.filter(d => d.rank === c.rank).length === 3).rank;
    const tripRank2 = cards2.find(c => cards2.filter(d => d.rank === c.rank).length === 3).rank;
    if (tripRank1 !== tripRank2) return tripRank2 - tripRank1;
    const kickers1 = cards1.filter(c => c.rank !== tripRank1).sort((a,b) => b.rank - a.rank);
    const kickers2 = cards2.filter(c => c.rank !== tripRank2).sort((a,b) => b.rank - a.rank);
    for (let i = 0; i < 2; i++) {
      if (kickers1[i].rank !== kickers2[i].rank) return kickers2[i].rank - kickers1[i].rank;
    }
    return 0;
  }
  if (category === 'Two pair') {
    const pairs1 = [...new Set(cards1.filter(c => cards1.filter(d => d.rank === c.rank).length === 2).map(c => c.rank))].sort((a,b) => b - a);
    const pairs2 = [...new Set(cards2.filter(c => cards2.filter(d => d.rank === c.rank).length === 2).map(c => c.rank))].sort((a,b) => b - a);
    if (pairs1[0] !== pairs2[0]) return pairs2[0] - pairs1[0];
    if (pairs1[1] !== pairs2[1]) return pairs2[1] - pairs1[1];
    const kicker1 = cards1.find(c => cards1.filter(d => d.rank === c.rank).length === 1).rank;
    const kicker2 = cards2.find(c => cards2.filter(d => d.rank === c.rank).length === 1).rank;
    return kicker2 - kicker1;
  }
  if (category === 'One pair') {
    const pairRank1 = cards1.find(c => cards1.filter(d => d.rank === c.rank).length === 2).rank;
    const pairRank2 = cards2.find(c => cards2.filter(d => d.rank === c.rank).length === 2).rank;
    if (pairRank1 !== pairRank2) return pairRank2 - pairRank1;
    const kickers1 = cards1.filter(c => c.rank !== pairRank1).sort((a,b) => b.rank - a.rank);
    const kickers2 = cards2.filter(c => c.rank !== pairRank2).sort((a,b) => b.rank - a.rank);
    for (let i = 0; i < 3; i++) {
      if (kickers1[i].rank !== kickers2[i].rank) return kickers2[i].rank - kickers1[i].rank;
    }
    return 0;
  }
  if (category === 'High card') {
    for (let i = 0; i < 5; i++) {
      if (cards1[i].rank !== cards2[i].rank) return cards2[i].rank - cards1[i].rank;
    }
    return 0;
  }
  return 0;
}

function comparePlayers(board, players) {
  const playerHands = players.map(p => evaluateHand(board, p.holeCards));
  const results = players.map((p, i) => ({
    playerId: p.playerId,
    category: playerHands[i].category,
    chosen5: playerHands[i].chosen5
  }));
  const winners = [];
  let bestHand = null;
  for (let i = 0; i < players.length; i++) {
    if (!bestHand) {
      bestHand = playerHands[i];
      winners.push(players[i].playerId);
    } else {
      const cmp = compareHands(bestHand, playerHands[i]);
      if (cmp > 0) {
        bestHand = playerHands[i];
        winners = [players[i].playerId];
      } else if (cmp === 0) {
        winners.push(players[i].playerId);
      }
    }
  }
  return { winners, results };
}

module.exports = { comparePlayers };