
import getFontSize from '../fontSize'

var fontSize
var west
var positions
var cards

export default {
  deck: function (deck) {
    //assign deck a new function after queueing
    fontSize = getFontSize()
    cards = deck.cards
    var len = cards.length
    console.log(`cards length is ${len}`)
    positions = {
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
    // x: Math.round((i - 1.05) * 20 * fontSize / 16),
    // y: Math.round(-110 * fontSize / 16),

    deck.tarabish = deck.queued(tarabish)

    function tarabish(next, dealer) {
      //var cards = deck.cards
      // var len = cards.length

      // fontSize = getFontSize()

      // cards.slice(-9).reverse().forEach(function (card, i) {
      //   card.south(i, len, function (i) {
      //     card.setSide('front')
      //     if (i === 8) {
      //       next()
      //     }
      //   })
      // })
      // dealSouthBidCards()
      var myArry = ["west", "north", "east", "south"];
      var offset = Math.floor(Math.random() * 4); //3;
      var dealer = myArry[offset]
      var pointer
      console.log(`dealer is ${dealer}`)
      for (var i = 0; i < myArry.length; i++) {
        pointer = (i + offset + 1) % myArry.length;
        console.log(myArry[pointer]);
      }

      console.log(`Dealer is ${dealer} and position is ${positions.west}`)
      printMessage(`Dealer is ${dealer} and position is ${positions.west}`)
      //deck.dealBidCards(-3,cards.length)
      // dealBidCards(positions.west)

      // next()
      Promise.resolve(positions[myArry[pointer]]).then(function (result) {
        return dealBidCards(result);
      })
        .then(function (nextPos) {
          return dealBidCards(positions[nextPos]);
        })
        .then(function (nextPos) {
          return dealBidCards(positions[nextPos]);
        })
        .then(function (nextPos) {
          return dealBidCards(positions[nextPos]);
        })
        .then(function (finalResult) {
          console.log('Got the final result: ' + finalResult);
          next()
        })
        .catch(function (err) { 
          console.log('Got an error : ' + err);
      });
    }
    // deck.dealBidCards = deck.queued(dealBidCards)
    function dealBidCards(pos) {
      console.log('begin dealBidCards...')
      return new Promise(function (resolve, reject) {      //var cards = deck.cards
        var len = cards.length

        fontSize = getFontSize()
        // deck.southCards = deck.southCards || [];
        // deck.southCards.concat(cards.slice(beg, end))
        cards.slice(pos.begOne, pos.endOne).reverse().forEach(function (card, i) {
          //console.log(`card is${card}`);
          card.dealBidCard(pos, i, len, function (i) {
            card.setSide(pos.side)
            if (i === 2) {
              //next()
              resolve(pos.nextPosition)
            }
          })
        })
      });
    }

    function dealBidCardsOld(pos) {
      //var cards = deck.cards
      var len = cards.length

      fontSize = getFontSize()
      // Promise.resolve(cards).then(function (result) {
      //   return Promise.all(result.map(function (card, i) {
      //     return Promise.resolve(card.dealBidCard(pos, i, len).then(Promise.resolve(function (i) {
      //       card.setSide(pos.side)
      //       if (i === 2) {
      //         // next()
      //         console.log('returning from callback')
      //         //return Promise.resolve(i);
      //       }

      //     })))
      //   }));
      // }).then(function (arrayOfResults) {
      //   // All docs have really been removed() now!
      //   console.log(`result here...${arrayOfResults}`)
      // });
      var cb = function (i, card) {
        return new Promise(function (resolve, reject) {
          card.setSide(pos.side)
          if (i === 2) {
            // next()
            console.log('returning from callback')
            resolve(i)
          }
        });
      }
      var failureCallback = function (err) {
        console.log(`finished...error is ${err}`)
      }
      cards.slice(pos.begOne, pos.endOne).reverse().forEach(function (card, i) {
        const deal = (pos, i, len) => new Promise(resolve => card.dealBidCard(pos, i, len, resolve));
        deal(pos, i, len)
          .then(() => cb(i, card))
          .catch(failureCallback);
        //card.dealBidCard(pos, i, len, cb)
      })
    }

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

    card.dealBidCard = function (pos, i, len, cb) {
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
          cb(i)
        }
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
