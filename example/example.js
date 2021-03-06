
/* global Deck */

var prefix = Deck.prefix

var transform = prefix('transform')

var translate = Deck.translate

var $container = document.getElementById('container')
var $topbar = document.getElementById('topbar')
var $messagebar = document.getElementById('messagebar')

var $sort = document.createElement('button')
var $shuffle = document.createElement('button')
var $bysuit = document.createElement('button')
var $fan = document.createElement('button')
var $poker = document.createElement('button')
var $tarabish = document.createElement('button')
var $flip = document.createElement('button')
var $easter = document.createElement('button')

$shuffle.textContent = 'Shuffle'
$sort.textContent = 'Sort'
$bysuit.textContent = 'By suit'
$fan.textContent = 'Fan'
$poker.textContent = 'Poker'
$tarabish.textContent = 'Tarabish'
$flip.textContent = 'Flip'
$easter.textContent = 'Easter'

$topbar.appendChild($flip)
$topbar.appendChild($shuffle)
$topbar.appendChild($bysuit)
$topbar.appendChild($fan)
$topbar.appendChild($poker)
$topbar.appendChild($tarabish)
$topbar.appendChild($sort)
// $topbar.appendChild($easter)

var deck = Deck()



$shuffle.addEventListener('click', function () {
  deck.shuffle()
  deck.shuffle()
})
$sort.addEventListener('click', function () {
  deck.sort()
})
$bysuit.addEventListener('click', function () {
  deck.sort(true) // sort reversed
  deck.bysuit()
})
$fan.addEventListener('click', function () {
  deck.fan()
})
$flip.addEventListener('click', function () {
  deck.flip()
})
$easter.addEventListener('click', function () {
  setTimeout(function () {
    startWinning()
  }, 250)
})
$poker.addEventListener('click', function () {
  deck.queue(function (next) {
    deck.cards.forEach(function (card, i) {
      setTimeout(function () {
        card.setSide('back')
      }, i * 7.5)
    })
    next()
  })
  deck.shuffle()
  deck.shuffle()
  deck.poker()
})

$tarabish.addEventListener('click', function playCards() {
  // Remove the 2,3,4,5 of each suit card from deck
  //$tarabish.removeEventListener('click', playCards)
  $tarabish.disabled = true;
  var cards = deck.cards
  var removedCards = cards.splice(8, 4);
  removedCards.forEach(function (removedCard) {
    removedCard.unmount();
  });
  removedCards = cards.splice(17, 4);
  removedCards.forEach(function (removedCard) {
    removedCard.unmount();
  });
  removedCards = cards.splice(26, 4);
  removedCards.forEach(function (removedCard) {
    removedCard.unmount();
  });
  removedCards = cards.splice(35, 4);
  removedCards.forEach(function (removedCard) {
    removedCard.unmount();
  });
  deck.queue(function (next) {
    cards.forEach(function (card, i) {//turn over all cards with a small delay between each
      setTimeout(function () {
        card.setSide('back')
      }, i * 7.5)
    })
    next()
  })
  deck.shuffle()
  deck.shuffle()
  //deck.tarabish();
  // var len = cards.length
  deck.tarabish(0)

  //console.log('here ...')
  deck.test(0)

  // deck.dealSouthBidCards(-3,cards.length)
  // deck.dealWestBidCards(-6, -3)
  // deck.dealNorthBidCards(-9,-6)
  // deck.dealEastBidCards(-12, -9)

})

deck.mount($container)

//deck.intro()
deck.sort()

// secret message..

var randomDelay = 10000 + 30000 * Math.random()

// setTimeout(function () {
//   printMessage('Psst..I want to share a secret with you...')
// }, randomDelay)

// setTimeout(function () {
//   printMessage('...try clicking all kings and nothing in between...')
// }, randomDelay + 5000)

// setTimeout(function () {
//   printMessage('...have fun ;)')
// }, randomDelay + 10000)

// function tarabish(i, len, cb) {
//   var delay = i * 250

//   card.animateTo({
//     delay: delay,
//     duration: 250,

//     x: Math.round((i - 2.05) * 70 * fontSize / 16),
//     y: Math.round(-110 * fontSize / 16),
//     rot: 0,

//     onStart: function () {
//       $el.style.zIndex = (len - 1) + i
//     },
//     onComplete: function () {
//       cb(i)
//     }
//   })
// }

