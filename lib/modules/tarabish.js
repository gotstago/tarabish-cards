
import getFontSize from '../fontSize'

var fontSize
var west
var game
var cards

export default {
  deck: function (deck) {
    //assign deck a new function after queueing
    fontSize = getFontSize()
    cards = deck.cards
    var len = cards.length
    console.log(`cards length is ${len}`)

    var myGame = function () {

      // set up closure scope
      // var state = 1;
      var dealerPosition// = 'south';
      let currentPosition// = 'west';
      const playerPositions = ["west", "north", "east", "south"];
      const suits = ['spades', 'hearts', 'clubs', 'diamonds']
      const cardSuits = []
      const cardValues = {
        "1": {
          "nonTrump": 11,
          "trump": 11
        },
        "6": {
          "nonTrump": 0,
          "trump": 0
        },
        "7": {
          "nonTrump": 0,
          "trump": 0
        },
        "8": {
          "nonTrump": 0,
          "trump": 0
        },
        "9": {
          "nonTrump": 0,
          "trump": 14
        },
        "10": {
          "nonTrump": 10,
          "trump": 10
        },
        "11": {
          "nonTrump": 2,
          "trump": 20
        },
        "12": {
          "nonTrump": 3,
          "trump": 3
        },
        "13": {
          "nonTrump": 4,
          "trump": 4
        },
      }
      var dealCount = 0//cards.length
      var testMode

      // return object with methods to manipulate closure scope
      var positions = {
        west: {
          begOne: -6,
          endOne: -3,
          side: 'back',
          getY: function (idx, fs) {
            return Math.round((idx - 1.95) * 10 * fs / 16);
          },
          getX: function (idx, fs) {
            return Math.round(-130 * fs / 16);
          },
          nextPosition: 'north',
          rot: 90,
          cards: new Array(),
        },
        north: {
          begOne: -9,
          endOne: -6,
          side: 'back',
          getY: function (idx, fs) {
            return Math.round(-130 * fs / 16);
          },
          getX: function (idx, fs) {
            return Math.round((idx - 2.45) * 10 * fs / 16);
          },
          nextPosition: 'east',
          rot: 0,
          cards: new Array(),
        },
        east: {
          begOne: -12,
          endOne: -9,
          side: 'back',
          getY: function (idx, fs) {
            return Math.round((idx - 1.95) * 10 * fs / 16);
          },
          getX: function (idx, fs) {
            return Math.round(130 * fs / 16);
          },
          nextPosition: 'south',
          rot: 90,
          cards: new Array(),
        },
        south: {
          begOne: -15,
          endOne: -12,
          side: 'front',
          getY: function (idx, fs) {
            return Math.round(180 * fs / 16);
          },
          getX: function (idx, fs) {
            return Math.round((idx - 3.75) * 25 * fs / 16);
          },
          nextPosition: 'west',
          rot: 0,
          cards: new Array(),
        },
      }
      return {
        getDealer: function () {
          return playerPositions[dealerPosition];
        },
        getCurrent: function () {
          return playerPositions[currentPosition];
        },
        start: function (testing = false) {
          testMode = testing
          return chooseDealer()
            .then(data => {
              return deal(3, 4)
            })
            .then(data => {
              return deal(3, 4)
            })
            .then(data => {
              return acceptBids()
            })
            // .then(data => {
            //   console.log(`bid is ${data}`)
            //   return deal(3, 4)
            // })
            .then(data => {
              return 'finished game'
            })
        }
      };
      function acceptBids() {
        // return Promise.resolve(printBidChoices(''));
        // return new Promise(function (resolve, reject) {
        //   console.log(`first to bid is ${playerPositions[currentPosition]}`)
        //   console.log(`dealer is ${playerPositions[dealerPosition]}`)
        //   if (playerPositions[currentPosition] === 'south') {
        //     var messagebar = displayBidChoices('');
        //     /**
        //      * start bidding at current position
        //      * if player is computer, bid in a naive way
        //      * else display bid choices
        //      */
        //     messagebar.addEventListener("click", function () {
        //       messagebar.hidden = true;
        //       resolve();
        //       // document.body.removeChild(bidDiv)
        //     })
        //   } else {
        //     automaticBid(playerPositions[currentPosition])
        //       .then(data => {
        //         console.log(`bid is ${data}`)
        //         return resolve(data)
        //       })
        //   }
        // })
        return automaticBid(playerPositions[currentPosition])
          .then(handler)
          .then(handler)
          .then(handler)
          .catch(function (data) {
            console.log(`bid is resolved`)
            return Promise.resolve(data)
          })
      }
      function handler(data) {
        console.log(`bid is ${playerPositions[currentPosition]}, ${data}`)
        currentPosition = (currentPosition + 1) % 4
        if (data === 'pass') {
          console.log(`bid is not resolved`)
          return automaticBid(playerPositions[currentPosition])
        } else {
          return Promise.reject(data)
        }
      }
      function automaticBid(playerPosition) {
        return new Promise(function (resolve, reject) {
          var position = positions[playerPosition]
          position.cards.forEach(card => {
            console.log(`card is ${card.rank} of ${card.suit}`)
          });
          var bid = evaluateCards(position.cards)

          return resolve(bid)
        })
      }
      function evaluateCards(hand) {
        const trumpReducer = (accumulator, currentValue) => accumulator + cardValues[currentValue.rank.toString()].trump;
        const nonTrumpReducer = (accumulator, currentValue) => accumulator + cardValues[currentValue.rank.toString()].nonTrump;
        const scenarios = [0, 1, 2, 3].map(function (currentTrump) {
          // return {
          return [
            hand.filter((c) => c.suit === 0),
            hand.filter((c) => c.suit === 1),
            hand.filter((c) => c.suit === 2),
            hand.filter((c) => c.suit === 3),
          ].map(function (val) {
            return val.reduce(function (prev, curr, index) {
              if (curr.suit === currentTrump) {
                return prev + cardValues[curr.rank.toString()].trump
              } else {
                return prev + cardValues[curr.rank.toString()].nonTrump
              }
            }, 0)
          })
            .reduce(function (prev, curr) {
              return prev + curr
            }, 0)
          // currentTrump:currentTrump,
          // pointTotal:calculateTotals(hand,currentTrump)
          // }
        })
        var indexOfMaxValue = scenarios.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
        console.log(scenarios)
        console.log(indexOfMaxValue)//Math.max( ...scenarios )
        if (scenarios[indexOfMaxValue] > 34) {
          return suits[indexOfMaxValue]
        } else {
          return 'pass'
        }
        //return scenarios[indexOfMaxValue]
        // var spadeList = hand.filter(function (c) {
        //   //console.log(`suit is ${c.suit}`)
        //   return c.suit === 0
        // })
        // console.log(`spadeList has a trump value of ${spadeList.reduce(trumpReducer, 0)}`)
        // console.log(`spadeList has a non-trump value of ${spadeList.reduce(nonTrumpReducer, 0)}`)
        // var heartList = hand.filter(function (c) {
        //   //console.log(`suit is ${c.suit}`)
        //   return c.suit === 1
        // })
        // console.log(`heartList is ${heartList}`)
        // var clubList = hand.filter(function (c) {
        //   //console.log(`suit is ${c.suit}`)
        //   return c.suit === 2
        // })
        // console.log(`clubList is ${clubList}`)
        // var diamondList = hand.filter(function (c) {
        //   //console.log(`suit is ${c.suit}`)
        //   return c.suit === 3
        // })
        // console.log(`diamondList is ${diamondList}`)
      }
      function calculateTotals(hand, trump) {
        var possibleTrumpScenarios = [
          hand.filter((c) => c.suit === 0),
          hand.filter((c) => c.suit === 1),
          hand.filter((c) => c.suit === 2),
          hand.filter((c) => c.suit === 3),
        ].map(function (val) {
          return val.reduce(function (prev, curr) {
            if (curr.suit === trump) {
              return prev + cardValues[curr.rank.toString()].trump
            } else {
              return prev + cardValues[curr.rank.toString()].nonTrump
            }
          }, 0)
        }).reduce(function (prev, curr) {
          return prev + curr
        }, 0)
        //trump.map(function (value) {
        return possibleTrumpScenarios
        //})
      }
      function deal(amount, repeat = 1) {
        //return new Promise(function (resolve, reject) {
        var cardCount = amount * repeat
        var len = cards.length
        let cardsToDeal = cards.slice(len - dealCount - cardCount, len - dealCount)//.reverse()
        //dealCount starts at 0, and we are beginning at the top of the deck
        //var beginning = 
        console.log(`dealing ${amount} cards ${repeat} times from deck of ${len}.`)
        console.log(`first to bid is ${playerPositions[currentPosition]}`)
        console.log(`dealer is ${playerPositions[dealerPosition]}`)
        // let pos = positions[playerPositions[currentPosition]]
        //let currentCard
        let chain = Promise.resolve()
        // (async function loop() {
        for (let repeatIndex = 0; repeatIndex < repeat; repeatIndex++) {//4
          for (let amountIndex = 0; amountIndex < amount; amountIndex++) {//3
            // let pos = positions[playerPositions[currentPosition]]
            let currentCard = cardsToDeal.pop()
            //console.log(`card is ${currentCard.rank} of ${currentCard.suit}`)
            console.log(`cardsToDeal are ${cardsToDeal.length}`);
            //let cp = currentPosition
            (function (cp) {
              chain = chain.then(function () {
                return dealBidCard(cp, currentCard, amountIndex)
              })
              // do your stuff here
              // use the index variable - it is assigned to the value of 'i'
              // that was passed in during the loop iteration.
            })(currentPosition);
          }
          currentPosition = (currentPosition + 1) % repeat
          console.log(`after incrementing, currentPosition is ${currentPosition}`)
        }
        //console.log(`cardsToDeal are ${cardsToDeal.length}`)
        return chain
      }
      function dealBidCard(cp, card, i) {
        return new Promise(function (resolve, reject) {
          //console.log(`deal card ${card} to ${position.nextPosition}`)
          let position = positions[playerPositions[cp]]
          console.log(`position is ${position.nextPosition}`)
          //debugger
          let handSize = position.cards.length
          console.log(`handSize is ${handSize}`)
          var delay = testMode ? 0 : 250;//0 //handSize * 250//i * 250
          var duration = testMode ? 25 : 250;
          var len = cards.length
          console.log(`currentPosition is ${cp}`)
          var currentY = position.getY(handSize, fontSize)
          var currentX = position.getX(handSize, fontSize)
          fontSize = getFontSize()
          console.log(`card is ${card.rank} of ${card.suit}, handSize is ${handSize}, 
            currentY is ${currentY} and currentX is ${currentX}`)
          card.animateTo({
            delay: delay,
            duration: duration,
            y: currentY,//Math.round((i - 1.05) * 20 * fontSize / 16),
            x: currentX,//Math.round(-150 * fontSize / 16),
            rot: position.rot,
            onStart: function () {
              card.$el.style.zIndex = (len - 1) + handSize
            },
            onComplete: function () {
              card.setSide(position.side)
              position.cards.push(card)
              dealCount++
              resolve()
            }
          })
        })
      }

      function chooseDealer(gameState) {
        return new Promise(function (resolve, reject) {
          var offset = Math.floor(Math.random() * 4);
          dealerPosition = offset
          currentPosition = (offset + 1) % playerPositions.length;
          resolve()
        })
      }

    }();

    deck.tarabish = deck.queued(tarabish)

    function tarabish(next, dealer) {
      var rounds = [[-3, cards.length], [-6, -3], [-9, -6], [-12, -9]]
      var chain
      myGame.start(true)
        .then(function (gameState) {
          console.log('Got the final result: ' + gameState);
          next()
        })
    }
    // deck.dealBidCards = deck.queued(dealBidCards)
    // function dealBidCards(gameState) {
    //   return new Promise(function (resolve, reject) {
    //     var pos = gameState[gameState.currentPosition]
    //     console.log('begin dealBidCards...')
    //     var len = cards.length

    //     fontSize = getFontSize()
    //     console.log(`pos.begOne is ${pos.begOne} and pos.endOne is ${pos.endOne}`)
    //     cards.slice(pos.begOne, pos.endOne).reverse().forEach(function (card, i) {
    //       card.dealBidCard(pos, i, len)
    //         .then(function () {//dealBidCard returns a promise
    //           card.setSide(pos.side)
    //           if (i === 2) {
    //             gameState.nextPlayer()
    //             resolve(gameState)
    //           }
    //         })
    //     })
    //   });
    // }

    deck.test = deck.queued(test)

    function test(next, dealer) {
      console.log(`test is ${dealer}`)
      next()
    }

  },
  card: function (card) {
    var $el = card.$el

    // card.dealBidCard = function (pos, i, len) {
    //   return new Promise(function (resolve, reject) {
    //     var delay = i * 250
    //     card.animateTo({
    //       delay: delay,
    //       duration: 250,

    //       y: pos.getY(i, fontSize),//Math.round((i - 1.05) * 20 * fontSize / 16),
    //       x: pos.getX(i, fontSize),//Math.round(-150 * fontSize / 16),
    //       rot: pos.rot,
    //       onStart: function () {
    //         $el.style.zIndex = (len - 1) + i
    //       },
    //       onComplete: function () {
    //         //cb(i)
    //         resolve()
    //       }
    //     })
    //   })
    // }
  }
}
