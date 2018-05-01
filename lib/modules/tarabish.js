
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
    game = {
      dealer: 'south',
      currentPosition: 'west',
      nextPlayer: function () {
        var current = game.currentPosition
        var next = game[current].nextPosition
        game.currentPosition = next
        return next
      },
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

    var myGame = function () {

      // set up closure scope
      // var state = 1;
      var dealerPosition// = 'south';
      var currentPosition// = 'west';
      const playerPositions = ["west", "north", "east", "south"];
      var dealCount = 0
      // return object with methods to manipulate closure scope
      return {
        // deal: function (amount, repeat = 1) {
        //   printMessage(`dealing ${amount} cards ${repeat} times.`)
        // },
        // decr: function () {
        //   state--;
        // },
        // setDealer: function (d) {
        //   dealer = d;
        // },
        getDealer: function () {
          return playerPositions[dealerPosition];
        },
        getCurrentPosition: function () {
          return currentPosition;
        },
        start: function (params) {
          return chooseDealer()
            .then(data => {
              return deal(3, 2)
            })
            .then(data => {
              return 'finished game'
            })
        }
      };
      function deal(amount, repeat = 1) {
        return new Promise(function (resolve, reject) {
          var cardCount = amount * repeat
          var len = cards.length
          console.log(`dealing ${amount} cards ${repeat} times from deck of ${len}.`)
          resolve()
        })
      }
      function chooseDealer(gameState) {
        return new Promise(function (resolve, reject) {

          var offset = Math.floor(Math.random() * 4);
          dealerPosition = offset
          // var pointer
          console.log(`dealer is ${playerPositions[dealerPosition]}`)
          //for (var i = 0; i < playerPositions.length; i++) {
          currentPosition = (offset + 1) % playerPositions.length;
          console.log(`first to bid is ${playerPositions[currentPosition]}`)
          //   console.log(playerPositions[pointer]);
          // }
          //gameState.dealer = dealer
          //gameState.currentPosition = gameState[dealer].nextPosition
          resolve()
        })
      }

    }();

    // x: Math.round((i - 1.05) * 20 * fontSize / 16),
    // y: Math.round(-110 * fontSize / 16),

    deck.tarabish = deck.queued(tarabish)

    function tarabish(next, dealer) {


      var rounds = [[-3, cards.length], [-6, -3], [-9, -6], [-12, -9]]
      // var fn = function asyncSetParams(params) {
      //   game[game.currentPosition].begOne = params[0]
      //   game[game.currentPosition].endOne = params[1]
      //   //return function (game) {
      //   return dealBidCards(game);
      //   //}
      // }
      // var actions = rounds.map(fn)

      // var results = Promise.all(actions)

      // results.then(data => // or just .then(console.log)
      //   console.log(`data is ${data}`) // [2, 4, 6, 8, 10]
      // );

      //rounds.map(dealBidCards)
      var chain// = myGame.start()// = Promise.resolve()
      // for (var i = 0; i < 4; i++) {
      //   game[game.currentPosition].begOne = rounds[i][0]
      //   game[game.currentPosition].endOne = rounds[i][1]
      //   chain = chain.then(function (gameState) {
      //     return dealBidCards(gameState);
      //   });
      // }
      myGame.start()
        .then(function (gameState) {
          console.log('Got the final result: ' + gameState);
          next()
        })
      //   .catch(function (err) {
      //     console.log('Got an error : ' + err);
      //   });
      // console.log(`game is ${game}`)
      // chooseDealer(game)
      //   .then(function () {
      //     return Promise.all(actions)
      //   })
      //   .then(function (gameState) {
      //     return dealBidCards(gameState);
      //   })
      //   // .then(function (gameState) {
      //   //   return dealBidCards(gameState);
      //   // })
      //   // .then(function (gameState) {
      //   //   return dealBidCards(gameState);
      //   // })
      //   // .then(function (gameState) {
      //   //   return dealBidCards(gameState);
      //   // })
      //   .then(function (gameState) {
      //     console.log('Got the final result: ' + gameState);
      //     next()
      //   })
      //   .catch(function (err) {
      //     console.log('Got an error : ' + err);
      //   });
    }
    // deck.dealBidCards = deck.queued(dealBidCards)
    function dealBidCards(gameState) {
      return new Promise(function (resolve, reject) {
        var pos = gameState[gameState.currentPosition]
        console.log('begin dealBidCards...')
        // console.log(`pos is ${pos}`)
        //var cards = deck.cards
        var len = cards.length

        fontSize = getFontSize()
        // deck.southCards = deck.southCards || [];
        // deck.southCards.concat(cards.slice(beg, end))
        console.log(`pos.begOne is ${pos.begOne} and pos.endOne is ${pos.endOne}`)
        cards.slice(pos.begOne, pos.endOne).reverse().forEach(function (card, i) {
          //console.log(`card is${card}`);
          card.dealBidCard(pos, i, len)
            .then(function () {//dealBidCard returns a promise
              card.setSide(pos.side)
              if (i === 2) {
                //next()
                gameState.nextPlayer()
                resolve(gameState)
              }
            })
        })
      });
    }
    var myStatefulObj = function () {

      // set up closure scope
      var state = 1;

      // return object with methods to manipulate closure scope
      return {
        incr: function () {
          state++;
        },
        decr: function () {
          state--;
        },
        get: function () {
          return state;
        }
      };

    }();

    myStatefulObj.incr();
    var currState = myStatefulObj.get();  // currState === 2
    console.log(`currState is ${currState}`)
    myStatefulObj.decr();
    currState = myStatefulObj.get();  // currState === 1
    // function dealBidCardsOld(pos) {
    //   //var cards = deck.cards
    //   var len = cards.length

    //   fontSize = getFontSize()
    //   // Promise.resolve(cards).then(function (result) {
    //   //   return Promise.all(result.map(function (card, i) {
    //   //     return Promise.resolve(card.dealBidCard(pos, i, len).then(Promise.resolve(function (i) {
    //   //       card.setSide(pos.side)
    //   //       if (i === 2) {
    //   //         // next()
    //   //         console.log('returning from callback')
    //   //         //return Promise.resolve(i);
    //   //       }

    //   //     })))
    //   //   }));
    //   // }).then(function (arrayOfResults) {
    //   //   // All docs have really been removed() now!
    //   //   console.log(`result here...${arrayOfResults}`)
    //   // });
    //   var cb = function (i, card) {
    //     return new Promise(function (resolve, reject) {
    //       card.setSide(pos.side)
    //       if (i === 2) {
    //         // next()
    //         console.log('returning from callback')
    //         resolve(i)
    //       }
    //     });
    //   }
    //   var failureCallback = function (err) {
    //     console.log(`finished...error is ${err}`)
    //   }
    //   cards.slice(pos.begOne, pos.endOne).reverse().forEach(function (card, i) {
    //     const deal = (pos, i, len) => new Promise(resolve => card.dealBidCard(pos, i, len, resolve));
    //     deal(pos, i, len)
    //       .then(() => cb(i, card))
    //       .catch(failureCallback);
    //     //card.dealBidCard(pos, i, len, cb)
    //   })
    // }

    deck.test = deck.queued(test)

    function test(next, dealer) {
      console.log(`test is ${dealer}`)
      next()
    }

    deck.dealNorthBidCards = deck.queued(dealNorthBidCards)

    function dealNorthBidCards(next, beg, end) {
      var cards = deck.cards
      var len = cards.length

      fontSize = getFontSize()
      // deck.southCards = deck.southCards || [];
      // deck.southCards.concat(cards.slice(beg, end))
      cards.slice(beg, end).reverse().forEach(function (card, i) {
        //console.log(`card is${card}`);
        card.north(i, len, function (i) {
          card.setSide('back')
          if (i === 2) {
            next()
          }
        })
      })
    }
    deck.dealSouthBidCards = deck.queued(dealSouthBidCards)

    function dealSouthBidCards(next, beg, end) {
      var cards = deck.cards
      var len = cards.length

      fontSize = getFontSize()
      // deck.southCards = deck.southCards || [];
      // deck.southCards.concat(cards.slice(beg, end))
      cards.slice(beg, end).reverse().forEach(function (card, i) {
        //console.log(`card is${card}`);
        card.south(i, len, function (i) {
          card.setSide('front')
          if (i === 2) {
            next()
          }
        })
      })
    }
    deck.dealWestBidCards = deck.queued(dealWestBidCards)

    function dealWestBidCards(next, beg, end) {
      var cards = deck.cards
      var len = cards.length

      fontSize = getFontSize()

      cards.slice(beg, end).reverse().forEach(function (card, i) {
        card.west(i, len, function (i) {
          card.setSide('back')
          if (i === 2) {
            next()
          }
        })
      })
    }
    deck.dealEastBidCards = deck.queued(dealEastBidCards)

    function dealEastBidCards(next, beg, end) {
      var cards = deck.cards
      var len = cards.length

      fontSize = getFontSize()

      cards.slice(beg, end).reverse().forEach(function (card, i) {
        card.east(i, len, function (i) {
          card.setSide('back')
          if (i === 2) {
            next()
          }
        })
      })
    }
  },
  card: function (card) {
    var $el = card.$el

    card.dealBidCard = function (pos, i, len) {
      return new Promise(function (resolve, reject) {
        var delay = i * 250
        card.animateTo({
          delay: delay,
          duration: 250,

          y: pos.getY(i, fontSize),//Math.round((i - 1.05) * 20 * fontSize / 16),
          x: pos.getX(i, fontSize),//Math.round(-150 * fontSize / 16),
          rot: pos.rot,
          onStart: function () {
            $el.style.zIndex = (len - 1) + i
          },
          onComplete: function () {
            //cb(i)
            resolve()
          }
        })
      })
    }
    card.south = function (i, len, cb) {
      var delay = i * 250

      card.animateTo({
        delay: delay,
        duration: 250,

        x: Math.round((i - 1.05) * 20 * fontSize / 16),
        y: Math.round(110 * fontSize / 16),
        rot: 0,

        onStart: function () {
          $el.style.zIndex = (len - 1) + i
        },
        onComplete: function () {
          cb(i)
        }
      })
    }
    card.north = function (i, len, cb) {
      var delay = i * 250

      card.animateTo({
        delay: delay,
        duration: 250,

        x: Math.round((i - 1.05) * 20 * fontSize / 16),
        y: Math.round(-110 * fontSize / 16),
        rot: 0,

        onStart: function () {
          $el.style.zIndex = (len - 1) + i
        },
        onComplete: function () {
          cb(i)
        }
      })
    }
    card.west = function (i, len, cb) {
      var delay = i * 250

      card.animateTo({
        delay: delay,
        duration: 250,

        y: Math.round((i - 1.05) * 20 * fontSize / 16),
        x: Math.round(-150 * fontSize / 16),
        rot: 90,

        onStart: function () {
          $el.style.zIndex = (len - 1) + i
        },
        onComplete: function () {
          cb(i)
        }
      })
    }
    card.east = function (i, len, cb) {
      var delay = i * 250

      card.animateTo({
        delay: delay,
        duration: 250,

        y: Math.round((i - 1.05) * 20 * fontSize / 16),
        x: Math.round(150 * fontSize / 16),
        rot: 90,

        onStart: function () {
          $el.style.zIndex = (len - 1) + i
        },
        onComplete: function () {
          cb(i)
        }
      })
    }
  }
}