function printMessage(text) {
  var animationFrames = Deck.animationFrames
  var ease = Deck.ease
  var $message = document.createElement('p')
  $message.classList.add('message')
  $message.textContent = text

  document.body.appendChild($message)

  $message.style[transform] = translate(window.innerWidth + 'px', 0)

  var diffX = window.innerWidth

  animationFrames(1000, 700)
    .progress(function (t) {
      t = ease.cubicInOut(t)
      $message.style[transform] = translate((diffX - diffX * t) + 'px', 0)
    })

  animationFrames(6000, 700)
    .start(function () {
      diffX = window.innerWidth
    })
    .progress(function (t) {
      t = ease.cubicInOut(t)
      $message.style[transform] = translate((-diffX * t) + 'px', 0)
    })
    .end(function () {
      document.body.removeChild($message)
    })
}
/*
<h1>Custom Radio Buttons</h1>
<label class="bid">One
  <input type="radio" checked="checked" name="radio">
  <span class="checkmark"></span>
</label>
<label class="bid">Two
  <input type="radio" name="radio">
  <span class="checkmark"></span>
</label>
<label class="bid">Three
  <input type="radio" name="radio">
  <span class="checkmark"></span>
</label>
<label class="bid">Four
  <input type="radio" name="radio">
  <span class="checkmark"></span>
</label>
*/
function displayBidChoices(text) {
  var animationFrames = Deck.animationFrames
  var ease = Deck.ease
  var $bidDiv = document.createElement('div')
  $bidDiv.appendChild(getSuit("\u2660"))
  $bidDiv.appendChild(getSuit("\u2663"))
  $bidDiv.appendChild(getSuit("\u2665"))
  $bidDiv.appendChild(getSuit("\u2666"))
  $bidDiv.appendChild(getSuit("Pass"))
  // $message.classList.add('message')
  // $message.textContent = text

  $messagebar.appendChild($bidDiv)
  $messagebar.hidden = false;
  $bidDiv.style[transform] = translate(window.innerWidth + 'px', 0)

  var diffX = window.innerWidth

  animationFrames(1000, 700)
    .progress(function (t) {
      t = ease.cubicInOut(t)
      $bidDiv.style[transform] = translate((diffX - diffX * t) + 'px', 0)
    })
  return $messagebar;
  // animationFrames(6000, 700)
  //   .start(function () {
  //     diffX = window.innerWidth
  //   })
  //   .progress(function (t) {
  //     t = ease.cubicInOut(t)
  //     $bidDiv.style[transform] = translate((diffX - diffX * t) + 'px', 0)
  //   })
  //   .end(function () {
  //     //$messagebar.removeChild($bidDiv)
  //   })
}
function getSuit(suit) {
  var label = document.createElement('label')
  var suitMap = {
    "\u2660": { "class": "spades", "color": "black" },
    "\u2663": { "class": "clubs", "color": "black" },
    "\u2665": { "class": "hearts", "color": "red" },
    "\u2666": { "class": "diamonds", "color": "red" },
    "Pass": { "class": "pass" },
  }
  label.classList.add("bid");
  var character = suitMap[suit].class
  //character.fontcolor(suitMap[suit].color)
  label.classList.add(character);
  //label.fontcolor(suitMap[suit].color)
  var input = document.createElement('input')
  input.setAttribute("type", "radio")
  input.setAttribute("name", "radio")
  var span = document.createElement('span')
  span.classList.add("checkmark")
  label.textContent = suit
  label.appendChild(input)
  label.appendChild(span)
  return label
}

// easter eggs start

// var acesClicked = []
// var kingsClicked = []

// deck.cards.forEach(function (card, i) {
//   // card.enableDragging()
//   // card.enableFlipping()

//   card.$el.addEventListener('mousedown', onTouch)
//   card.$el.addEventListener('touchstart', onTouch)

//   function onTouch() {
//     var card

//     if (i % 13 === 0) {
//       acesClicked[i] = true
//       if (acesClicked.filter(function (ace) {
//         return ace
//       }).length === 4) {
//         document.body.removeChild($topbar)
//         deck.$el.style.display = 'none'
//         setTimeout(function () {
//           startWinning()
//         }, 250)
//       }
//     } else if (i % 13 === 12) {
//       if (!kingsClicked) {
//         return
//       }
//       kingsClicked[i] = true
//       if (kingsClicked.filter(function (king) {
//         return king
//       }).length === 4) {
//         for (var j = 0; j < 3; j++) {
//           card = Deck.Card(52 + j)
//           card.mount(deck.$el)
//           card.$el.style[transform] = 'scale(0)'
//           card.setSide('front')
//           card.enableDragging()
//           card.enableFlipping()
//           deck.cards.push(card)
//         }
//         deck.sort(true)
//         kingsClicked = false
//       }
//     } else {
//       acesClicked = []
//       if (kingsClicked) {
//         kingsClicked = []
//       }
//     }
//   }
// })

// function startWinning() {
//   var $winningDeck = document.createElement('div')
//   $winningDeck.classList.add('deck')

//   $winningDeck.style[transform] = translate(Math.random() * window.innerWidth - window.innerWidth / 2 + 'px', Math.random() * window.innerHeight - window.innerHeight / 2 + 'px')

//   $container.appendChild($winningDeck)

//   var side = Math.floor(Math.random() * 2) ? 'front' : 'back'

//   for (var i = 0; i < 55; i++) {
//     addWinningCard($winningDeck, i, side)
//   }

//   setTimeout(startWinning, Math.round(Math.random() * 1000))
// }

// function addWinningCard($deck, i, side) {
//   var card = Deck.Card(54 - i)
//   var delay = (55 - i) * 20
//   var animationFrames = Deck.animationFrames
//   var ease = Deck.ease

//   card.enableFlipping()

//   if (side === 'front') {
//     card.setSide('front')
//   } else {
//     card.setSide('back')
//   }

//   card.mount($deck)
//   card.$el.style.display = 'none'

//   var xStart = 0
//   var yStart = 0
//   var xDiff = -500
//   var yDiff = 500

//   animationFrames(delay, 1000)
//     .start(function () {
//       card.x = 0
//       card.y = 0
//       card.$el.style.display = ''
//     })
//     .progress(function (t) {
//       var tx = t
//       var ty = ease.cubicIn(t)
//       card.x = xStart + xDiff * tx
//       card.y = yStart + yDiff * ty
//       card.$el.style[transform] = translate(card.x + 'px', card.y + 'px')
//     })
//     .end(function () {
//       card.unmount()
//     })
// }

// easter eggs end