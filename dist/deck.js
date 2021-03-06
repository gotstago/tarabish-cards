'use strict';

var Deck = (function () {
  'use strict';

  var ticking;
  var animations = [];

  function animationFrames(delay, duration) {
    var now = Date.now();

    // calculate animation start/end times
    var start = now + delay;
    var end = start + duration;

    var animation = {
      start: start,
      end: end
    };

    // add animation
    animations.push(animation);

    if (!ticking) {
      // start ticking
      ticking = true;
      requestAnimationFrame(tick);
    }
    var self = {
      start: function start(cb) {
        // add start callback (just one)
        animation.startcb = cb;
        return self;
      },
      progress: function progress(cb) {
        // add progress callback (just one)
        animation.progresscb = cb;
        return self;
      },
      end: function end(cb) {
        // add end callback (just one)
        animation.endcb = cb;
        return self;
      }
    };
    return self;
  }

  function tick() {
    var now = Date.now();

    if (!animations.length) {
      // stop ticking
      ticking = false;
      return;
    }

    for (var i = 0, animation; i < animations.length; i++) {
      animation = animations[i];
      if (now < animation.start) {
        // animation not yet started..
        continue;
      }
      if (!animation.started) {
        // animation starts
        animation.started = true;
        animation.startcb && animation.startcb();
      }
      // animation progress
      var t = (now - animation.start) / (animation.end - animation.start);
      animation.progresscb && animation.progresscb(t < 1 ? t : 1);
      if (now > animation.end) {
        // animation ended
        animation.endcb && animation.endcb();
        animations.splice(i--, 1);
        continue;
      }
    }
    requestAnimationFrame(tick);
  }

  // fallback
  window.requestAnimationFrame || (window.requestAnimationFrame = function (cb) {
    setTimeout(cb, 0);
  });

  var style = document.createElement('p').style;
  var memoized = {};

  function prefix(param) {
    if (typeof memoized[param] !== 'undefined') {
      return memoized[param];
    }

    if (typeof style[param] !== 'undefined') {
      memoized[param] = param;
      return param;
    }

    var camelCase = param[0].toUpperCase() + param.slice(1);
    var prefixes = ['webkit', 'moz', 'Moz', 'ms', 'o'];
    var test;

    for (var i = 0, len = prefixes.length; i < len; i++) {
      test = prefixes[i] + camelCase;
      if (typeof style[test] !== 'undefined') {
        memoized[param] = test;
        return test;
      }
    }
  }

  var has3d;

  function translate(a, b, c) {
    typeof has3d !== 'undefined' || (has3d = check3d());

    c = c || 0;

    if (has3d) {
      return 'translate3d(' + a + ', ' + b + ', ' + c + ')';
    } else {
      return 'translate(' + a + ', ' + b + ')';
    }
  }

  function check3d() {
    // I admit, this line is stealed from the great Velocity.js!
    // http://julian.com/research/velocity/
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!isMobile) {
      return false;
    }

    var transform = prefix('transform');
    var $p = document.createElement('p');

    document.body.appendChild($p);
    $p.style[transform] = 'translate3d(1px,1px,1px)';

    has3d = $p.style[transform];
    has3d = has3d != null && has3d.length && has3d !== 'none';

    document.body.removeChild($p);

    return has3d;
  }

  function createElement(type) {
    return document.createElement(type);
  }

  var maxZ = 52;

  function _card(i) {
    var transform = prefix('transform');

    // calculate rank/suit, etc..
    var rank = i % 13 + 1;
    var suit = i / 13 | 0;
    var z = (52 - i) / 4;

    // create elements
    var $el = createElement('div');
    var $face = createElement('div');
    var $back = createElement('div');

    // states
    var isDraggable = false;
    var isFlippable = false;

    // self = card
    var self = { i: i, rank: rank, suit: suit, pos: i, $el: $el, mount: mount, unmount: unmount, setSide: setSide };

    var modules = Deck.modules;
    var module;

    // add classes
    $face.classList.add('face');
    $back.classList.add('back');

    // add default transform
    $el.style[transform] = translate(-z + 'px', -z + 'px');

    // add default values
    self.x = -z;
    self.y = -z;
    self.z = z;
    self.rot = 0;

    // set default side to back
    self.setSide('back');

    // add drag/click listeners
    addListener($el, 'mousedown', onMousedown);
    addListener($el, 'touchstart', onMousedown);

    // load modules
    for (module in modules) {
      addModule(modules[module]);
    }

    self.animateTo = function (params) {
      var delay = params.delay;
      var duration = params.duration;
      var _params$x = params.x;
      var x = _params$x === undefined ? self.x : _params$x;
      var _params$y = params.y;
      var y = _params$y === undefined ? self.y : _params$y;
      var _params$rot = params.rot;
      var rot = _params$rot === undefined ? self.rot : _params$rot;
      var ease$$ = params.ease;
      var onStart = params.onStart;
      var onProgress = params.onProgress;
      var onComplete = params.onComplete;

      var startX, startY, startRot;
      var diffX, diffY, diffRot;

      animationFrames(delay, duration).start(function () {
        startX = self.x || 0;
        startY = self.y || 0;
        startRot = self.rot || 0;
        onStart && onStart();
      }).progress(function (t) {
        var et = ease[ease$$ || 'cubicInOut'](t);

        diffX = x - startX;
        diffY = y - startY;
        diffRot = rot - startRot;

        onProgress && onProgress(t, et);

        self.x = startX + diffX * et;
        self.y = startY + diffY * et;
        self.rot = startRot + diffRot * et;

        $el.style[transform] = translate(self.x + 'px', self.y + 'px') + (diffRot ? 'rotate(' + self.rot + 'deg)' : '');
      }).end(function () {
        onComplete && onComplete();
      });
    };

    // set rank & suit
    self.setRankSuit = function (rank, suit) {
      var suitName = SuitName(suit);
      $el.setAttribute('class', 'card ' + suitName + ' rank' + rank);
    };

    self.setRankSuit(rank, suit);

    self.enableDragging = function () {
      // this activates dragging
      if (isDraggable) {
        // already is draggable, do nothing
        return;
      }
      isDraggable = true;
      $el.style.cursor = 'move';
    };

    self.enableFlipping = function () {
      if (isFlippable) {
        // already is flippable, do nothing
        return;
      }
      isFlippable = true;
    };

    self.disableFlipping = function () {
      if (!isFlippable) {
        // already disabled flipping, do nothing
        return;
      }
      isFlippable = false;
    };

    self.disableDragging = function () {
      if (!isDraggable) {
        // already disabled dragging, do nothing
        return;
      }
      isDraggable = false;
      $el.style.cursor = '';
    };

    return self;

    function addModule(module) {
      // add card module
      module.card && module.card(self);
    }

    function onMousedown(e) {
      var startPos = {};
      var pos = {};
      var starttime = Date.now();

      e.preventDefault();

      // get start coordinates and start listening window events
      if (e.type === 'mousedown') {
        startPos.x = pos.x = e.clientX;
        startPos.y = pos.y = e.clientY;
        addListener(window, 'mousemove', onMousemove);
        addListener(window, 'mouseup', onMouseup);
      } else {
        startPos.x = pos.x = e.touches[0].clientX;
        startPos.y = pos.y = e.touches[0].clientY;
        addListener(window, 'touchmove', onMousemove);
        addListener(window, 'touchend', onMouseup);
      }

      if (!isDraggable) {
        // is not draggable, do nothing
        return;
      }

      // move card
      $el.style[transform] = translate(self.x + 'px', self.y + 'px') + (self.rot ? ' rotate(' + self.rot + 'deg)' : '');
      $el.style.zIndex = maxZ++;

      function onMousemove(e) {
        if (!isDraggable) {
          // is not draggable, do nothing
          return;
        }
        if (e.type === 'mousemove') {
          pos.x = e.clientX;
          pos.y = e.clientY;
        } else {
          pos.x = e.touches[0].clientX;
          pos.y = e.touches[0].clientY;
        }

        // move card
        $el.style[transform] = translate(Math.round(self.x + pos.x - startPos.x) + 'px', Math.round(self.y + pos.y - startPos.y) + 'px') + (self.rot ? ' rotate(' + self.rot + 'deg)' : '');
      }

      function onMouseup(e) {
        if (isFlippable && Date.now() - starttime < 200) {
          // flip sides
          self.setSide(self.side === 'front' ? 'back' : 'front');
        }
        if (e.type === 'mouseup') {
          removeListener(window, 'mousemove', onMousemove);
          removeListener(window, 'mouseup', onMouseup);
        } else {
          removeListener(window, 'touchmove', onMousemove);
          removeListener(window, 'touchend', onMouseup);
        }
        if (!isDraggable) {
          // is not draggable, do nothing
          return;
        }

        // set current position
        self.x = self.x + pos.x - startPos.x;
        self.y = self.y + pos.y - startPos.y;
      }
    }

    function mount(target) {
      // mount card to target (deck)
      target.appendChild($el);

      self.$root = target;
    }

    function unmount() {
      // unmount from root (deck)
      self.$root && self.$root.removeChild($el);
      self.$root = null;
    }

    function setSide(newSide) {
      // flip sides
      if (newSide === 'front') {
        if (self.side === 'back') {
          $el.removeChild($back);
        }
        self.side = 'front';
        $el.appendChild($face);
        self.setRankSuit(self.rank, self.suit);
      } else {
        if (self.side === 'front') {
          $el.removeChild($face);
        }
        self.side = 'back';
        $el.appendChild($back);
        $el.setAttribute('class', 'card');
      }
    }
  }

  function SuitName(suit) {
    // return suit name from suit value
    return suit === 0 ? 'spades' : suit === 1 ? 'hearts' : suit === 2 ? 'clubs' : suit === 3 ? 'diamonds' : 'joker';
  }

  function addListener(target, name, listener) {
    target.addEventListener(name, listener);
  }

  function removeListener(target, name, listener) {
    target.removeEventListener(name, listener);
  }

  var ease = {
    linear: function linear(t) {
      return t;
    },
    quadIn: function quadIn(t) {
      return t * t;
    },
    quadOut: function quadOut(t) {
      return t * (2 - t);
    },
    quadInOut: function quadInOut(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    cubicIn: function cubicIn(t) {
      return t * t * t;
    },
    cubicOut: function cubicOut(t) {
      return --t * t * t + 1;
    },
    cubicInOut: function cubicInOut(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    quartIn: function quartIn(t) {
      return t * t * t * t;
    },
    quartOut: function quartOut(t) {
      return 1 - --t * t * t * t;
    },
    quartInOut: function quartInOut(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    quintIn: function quintIn(t) {
      return t * t * t * t * t;
    },
    quintOut: function quintOut(t) {
      return 1 + --t * t * t * t * t;
    },
    quintInOut: function quintInOut(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }
  };

  var flip = {
    deck: function deck(_deck) {
      _deck.flip = _deck.queued(flip);

      function flip(next, side) {
        var flipped = _deck.cards.filter(function (card) {
          return card.side === 'front';
        }).length / _deck.cards.length;

        _deck.cards.forEach(function (card, i) {
          card.setSide(side ? side : flipped > 0.5 ? 'back' : 'front');
        });
        next();
      }
    }
  };

  var sort = {
    deck: function deck(_deck2) {
      _deck2.sort = _deck2.queued(sort);

      function sort(next, reverse) {
        var cards = _deck2.cards;

        cards.sort(function (a, b) {
          if (reverse) {
            return a.i - b.i;
          } else {
            return b.i - a.i;
          }
        });

        cards.forEach(function (card, i) {
          card.sort(i, cards.length, function (i) {
            if (i === cards.length - 1) {
              next();
            }
          }, reverse);
        });
      }
    },
    card: function card(_card2) {
      var $el = _card2.$el;

      _card2.sort = function (i, len, cb, reverse) {
        var z = i / 4;
        var delay = i * 10;

        _card2.animateTo({
          delay: delay,
          duration: 400,

          x: -z,
          y: -150,
          rot: 0,

          onComplete: function onComplete() {
            $el.style.zIndex = i;
          }
        });

        _card2.animateTo({
          delay: delay + 500,
          duration: 400,

          x: -z,
          y: -z,
          rot: 0,

          onComplete: function onComplete() {
            cb(i);
          }
        });
      };
    }
  };

  function plusminus(value) {
    var plusminus = Math.round(Math.random()) ? -1 : 1;

    return plusminus * value;
  }

  function fisherYates(array) {
    var rnd, temp;

    for (var i = array.length - 1; i; i--) {
      rnd = Math.random() * i | 0;
      temp = array[i];
      array[i] = array[rnd];
      array[rnd] = temp;
    }

    return array;
  }

  function fontSize() {
    return window.getComputedStyle(document.body).getPropertyValue('font-size').slice(0, -2);
  }

  var _____fontSize;

  var shuffle = {
    deck: function deck(_deck3) {
      _deck3.shuffle = _deck3.queued(shuffle);

      function shuffle(next) {
        var cards = _deck3.cards;

        _____fontSize = fontSize();

        fisherYates(cards);

        cards.forEach(function (card, i) {
          card.pos = i;

          card.shuffle(function (i) {
            if (i === cards.length - 1) {
              next();
            }
          });
        });
        return;
      }
    },

    card: function card(_card3) {
      var $el = _card3.$el;

      _card3.shuffle = function (cb) {
        var i = _card3.pos;
        var z = i / 4;
        var delay = i * 2;

        _card3.animateTo({
          delay: delay,
          duration: 200,

          x: plusminus(Math.random() * 40 + 20) * _____fontSize / 16,
          y: -z,
          rot: 0
        });
        _card3.animateTo({
          delay: 200 + delay,
          duration: 200,

          x: -z,
          y: -z,
          rot: 0,

          onStart: function onStart() {
            $el.style.zIndex = i;
          },

          onComplete: function onComplete() {
            cb(i);
          }
        });
      };
    }
  };

  var ___fontSize;
  var cards;

  var tarabish = {
    deck: function deck(_deck4) {
      //assign deck a new function after queueing
      ___fontSize = fontSize();
      cards = _deck4.cards;
      var len = cards.length;
      console.log('cards length is ' + len);

      var myGame = (function () {

        // set up closure scope
        // var state = 1;
        var dealerPosition; // = 'south';
        var currentPosition = undefined,
            handTrump = undefined,
            handBidder = undefined; // = 'west';
        var playerPositions = ["west", "north", "east", "south"];
        var suits = ['spades', 'hearts', 'clubs', 'diamonds'];
        var cardSuits = [];

        var cardValues = {
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
          }
        };
        var dealCount = 0; //cards.length
        var testMode;

        // return object with methods to manipulate closure scope
        var positions = {
          west: {
            begOne: -6,
            endOne: -3,
            side: 'back',
            getY: function getY(idx, fs) {
              return Math.round((idx - 1.95) * 10 * fs / 16);
            },
            getX: function getX(idx, fs) {
              return Math.round(-130 * fs / 16);
            },
            nextPosition: 'north',
            rot: 90,
            cards: new Array()
          },
          north: {
            begOne: -9,
            endOne: -6,
            side: 'back',
            getY: function getY(idx, fs) {
              return Math.round(-130 * fs / 16);
            },
            getX: function getX(idx, fs) {
              return Math.round((idx - 2.45) * 10 * fs / 16);
            },
            nextPosition: 'east',
            rot: 0,
            cards: new Array()
          },
          east: {
            begOne: -12,
            endOne: -9,
            side: 'back',
            getY: function getY(idx, fs) {
              return Math.round((idx - 1.95) * 10 * fs / 16);
            },
            getX: function getX(idx, fs) {
              return Math.round(130 * fs / 16);
            },
            nextPosition: 'south',
            rot: 90,
            cards: new Array()
          },
          south: {
            begOne: -15,
            endOne: -12,
            side: 'front',
            getY: function getY(idx, fs) {
              return Math.round(180 * fs / 16);
            },
            getX: function getX(idx, fs) {
              return Math.round((idx - 3.75) * 25 * fs / 16);
            },
            nextPosition: 'west',
            rot: 0,
            cards: new Array()
          }
        };
        return {
          getDealer: function getDealer() {
            return playerPositions[dealerPosition];
          },
          getCurrent: function getCurrent() {
            return playerPositions[currentPosition];
          },
          start: function start() {
            var testing = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            testMode = testing;
            return chooseDealer().then(function (data) {
              return deal(3, 4);
            }).then(function (data) {
              return deal(3, 4);
            }).then(function (data) {
              return acceptBids();
            }).then(function (data) {
              console.log('bid is ' + data);
              return sortSouth();
            })
            // .then(data => {
            //   console.log(`bid is ${data}`)
            //   return deal(3, 4)
            // })
            .then(function (data) {
              return 'finished deal, trump is ' + handTrump + ', bid by ' + handBidder;
            });
          }
        };

        function sortSouth(reverse) {
          var southCards = positions.south.cards;
          positions.south.cards = [];
          southCards.sort(function (a, b) {
            if (reverse) {
              return a.i - b.i;
            } else {
              return b.i - a.i;
            }
          });
          var chain = Promise.resolve();
          southCards.forEach(function (currentCard, i) {
            (function (cp) {
              chain = chain.then(function () {
                return dealCard(cp, currentCard, i);
              });
              // do your stuff here
              // use the index variable - it is assigned to the value of 'i'
              // that was passed in during the loop iteration.
            })(3); // south Position
            //   // if (i === southCards.length - 1) {
            //   //   next()-
            //   // }
            // }, reverse)
          });
          return chain;
        }

        function moveCard(i, len, cb, reverse) {
          // var z = i / 4
          // var delay = i * 10

          // card.animateTo({
          //   delay: delay,
          //   duration: 400,

          //   x: -z,
          //   y: -150,
          //   rot: 0,

          //   onComplete: function () {
          //     $el.style.zIndex = i
          //   }
          // })

          // card.animateTo({
          //   delay: delay + 500,
          //   duration: 400,

          //   x: -z,
          //   y: -z,
          //   rot: 0,

          //   onComplete: function () {
          //     cb(i)
          //   }
          // })
        }
        function dealCard(cp, card, i) {
          return new Promise(function (resolve, reject) {
            //console.log(`deal card ${card} to ${position.nextPosition}`)
            var position = positions[playerPositions[cp]];
            console.log('position is ' + position.nextPosition);
            //debugger
            var handSize = position.cards.length;
            console.log('handSize is ' + handSize);
            var delay = testMode ? 0 : 250; //0 //handSize * 250//i * 250
            var duration = testMode ? 25 : 250;
            var len = cards.length;
            console.log('currentPosition is ' + cp);
            var currentY = position.getY(handSize, ___fontSize);
            var currentX = position.getX(handSize, ___fontSize);
            ___fontSize = fontSize();
            console.log('card is ' + card.rank + ' of ' + card.suit + ', handSize is ' + handSize + ', \n              currentY is ' + currentY + ' and currentX is ' + currentX);
            card.animateTo({
              delay: delay,
              duration: duration,
              y: currentY, //Math.round((i - 1.05) * 20 * fontSize / 16),
              x: currentX, //Math.round(-150 * fontSize / 16),
              rot: position.rot,
              onStart: function onStart() {
                card.$el.style.zIndex = len - 1 + handSize;
              },
              onComplete: function onComplete() {
                card.setSide(position.side);
                position.cards.push(card);
                dealCount++;
                resolve();
              }
            });
          });
        }

        function acceptBids() {
          return automaticBid(playerPositions[currentPosition]).then(automaticBidHandler).then(automaticBidHandler).then(automaticBidHandler)['catch'](function (data) {
            handTrump = data;
            console.log('bid is resolved');
            return Promise.resolve(data);
          });
        }
        function automaticBidHandler(data) {
          //check for a bid other than pass, and if found,we are finished bidding.
          handBidder = playerPositions[currentPosition];
          console.log('bid is ' + playerPositions[currentPosition] + ', ' + data);
          currentPosition = (currentPosition + 1) % 4;
          if (data === 'pass') {
            console.log('bid is not resolved');
            return automaticBid(playerPositions[currentPosition]);
          } else {
            return Promise.reject(data);
          }
        }
        function automaticBid(playerPosition) {
          return new Promise(function (resolve, reject) {
            var position = positions[playerPosition];
            position.cards.forEach(function (card) {
              console.log('card is ' + card.rank + ' of ' + card.suit);
            });
            var bid = evaluateCards(position.cards);

            return resolve(bid);
          });
        }
        function evaluateCards(hand) {
          var trumpReducer = function trumpReducer(accumulator, currentValue) {
            return accumulator + cardValues[currentValue.rank.toString()].trump;
          };
          var nonTrumpReducer = function nonTrumpReducer(accumulator, currentValue) {
            return accumulator + cardValues[currentValue.rank.toString()].nonTrump;
          };
          var scenarios = [0, 1, 2, 3].map(function (currentTrump) {
            // return {
            return [hand.filter(function (c) {
              return c.suit === 0;
            }), hand.filter(function (c) {
              return c.suit === 1;
            }), hand.filter(function (c) {
              return c.suit === 2;
            }), hand.filter(function (c) {
              return c.suit === 3;
            })].map(function (val) {
              return val.reduce(function (prev, curr, index) {
                if (curr.suit === currentTrump) {
                  return prev + cardValues[curr.rank.toString()].trump;
                } else {
                  return prev + cardValues[curr.rank.toString()].nonTrump;
                }
              }, 0);
            }).reduce(function (prev, curr) {
              return prev + curr;
            }, 0);
            // currentTrump:currentTrump,
            // pointTotal:calculateTotals(hand,currentTrump)
            // }
          });
          var indexOfMaxValue = scenarios.reduce(function (iMax, x, i, arr) {
            return x > arr[iMax] ? i : iMax;
          }, 0);
          console.log(scenarios);
          console.log(indexOfMaxValue); //Math.max( ...scenarios )
          if (scenarios[indexOfMaxValue] > 34) {
            return suits[indexOfMaxValue];
          } else {
            return 'pass';
          }
        }
        function calculateTotals(hand, trump) {
          var possibleTrumpScenarios = [hand.filter(function (c) {
            return c.suit === 0;
          }), hand.filter(function (c) {
            return c.suit === 1;
          }), hand.filter(function (c) {
            return c.suit === 2;
          }), hand.filter(function (c) {
            return c.suit === 3;
          })].map(function (val) {
            return val.reduce(function (prev, curr) {
              if (curr.suit === trump) {
                return prev + cardValues[curr.rank.toString()].trump;
              } else {
                return prev + cardValues[curr.rank.toString()].nonTrump;
              }
            }, 0);
          }).reduce(function (prev, curr) {
            return prev + curr;
          }, 0);
          //trump.map(function (value) {
          return possibleTrumpScenarios;
          //})
        }
        function deal(amount) {
          var repeat = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

          //return new Promise(function (resolve, reject) {
          var cardCount = amount * repeat;
          var len = cards.length;
          var cardsToDeal = cards.slice(len - dealCount - cardCount, len - dealCount); //.reverse()
          //dealCount starts at 0, and we are beginning at the top of the deck
          //var beginning =
          console.log('dealing ' + amount + ' cards ' + repeat + ' times from deck of ' + len + '.');
          console.log('first to bid is ' + playerPositions[currentPosition]);
          console.log('dealer is ' + playerPositions[dealerPosition]);
          // let pos = positions[playerPositions[currentPosition]]
          //let currentCard
          var chain = Promise.resolve();
          // (async function loop() {
          for (var repeatIndex = 0; repeatIndex < repeat; repeatIndex++) {
            var _loop = function (amountIndex) {
              //3
              // let pos = positions[playerPositions[currentPosition]]
              var currentCard = cardsToDeal.pop();
              //console.log(`card is ${currentCard.rank} of ${currentCard.suit}`)
              console.log('cardsToDeal are ' + cardsToDeal.length);
              //let cp = currentPosition
              (function (cp) {
                chain = chain.then(function () {
                  return dealCard(cp, currentCard, amountIndex);
                });
                // do your stuff here
                // use the index variable - it is assigned to the value of 'i'
                // that was passed in during the loop iteration.
              })(currentPosition);
            };

            //4
            for (var amountIndex = 0; amountIndex < amount; amountIndex++) {
              _loop(amountIndex);
            }
            currentPosition = (currentPosition + 1) % repeat;
            console.log('after incrementing, currentPosition is ' + currentPosition);
          }
          //console.log(`cardsToDeal are ${cardsToDeal.length}`)
          return chain;
        }
        function dealCard(cp, card, i) {
          return new Promise(function (resolve, reject) {
            //console.log(`deal card ${card} to ${position.nextPosition}`)
            var position = positions[playerPositions[cp]];
            console.log('position is ' + position.nextPosition);
            //debugger
            var handSize = position.cards.length;
            console.log('handSize is ' + handSize);
            var delay = testMode ? 0 : 250; //0 //handSize * 250//i * 250
            var duration = testMode ? 25 : 250;
            var len = cards.length;
            console.log('currentPosition is ' + cp);
            var currentY = position.getY(handSize, ___fontSize);
            var currentX = position.getX(handSize, ___fontSize);
            ___fontSize = fontSize();
            console.log('card is ' + card.rank + ' of ' + card.suit + ', handSize is ' + handSize + ', \n              currentY is ' + currentY + ' and currentX is ' + currentX);
            card.animateTo({
              delay: delay,
              duration: duration,
              y: currentY, //Math.round((i - 1.05) * 20 * fontSize / 16),
              x: currentX, //Math.round(-150 * fontSize / 16),
              rot: position.rot,
              onStart: function onStart() {
                card.$el.style.zIndex = len - 1 + handSize;
              },
              onComplete: function onComplete() {
                card.setSide(position.side);
                position.cards.push(card);
                dealCount++;
                resolve();
              }
            });
          });
        }

        function chooseDealer(gameState) {
          return new Promise(function (resolve, reject) {
            var offset = Math.floor(Math.random() * 4);
            dealerPosition = offset;
            currentPosition = (offset + 1) % playerPositions.length;
            resolve();
          });
        }
      })();

      _deck4.tarabish = _deck4.queued(tarabish);

      function tarabish(next, dealer) {
        var rounds = [[-3, cards.length], [-6, -3], [-9, -6], [-12, -9]];
        var chain;
        myGame.start(true).then(function (gameState) {
          console.log('Got the final result: ' + gameState);
          next();
        });
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

      _deck4.test = _deck4.queued(test);

      function test(next, dealer) {
        console.log('test is ' + dealer);
        next();
      }
    },
    card: function card(_card4) {
      var $el = _card4.$el;

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
  };

  var __fontSize;

  var poker = {
    deck: function deck(_deck5) {
      _deck5.poker = _deck5.queued(poker);

      function poker(next) {
        var cards = _deck5.cards;
        var len = cards.length;

        __fontSize = fontSize();

        cards.slice(-5).reverse().forEach(function (card, i) {
          card.poker(i, len, function (i) {
            card.setSide('front');
            if (i === 4) {
              next();
            }
          });
        });
      }
    },
    card: function card(_card5) {
      var $el = _card5.$el;

      _card5.poker = function (i, len, cb) {
        var delay = i * 250;

        _card5.animateTo({
          delay: delay,
          duration: 250,

          x: Math.round((i - 2.05) * 70 * __fontSize / 16),
          y: Math.round(-110 * __fontSize / 16),
          rot: 0,

          onStart: function onStart() {
            $el.style.zIndex = len - 1 + i;
          },
          onComplete: function onComplete() {
            cb(i);
          }
        });
      };
    }
  };

  var intro = {
    deck: function deck(_deck6) {
      _deck6.intro = _deck6.queued(intro);

      function intro(next) {
        var cards = _deck6.cards;

        cards.forEach(function (card, i) {
          card.setSide('front');
          card.intro(i, function (i) {
            animationFrames(250, 0).start(function () {
              card.setSide('back');
            });
            if (i === cards.length - 1) {
              next();
            }
          });
        });
      }
    },
    card: function card(_card6) {
      var transform = prefix('transform');

      var $el = _card6.$el;

      _card6.intro = function (i, cb) {
        var delay = 500 + i * 10;
        var z = i / 4;

        $el.style[transform] = translate(-z + 'px', '-250px');
        $el.style.opacity = 0;

        _card6.x = -z;
        _card6.y = -250 - z;
        _card6.rot = 0;

        _card6.animateTo({
          delay: delay,
          duration: 1000,

          x: -z,
          y: -z,

          onStart: function onStart() {
            $el.style.zIndex = i;
          },
          onProgress: function onProgress(t) {
            $el.style.opacity = t;
          },
          onComplete: function onComplete() {
            $el.style.opacity = '';
            cb && cb(i);
          }
        });
      };
    }
  };

  var _fontSize;

  var fan = {
    deck: function deck(_deck7) {
      _deck7.fan = _deck7.queued(fan);

      function fan(next) {
        var cards = _deck7.cards;
        var len = cards.length;

        _fontSize = fontSize();

        cards.forEach(function (card, i) {
          card.fan(i, len, function (i) {
            if (i === cards.length - 1) {
              next();
            }
          });
        });
      }
    },
    card: function card(_card7) {
      var $el = _card7.$el;

      _card7.fan = function (i, len, cb) {
        var z = i / 4;
        var delay = i * 10;
        var rot = i / (len - 1) * 260 - 130;

        _card7.animateTo({
          delay: delay,
          duration: 300,

          x: -z,
          y: -z,
          rot: 0
        });
        _card7.animateTo({
          delay: 300 + delay,
          duration: 300,

          x: Math.cos(deg2rad(rot - 90)) * 55 * _fontSize / 16,
          y: Math.sin(deg2rad(rot - 90)) * 55 * _fontSize / 16,
          rot: rot,

          onStart: function onStart() {
            $el.style.zIndex = i;
          },

          onComplete: function onComplete() {
            cb(i);
          }
        });
      };
    }
  };

  function deg2rad(degrees) {
    return degrees * Math.PI / 180;
  }

  var ____fontSize;

  var bysuit = {
    deck: function deck(_deck8) {
      _deck8.bysuit = _deck8.queued(bysuit);

      function bysuit(next) {
        var cards = _deck8.cards;

        ____fontSize = fontSize();

        cards.forEach(function (card) {
          card.bysuit(function (i) {
            if (i === cards.length - 1) {
              next();
            }
          });
        });
      }
    },
    card: function card(_card8) {
      var rank = _card8.rank;
      var suit = _card8.suit;

      _card8.bysuit = function (cb) {
        var i = _card8.i;
        var delay = i * 10;

        _card8.animateTo({
          delay: delay,
          duration: 400,

          x: -Math.round((6.75 - rank) * 8 * ____fontSize / 16),
          y: -Math.round((1.5 - suit) * 92 * ____fontSize / 16),
          rot: 0,

          onComplete: function onComplete() {
            cb(i);
          }
        });
      };
    }
  };

  function queue(target) {
    var array = Array.prototype;

    var queueing = [];

    target.queue = queue;
    target.queued = queued;

    return target;

    function queued(action) {
      return function () {
        var self = this;
        var args = arguments;

        queue(function (next) {
          action.apply(self, array.concat.apply(next, args));
        });
      };
    }

    function queue(action) {
      if (!action) {
        return;
      }

      queueing.push(action);

      if (queueing.length === 1) {
        next();
      }
    }
    function next() {
      queueing[0](function (err) {
        if (err) {
          throw err;
        }

        queueing = queueing.slice(1);

        if (queueing.length) {
          next();
        }
      });
    }
  }

  function observable(target) {
    target || (target = {});
    var listeners = {};

    target.on = on;
    target.one = one;
    target.off = off;
    target.trigger = trigger;

    return target;

    function on(name, cb, ctx) {
      listeners[name] || (listeners[name] = []);
      listeners[name].push({ cb: cb, ctx: ctx });
    }

    function one(name, cb, ctx) {
      listeners[name] || (listeners[name] = []);
      listeners[name].push({
        cb: cb, ctx: ctx, once: true
      });
    }

    function trigger(name) {
      var self = this;
      var args = Array.prototype.slice(arguments, 1);

      var currentListeners = listeners[name] || [];

      currentListeners.filter(function (listener) {
        listener.cb.apply(self, args);

        return !listener.once;
      });
    }

    function off(name, cb) {
      if (!name) {
        listeners = {};
        return;
      }

      if (!cb) {
        listeners[name] = [];
        return;
      }

      listeners[name] = listeners[name].filter(function (listener) {
        return listener.cb !== cb;
      });
    }
  }

  function Deck(jokers) {
    // init cards array
    var cards = new Array(jokers ? 55 : 52);

    var $el = createElement('div');
    var self = observable({ mount: mount, unmount: unmount, cards: cards, $el: $el });
    var $root;

    var modules = Deck.modules;
    var module;

    // make queueable
    queue(self);

    // load modules
    for (module in modules) {
      addModule(modules[module]);
    }

    // add class
    $el.classList.add('deck');

    var card;

    // create cards
    for (var i = cards.length; i; i--) {
      card = cards[i - 1] = _card(i - 1);
      card.setSide('back');
      card.mount($el);
    }

    return self;

    function mount(root) {
      // mount deck to root
      $root = root;
      $root.appendChild($el);
    }

    function unmount() {
      // unmount deck from root
      $root.removeChild($el);
    }

    function addModule(module) {
      module.deck && module.deck(self);
    }
  }
  Deck.animationFrames = animationFrames;
  Deck.ease = ease;
  Deck.modules = { bysuit: bysuit, fan: fan, intro: intro, poker: poker, tarabish: tarabish, shuffle: shuffle, sort: sort, flip: flip };
  Deck.Card = _card;
  Deck.prefix = prefix;
  Deck.translate = translate;

  return Deck;
})();
