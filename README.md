# Texas Hold'em Evaluator

## Projet Description

Evaluates and compares Texas Hold’em hands using:

* 5 community cards
* 2 hole cards per player

Returns the best 5-card hands, its category, and the winner.


## TDD Approach

* Tests written first
* Incremental implementation
* Safe refactoring



## Run Tests

npm install
npm test


## API

### evaluateHand(board, holeCards)

{
  category: 'Straight',
  chosen5: ['5C', '4S', '3H', '2D', 'AC']
}

### comparePlayers(board, players)

{
  winners: ['p1'],
  results: [...]
}


## Rules

Standard poker ranking (Straight Flush → High Card).
Supports tie-breaks and split pots.

---

## Reference

https://en.wikipedia.org/wiki/List_of_poker_hands
