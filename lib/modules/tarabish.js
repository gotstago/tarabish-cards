
import getFontSize from '../fontSize'

var fontSize

export default {
  deck: function (deck) {
    //assign deck a new function after queueing
    // deck.dealBidCards = deck.queued(dealBidCards)

    // function dealBidCards() {
    //   // var cards = deck.cards
    //   // var len = cards.length

    //   // fontSize = getFontSize()

    //   // cards.slice(-9).reverse().forEach(function (card, i) {
    //   //   card.south(i, len, function (i) {
    //   //     card.setSide('front')
    //   //     if (i === 8) {
    //   //       next()
    //   //     }
    //   //   })
    //   // })
    //   dealSouthBidCards()
    // }

    deck.dealSouthBidCards = deck.queued(dealSouthBidCards)

    function dealSouthBidCards(next,beg,end) {
      var cards = deck.cards
      var len = cards.length

      fontSize = getFontSize()
      // deck.southCards = deck.southCards || [];
      // deck.southCards.concat(cards.slice(beg, end))
      cards.slice(beg, end).reverse().forEach(function (card, i) {
        console.log(`card is${card}`);
        card.south(i, len, function (i) {
          card.setSide('front')
          if (i === 2 ) {
            next()
          }
        })
      })
    }
    deck.dealWestBidCards = deck.queued(dealWestBidCards)

    function dealWestBidCards(next,beg,end) {
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
  },
  card: function (card) {
    var $el = card.$el

    card.south = function (i, len, cb) {
      var delay = i * 250

      card.animateTo({
        delay: delay,
        duration: 250,

        x: Math.round((i - 5.05) * 20 * fontSize / 16),
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
    card.west = function (i, len, cb) {
      var delay = i * 250

      card.animateTo({
        delay: delay,
        duration: 250,

        x: Math.round((i - 10.05) * 20 * fontSize / 16),
        y: Math.round(-210 * fontSize / 16),
        rot: 0,

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
