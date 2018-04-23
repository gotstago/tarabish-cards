
import getFontSize from '../fontSize'

var fontSize
var west

export default {
  deck: function (deck) {
    //assign deck a new function after queueing
    fontSize = getFontSize()
    deck.tarabish = deck.queued(tarabish)
    west = { 
      begOne: -6, 
      endOne: -3, 
      side: 'back' ,
      getY: function(idx, fs){
        return Math.round((idx - 1.05) * 20 * fs / 16);
      },
      getX: function(idx, fs){
       return Math.round(-150 * fs / 16);
      },

  }
    function tarabish(next, dealer) {
      var cards = deck.cards
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
      console.log(`Dealer is ${dealer}`)
      //deck.dealBidCards(-3,cards.length)
      deck.dealBidCards(west)
      next()
    }
    deck.dealBidCards = deck.queued(dealBidCards)

    function dealBidCards(next, pos) {
      var cards = deck.cards
      var len = cards.length

      fontSize = getFontSize()

      cards.slice(pos.begOne, pos.endOne).reverse().forEach(function (card, i) {
        card.dealBidCards(pos, i, len, function (i) {
          card.setSide(pos.side)
          if (i === 2) {
            next()
          }
        })
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

    card.dealBidCards = function (pos, i, len, cb) {
      var delay = i * 250

      card.animateTo({
        delay: delay,
        duration: 250,

        y: pos.getY(i,fontSize),//Math.round((i - 1.05) * 20 * fontSize / 16),
        x: pos.getX(i,fontSize),//Math.round(-150 * fontSize / 16),
        rot: 90,

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
