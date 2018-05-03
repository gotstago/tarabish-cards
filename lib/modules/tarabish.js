
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
      var dealCount = 0//cards.length
      // return object with methods to manipulate closure scope
      var positions = {
        west: {
          begOne: -6,
          endOne: -3,
          side: 'back',
          getY: function (idx, fs) {
            return Math.round((idx - 1.05) * 20 * fs / 16);
          },
          getX: function (idx, fs) {
            return Math.round(-150 * fs / 16);
          },
          nextPosition: 'north',
          rot: 90,
        },
        north: {
          begOne: -9,
          endOne: -6,
          side: 'back',
          getY: function (idx, fs) {
            return Math.round(-110 * fs / 16);
          },
          getX: function (idx, fs) {
            return Math.round((idx - 1.05) * 20 * fs / 16);
          },
          nextPosition: 'east',
          rot: 0,
        },
        east: {
          begOne: -12,
          endOne: -9,
          side: 'back',
          getY: function (idx, fs) {
            return Math.round((idx - 1.05) * 20 * fs / 16);
          },
          getX: function (idx, fs) {
            return Math.round(150 * fs / 16);
          },
          nextPosition: 'south',
          rot: 90,
        },
        south: {
          begOne: -15,
          endOne: -12,
          side: 'front',
          getY: function (idx, fs) {
            return Math.round(110 * fs / 16);
          },
          getX: function (idx, fs) {
            return Math.round((idx - 1.05) * 20 * fs / 16);
          },
          nextPosition: 'west',
          rot: 0,
        },
      }
      return {
        getDealer: function () {
          return playerPositions[dealerPosition];
        },
        getCurrent: function () {
          return playerPositions[currentPosition];
        },
        start: function (params) {
          return chooseDealer()
            .then(data => {
              return deal(3, 4)
            })
            .then(data => {
              return 'finished game'
            })
        }
      };
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
          var delay = i * 250
          var len = cards.length
          console.log(`currentPosition is ${cp}`)
          let position = positions[playerPositions[cp]]
          var currentY = position.getY(i, fontSize)
          var currentX = position.getX(i, fontSize)
          fontSize = getFontSize()
          console.log(`card is ${card.rank} of ${card.suit}, i is ${i}, 
            currentY is ${currentY} and currentX is ${currentX}`)
          card.animateTo({
            delay: delay,
            duration: 250,
            y: currentY,//Math.round((i - 1.05) * 20 * fontSize / 16),
            x: currentX,//Math.round(-150 * fontSize / 16),
            rot: position.rot,
            onStart: function () {
              card.$el.style.zIndex = (len - 1) + i
            },
            onComplete: function () {
              card.setSide(position.side)
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
      myGame.start()
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
