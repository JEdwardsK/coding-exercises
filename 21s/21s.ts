/*
Can you beat the dealer at 21
======================================

#### Model the game
* create a single deck of playing cards
* two players (called Sam and the Dealer) who will play against each other
* each player is given two cards from the top of a shuffled deck of cards

#### Rules to implement
* determine score of a hand[1]
* check if either player has blackjack (21) with their initial hand and wins the game
* if neither player has blackjack then Sam can start drawing cards from the top of the deck
* Sam should stop drawing cards from the deck if their total reaches 17 or higher
* Sam has lost the game if their total is higher than 21
* when Sam has stopped drawing cards the Dealer can start drawing cards from the top of the deck
* the Dealer should stop drawing cards when their total is higher than Sam.
* the Dealer has lost the game if their total is higher than 21
* determine which player wins the game

[1] Numbered cards are their point value. Jack, Queen and King count as 10 and Ace counts as 11.
*/


const createDeck = (suits: Array<string>): Array<string> => {
  const deck = []
  const values = [
    'Ace', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    'Jack', 'Queen', 'King'
  ]
  suits.forEach(suit => {
    const suitMap = values.map(card => `${card} of ${suit}`)
    deck.push(suitMap)
  })
  return deck.flat()
}

const cardDeck = createDeck(['Spades', 'Hearts', 'Clubs', 'Diamonds'])

interface ScoreRecord {
  wins: number;
  draws: number;
  losses: number
}
class Player {
  name: string;
  cards: string[];
  scoreCount: number;
  gameRecord: ScoreRecord
  constructor(name) {
    this.name = name
    this.cards = [],
    this.scoreCount = 0,
    this.gameRecord = {
      wins: 0,
      draws: 0,
      losses: 0
    }
  }
}

const dealer = new Player('Dealer')
const sam = new Player('Sam')

/*
* shuffle deck
* draw card from top of deck
* player, dealer, player, dealer
tally score - check for blackJack
if no black jack, sam draws until score is 17 or higher
if no bust, dealer draws until higher than sam. if
*/

const playRound = () => {

  const shuffleDeck = (deck: string[]) => {
    const shuffleDeck = []
    while (deck.length > 0) {
      const randomIndex = Math.round(Math.random() * (deck.length - 1))
      const randomCard = deck[randomIndex]
      deck.splice(randomIndex, 1)
      shuffleDeck.push(randomCard)
    }
    return shuffleDeck
  }
  const cardValue = (card: string) => {
    const cardName = card.split(' ')[0]
    const faceCards = ['Jack', 'Queen', 'King']
    if (faceCards.includes(cardName)) return 10
    else if (cardName === 'Ace') return 11
    else return Number(cardName)

  }
  const drawCard = (deck: string[], player: Player) => {
    console.log(`${player.name} draws ${deck[0]}`)
    player.cards.push(deck[0])
    player.scoreCount += cardValue(deck[0])
    deck.shift()
  }
  const dealCards = (player: Player) => {
    if (player.name === 'Sam') {
      if (player.scoreCount >= 17) {
        console.log(`Sam holds with ${player.scoreCount} and cards ${player.cards}`)
        console.log('Sam\'s cards', player.cards)
      } else {
        while (player.scoreCount < 17) {
          drawCard(newDeck, sam)
          console.log('sam\'s cards', sam.cards)
        }
        if (player.scoreCount > 21) {
          console.log('Sam goes bust!')
          console.log('Sam\'s cards', player.cards)
        } else if (player.scoreCount === 21) {
          console.log('Sam gets 21')
          console.log('Sam\'s cards', player.cards)
        } else {
          console.log(`Sam's final score is ${player.scoreCount}`)
          console.log('Sam\'s cards', player.cards)
        }
      }
    } else if (player.name === 'Dealer') {
      if (player.scoreCount >= sam.scoreCount) console.log(`Dealer holds with ${player.scoreCount} and cards ${player.cards}`)
      else {
        while (player.scoreCount < sam.scoreCount) {
          drawCard(newDeck, dealer)
          console.log('Dealer\'s cards', dealer.cards)
        }
        if (player.scoreCount > 21) {
          console.log('Dealer goes bust!')
          console.log('Dealer\'s cards', dealer.cards)
        } else if (player.scoreCount === 21) {
          console.log('Dealer gets 21')
          console.log('Dealer\'s cards', dealer.cards)
        } else {
          console.log(`Dealer's final score is ${player.scoreCount}`)
          console.log('Dealer\'s cards', dealer.cards)
        }
      }
    }
  }

  const newDeck = shuffleDeck(cardDeck)
  console.log('---------FIRST DRAWS----------')
  drawCard(newDeck, sam)
  drawCard(newDeck, dealer)
  drawCard(newDeck, sam)
  drawCard(newDeck, dealer)
  // blackjack check
  console.log('sam\'s cards', sam.cards)
  console.log('dealer\'s cards', dealer.cards)

  if (sam.scoreCount === 21) {
    console.log('Blackjack!, Sam wins!')
    return
  }
  if (dealer.scoreCount === 21) {
    console.log('Blackjack!, Dealer wins!')
    return
  }

  console.log('---------SAM\'S TURN----------')
  dealCards(sam)
  if (sam.scoreCount < 21) {
    console.log('---------DEALER\'S TURN----------')
    dealCards(dealer)
  }
  console.log('---------WINNER DECLARATION----------')
  const isSamBust = sam.scoreCount > 21
  const isDealerBust = dealer.scoreCount > 21

  if (isDealerBust || (sam.scoreCount > dealer.scoreCount)) {
    console.log('Sam wins!')
    sam.gameRecord.wins++
    dealer.gameRecord.losses++
    console.log('Sam\'s game record', sam.gameRecord)
  } else if (isSamBust || (sam.scoreCount < dealer.scoreCount)) {
    console.log('Sam loses!')
    dealer.gameRecord.wins++
    sam.gameRecord.losses++
    console.log('Sam\'s game record', sam.gameRecord)
  } else if (sam.scoreCount === dealer.scoreCount) {
    console.log('Sam draws!')
    sam.gameRecord.draws++
    dealer.gameRecord.draws++
    console.log('Sam\'s game record', sam.gameRecord)
  }
}

playRound()