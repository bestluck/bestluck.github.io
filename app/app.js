// bit-exo.com V2.0.1
// Copyright 2016 bit-exo.com

///////////////////////
// All trademarks,trade names,images,contents,snippets,codes,including text
// and graphics appearing on the site are intellectual property of their
// respective owners, including in some instances,"bit-exo.com".
// All rights reserved.

// Below is the list of owners/sites where elements of this site were based on.

// http://untitled-dice.github.io/,
// https://classic.plinkopot.com
// https://sat.oshi.xyz
/////////////////////////////

var config = {
  app_id: 926,
  app_name: 'Welcome to Bit-Exo',
  recaptcha_sitekey: '6LefHRcTAAAAAGwCE3EB_5A_L3Ay3wVZUCISid-D',
  redirect_uri: 'https://bit-exo.com',
  mp_browser_uri: 'https://www.moneypot.com',
  mp_api_uri: 'https://api.moneypot.com',
  be_api_uri: 'https://bit-exo.com',
  chat_uri: '//socket.moneypot.com',
  be_uri: '//bit-exo.com',
  force_https_redirect: true,
  house_edge: 0.01,
  chat_buffer_size: 99,
  /// Plinko payout size
  n: 17,  //MIN 3 MAX is betStore.state.pay_tables.ROW1.length
  ///////
  hexColors: {
    dark: {
      'ROW1': '#424242',
      'ROW2': '#77b300',
      'ROW3': '#2a9fd6',
      'ROW4': '#9933cc',
      'ROW5': '#ff8800'
    }
  },
  puck_diameter: 45,
  peg_diameter: 4,
  top_margin: 50,
  side_margin: 3,
  payTableRowHeight: 30,
  // - The amount of bets to show on screen in each tab
  bet_buffer_size: 50
};

///Plinko calculated size of path choices based on payout size
config.c = config.n + (config.n-3);
config.levels = config.n - 1;
config.table_height = config.top_margin + (config.levels * config.puck_diameter) + (config.levels * config.peg_diameter) - 120;
config.table_width =  config.side_margin*2 + (config.n * config.puck_diameter) + (config.n * config.peg_diameter);

// Validate the configured house edge
(function() {
var errString;

if (config.house_edge <= 0.0) {
  errString = 'House edge must be > 0.0 (0%)';
} else if (config.house_edge >= 100.0) {
  errString = 'House edge must be < 1.0 (100%)';
}

if (errString) {
  alert(errString);
  throw new Error(errString);
}

// Sanity check: Print house edge
console.log('House Edge:', (config.house_edge * 100).toString() + '%');
})();

if (config.force_https_redirect && window.location.protocol !== "https:") {
  window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
}

// Hoist it. It's impl'd at bottom of page.
var socket;

var el = React.DOM;

// Generates UUID for uniquely tagging components
var genUuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};

///////////////////////////Plinko stuff
// Generates a unique id, used for uniquely tagging object/elements
// :: Int
var generateId = (function() {
  var currentId = 0;
  return function _generateId() {
    return ++currentId;
  };
})();


var generatePath = function() {
  var rowCount = config.n-1;
  var out = [];
  var outcomes = ['L', 'R'];
  for (var i = 0; i < rowCount; i++) {
    var outcome = outcomes[Math.floor(Math.random() * 2)];
    out.push(outcome);
  }
  return out;
};

// data.path (Required) is array of ['L', 'R', 'R', ...]
// data.onComplete (Optional) function called when puck is done animating
//   - the puck instance is passed into the fn
// data.onSlot (Optional) function called when puck lands in slot
//   - the puck instance is passed into the fn
// data.color (Optional) is 'red' | 'blue' | ...
// data.isTest: Bool (optional)
// data.bet: Bet
// data.isFair: Bool
var Peak = function(data) {
  this.id = generateId();
  // console.log('Initializing Peak. path=' + path + '. id=' + this.id);

  this.bet = data.bet;
  this.isFair = data.isFair;
  this.row = -1;
  this.peg = 15;
  this.path = data.path;
  this.isTest = !!data.isTest;
  this.onComplete = data.onComplete || function() {};
  this.onSlot = data.onSlot || function() {};
  this.onPeg = data.onPeg || function() {};
  // isRevealed is set to true once it hits a slot and the user is made aware of
  // the outcome
  this.isRevealed = false;
  this.color = data.color || getRandomColor();

  var self = this;

  this.move = function(dir, cb) {
    var n;
    var solve;
    switch(dir) {
      case 'L':
      //move marker
      //subtract right side
      if (this.peg > 0)
        {
        solve = Number(data2.datasets[0].data[this.peg]) - 20;
        if (solve < 0){
          solve = 0;
          }
        data2.datasets[0].data[this.peg] = solve;

        for (n = this.peg + 1; n < config.c; n++)
          {
            solve = Number(data2.datasets[0].data[n]) - 20;
            if (solve < 0){
              solve = 0;
            }
          data2.datasets[0].data[n] = solve;
          }

        this.peg -= 1;
          }
        else{
          solve = Number(data2.datasets[0].data[this.peg]) - 10;
          if (solve < 0){
            solve = 0;
          }
            data2.datasets[0].data[this.peg] = solve;

          for (n = this.peg + 1; n < config.c; n++)
            {
              solve = Number(data2.datasets[0].data[n]) - 10;
              if (solve < 0){
                solve = 0;
              }
            data2.datasets[0].data[n] = solve;
            }
        }

        break;
      case 'R':
      //move marker
      //subtract left side
      if (this.peg < config.c)
        {
      solve = Number(data2.datasets[0].data[this.peg]) - 20;
      if (solve < 0){
        solve = 0;
      }
        data2.datasets[0].data[this.peg] = solve;
      for (n = 0; n < this.peg; n++)
        {
        solve = Number(data2.datasets[0].data[n]) - 20;
          if (solve < 0){
            solve = 0;
          }
        data2.datasets[0].data[n] = solve;
        }

        this.peg += 1;
        }
      else {
        solve = Number(data2.datasets[0].data[this.peg]) - 10;
        if (solve < 0){
          solve = 0;
        }
          data2.datasets[0].data[this.peg] = solve;
        for (n = 0; n < this.peg; n++)
          {
          solve = Number(data2.datasets[0].data[n]) - 10;
            if (solve < 0){
              solve = 0;
            }
          data2.datasets[0].data[n] = solve;
          }
      }

        break;
    }

    //trigger draw chart
      Dispatcher.sendAction('UPDATE_PLINKO',null);
      cb();
  };

    this.run = function() {

    var currRow = self.row++;

    if (currRow === -1) {
        self.run();
    } else if (currRow < self.path.length) {
      // Not yet reached end of table
      setTimeout(function(){self.move(self.path[currRow], self.run);}.bind(this), 500);
    } else {
      // Reached end of table

          // When Peak lands in slot, call the onSlot callback
          self.isRevealed = true;
          Dispatcher.sendAction('SET_PLINKO_WIN',null);
          setTimeout(function(){ Dispatcher.sendAction('UPDATE_PLINKO',null);}.bind(this), 500);
          self.onSlot(self);


          self.onComplete(self);
          Dispatcher.sendAction('CLEAR_PLINKO_WIN',null);
          setTimeout(function(){ Dispatcher.sendAction('RESET_PLINKO',null);}.bind(this), 1500);

    }
  };
};


var Puck = function(data) {
  this.id = generateId();

  this.bet = data.bet;
  this.isFair = data.isFair;
  this.row = -1;
  this.path = data.path;
  this.isTest = !!data.isTest;
  this.onComplete = data.onComplete || function() {};
  this.onSlot = data.onSlot || function() {};
  this.onPeg = data.onPeg || function() {};
  // isRevealed is set to true once it hits a slot and the user is made aware of
  // the outcome
  this.isRevealed = false;

  this.color = data.color || getRandomColor();
  switch(this.color) {
    case 'ROW5':
      var imgElement = document.getElementById('row5gear');
      break;
    case 'ROW4':
      var imgElement = document.getElementById('row4gear');
      break;
    case 'ROW3':
      var imgElement = document.getElementById('row3gear');
      break;
    case 'ROW2':
      var imgElement = document.getElementById('row2gear');
      break;
    case 'ROW1':
      var imgElement = document.getElementById('row1gear');
      break;
  }

  this._puck = new fabric.Image(imgElement, {
    top: 1,
    left: config.top_margin + Math.floor(config.n/2) * config.puck_diameter + Math.floor(config.n/2) * config.peg_diameter - 21,
    hasControls: false,
    hasRotatingPoint: false,
    selectable: false,
    originX: 'center',
    originY: 'center'
  });

  var self = this;

  canvas.add(self._puck);

  this.move = function(dir, cb) {
    switch(dir) {
      case 'L':
        self._puck.animate('left', '-=24.5', {
          easing: fabric.util.ease.easeOutExpo
        });
        self._puck.animate('angle', '-=90', {
          easing: fabric.util.ease.easeOutQuad
        });
        break;
      case 'R':
        self._puck.animate('left', '+=24.5', {
          easing: fabric.util.ease.easeOutExpo
        });
        self._puck.animate('angle', '+=90', {
          easing: fabric.util.ease.easeOutQuad
        });
        break;
    }

    // TODO: Make this function less bouncy. Taken from fabricjs source.
    // Currently unmodified
    var customEaseOutBounce = function(t, b, c, d) {
      if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b;
      } else if (t < (2/2.75)) {
        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
      } else if (t < (2.5/2.75)) {
        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
      } else {
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
      }
    };

    self._puck.animate('top', '+=31.5', {
      easing: customEaseOutBounce,
      onComplete: function() {
        //self.onPeg(self);
        cb();
      }
    });
  };
  this.run = function() {

    var currRow = self.row++;

    if (currRow === -1) {
      self._puck.animate('top', '+=35', {
        easing: fabric.util.ease.easeOutBounce,
        onComplete: self.run
      });
    } else if (currRow < self.path.length) {
      // Puck has not yet reached end of table
      self.move(self.path[currRow], self.run);
    } else {
      // Puck has reached end of table, so fade it out and remove from table
      // But first, move it into its cubbyhole

      var getDropHeight = function(puckColor) {
        switch(puckColor) {
          case 'ROW1':
            return config.payTableRowHeight*1 + 20;
          case 'ROW2':
            return config.payTableRowHeight*2 + 20;
          case 'ROW3':
            return config.payTableRowHeight*3 + 20;
          case 'ROW4':
            return config.payTableRowHeight*4 + 20;
          case 'ROW5':
            return config.payTableRowHeight*5 + 20;
          default:
            alert('Unsupported puck color: ' + puckColor);
        }
      };

      var dropHeight = getDropHeight(self.color);
      self._puck.animate('top', '+=' + dropHeight, {
        onComplete: function() {

          // When puck lands in slot, call the onSlot callback
          self.isRevealed = true;
          self.onSlot(self);

          self._puck.animate('angle', '+=1080', {
            easing: fabric.util.ease.easeOutQuad,
            duration: 2000
          });

          // Enlarge the puck once it lands in its hole
          self._puck.animate('scaleX', '+=0.5', {
            duration: 2000,
            easing: fabric.util.ease.easeOutExpo
          });
          self._puck.animate('scaleY', '+=0.5', {
            duration: 2000,
            easing: fabric.util.ease.easeOutExpo
          });
        }
      });

      self._puck.animate('opacity', 0, {
        duration: 2000,
        //easing: fabric.util.ease.easeOutExpo,
        onComplete: function() {
          // When done fading out, remove it from active pucks map
          self.onComplete(self);

          // Remove it from the canvas
          canvas.remove(self._puck);
        }
      });
    }
  };
};

// :: String
var getRandomColor = function() {
  var colors = ['ROW1','ROW2', 'ROW3', 'ROW4', 'ROW5'];
  return colors[Math.floor(Math.random()*colors.length)];
};

var canvas;
var kanvas;
// payouts is object of { green: [...], etc. }
var Kanvas = function(canvas) {
  //this.payouts = initPayouts;
  // The underlying Fabric Canvas instance
  this.canvas = canvas;
  // The underlying Fabric objects on the Fabric canvas
  // for the purpose of mutating them and then rerendering
  // this.objects = {
  //   payouts: {}
  // };

  var self = this;

  var _drawPegs = function() {
    var n = config.n;
    var puck_diameter = config.puck_diameter;
    var peg_diameter = config.peg_diameter;
    var top_margin = config.top_margin;
    var side_margin = config.side_margin;

    for (var row = 0; row < n-1; row++) {
      var pegCount = row + 1;
      var leftMargin = (n - row) * puck_diameter/2 + (n - row) * peg_diameter/2;
      var top = top_margin + (puck_diameter*0.65 * row) + (peg_diameter*0.65 * row);
      for (var col = 0; col < pegCount; col++) {
        self.canvas.add(new fabric.Circle({
          left: side_margin + leftMargin + (puck_diameter * col) + (peg_diameter * col) - 4,
          top: top,
          radius: peg_diameter,
          selectable: false,
          fill: 'white',
          stroke: 'black',
          shadow: 'rgba(0,0,0,1.0) 0px 4px 0px'
        }));
      }
    }
  };

  var _drawHorizontalLine = function() {
    // Draw horizontal line
    var rowCount = config.n;
    var rect = new fabric.Rect({
      top: config.top_margin + (rowCount * config.puck_diameter * 0.65) + (rowCount * config.peg_diameter * 0.65) - 22,
      left: config.side_margin,
      height: 2,
      selectable: false,
      width: (rowCount * config.puck_diameter) + (rowCount * config.peg_diameter)
    });
    self.canvas.add(rect);
  };

  var _drawDividers = function() {
    // Draw divider marks in the line
    for (var idx = 0; idx < 17; ++idx) {
      var rowCount = config.n - 1;
      var divider = new fabric.Rect({
        top: config.top_margin + (rowCount * config.puck_diameter*0.65) + (rowCount * config.peg_diameter*0.65),
        left: (config.puck_diameter + config.peg_diameter) * idx,
        height: 10,
        selectable: false,
        width: 2
      });
      if (idx !== 0) {
        canvas.add(divider);
      }
    }
  };

  var _drawBackground = function() {
    var rect = new fabric.Rect({
      top: 0,
      left: 0,
      height: config.table_height - 145,
      selectable: false,
      width: config.table_width,
      //fill: '#003242'
      fill: '#004c4d'
    });
  //  fabric.Image.fromURL('../res/logo.png', function(oImg) {
  //    self.canvas.add(oImg);
  //  });
    self.canvas.add(rect);
  };

  this.renderAll = function() {
    // Clear canvas and all event listeners on it
    self.canvas.dispose();
    self.canvas.renderOnAddRemove = false;
    _drawBackground();
    _drawPegs();
    _drawHorizontalLine();
    self.canvas.renderOnAddRemove = true;
    _drawDividers();
  };

};

///////////////////////////////////////////////////////////////////////////////////////
var helpers = {};

// For displaying HH:MM timestamp in chat
//
// String (Date JSON) -> String
helpers.formatDateToTime = function(dateJson) {
  var date = new Date(dateJson);
  return _.padLeft(date.getHours().toString(), 2, '0') +
    ':' +
    _.padLeft(date.getMinutes().toString(), 2, '0')+
      ':' +
      _.padLeft(date.getSeconds().toString(), 2, '0');
};

// Number -> Number in range (0, 1)
helpers.multiplierToWinProb = function(multiplier) {
  console.assert(typeof multiplier === 'number');
  console.assert(multiplier > 0);

  // For example, n is 0.99 when house edge is 1%
  var n = 1.0 - betStore.state.house_edge;//config.house_edge;

  return n / multiplier;
};

helpers.WinProbtoMultiplier = function(winProb) {
  console.assert(typeof winProb === 'number');
  console.assert(winProb > 0);

  // For example, n is 0.99 when house edge is 1%
  var n = 1.0 - betStore.state.house_edge;//config.house_edge;

  return n / winProb;
};

helpers.calcNumber = function(cond, winProb) {
  console.assert(cond === '<' || cond === '>');
  console.assert(typeof winProb === 'number');
  //((winProb * - 100)*-1).toFixed(4).toString() + '>n>' + (((winProb * -100) + 100 )-betStore.state.house_edge).toFixed(4).toString()
  if (cond === '<') {
    return winProb * 100;
  } else {
    return 99.9999 - (winProb * 100);
  }
};

helpers.convNumtoStr = function(num) {
//var str = '0.00';
if (worldStore.state.coin_type === 'BITS'){
  return (num / 100).toFixed(2).toString();
  }
else {
  return (num * 0.00000001).toFixed(8).toString();
}

};

helpers.convSatstoCointype = function(num){
  if (worldStore.state.coin_type === 'BITS'){
    return (num / 100).toFixed(2);
    }
  else {
    return (num * 0.00000001).toFixed(8);
  }
};

helpers.convCoinTypetoSats = function (num){

  if (worldStore.state.coin_type === 'BITS'){
    return (num * 100);
    }
  else {
    return (num / 0.00000001);
  }
};

helpers.roleToLabelElement = function(user) {
  switch(user.role) {
    case 'ADMIN':
      return el.span({className: 'label label-danger'}, 'MP Staff');
    case 'MOD':
      return el.span({className: 'label label-info'}, 'Mod');
    case 'OWNER':
      return el.span({className: 'label label-info'}, 'Admin');
    case 'BOT':
      return el.span({className: 'label label-primary'}, 'Bot');
    case 'JACKPOT':
      return el.span({className: 'label label-warning'},'JACKPOT');
    default:
      if ((user.uname == 'Chatbot')||(user.uname == 'chatbot'))
        {
        return el.span({className: 'label label-primary'}, 'Bot');
        }
      else {
          return '';
          }
  }
};

// -> Object
helpers.getHashParams = function() {
  var hashParams = {};
  var e,
      a = /\+/g,  // Regex for replacing addition symbol with a space
      r = /([^&;=]+)=?([^&;]*)/g,
      d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
      q = window.location.search.substring(1);
  while (e = r.exec(q))
    hashParams[d(e[1])] = d(e[2]);
  return hashParams;
};

// getPrecision('1') -> 0
// getPrecision('.05') -> 2
// getPrecision('25e-100') -> 100
// getPrecision('2.5e-99') -> 100
helpers.getPrecision = function(num) {
  var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) { return 0; }
  return Math.max(
    0,
    // Number of digits right of decimal point.
    (match[1] ? match[1].length : 0) -
    // Adjust for scientific notation.
    (match[2] ? +match[2] : 0));
};

/**
 * Decimal adjustment of a number.
 *
 * @param {String}  type  The type of adjustment.
 * @param {Number}  value The number.
 * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
 * @returns {Number} The adjusted value.
 */
helpers.decimalAdjust = function(type, value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

helpers.round10 = function(value, exp) {
  return helpers.decimalAdjust('round', value, exp);
};

helpers.floor10 = function(value, exp) {
  return helpers.decimalAdjust('floor', value, exp);
};

helpers.ceil10 = function(value, exp) {
  return helpers.decimalAdjust('ceil', value, exp);
};

// [String] -> [Float]
helpers.toFloats = function(arr) {
  console.assert(_.isArray(arr));
  return arr.map(function(str) {
    console.assert(_.isString(str));
    return parseFloat(str, 10);
  });
};

// Adds commas to a number, returns string
helpers.commafy = function(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};


helpers.payTableToEdge = (function() {
  var binom = function(n,k) {
    k = Math.min(k, n - k);
    console.assert(k >= 0);

    var r = 1;
    for (var i = 0; i < k; ++i)
      r = (r * (n - i)) / (i + 1);
    return r;
  };

  return function _payTableToEdge(table) {
    var possibilities = Math.pow(2, table.length-1);
    var ev = -1;
    table.forEach(function(payout, i) {
      var x = binom(table.length-1, i);
      // console.log('There is a: ' + x + ' in ' + possibilities + ' of it landing on ' + payout);
      var prob = x/possibilities;

      ev += prob * payout;
    });

    // console.log('House edge: ', -ev*100, '%');
    return -ev*100;
  };
})();

helpers.isValidPayout = (function() {
  var re = /^(\d\.\d{0,2})$|^(\d\d\.\d{0,1})$|^(\d{1,4})$/;
  return function _isValidPayout(str) {
    return re.test(str);
  };
})();

// A Moneypot API abstraction for faucet
//
// Moneypot's API docs: https://www.moneypot.com/api-docs
var MoneyPot = (function() {

  var o = {};

  o.apiVersion = 'v1';
  // method: 'GET' | 'POST' | ...
  // endpoint: '/tokens/abcd-efgh-...'
  var noop = function() {};
  var makeMPRequest = function(method, bodyParams, endpoint, callbacks, overrideOpts) {

    if (!worldStore.state.auth_id)
      throw new Error('Must have auth_id set to call MoneyPot API');

    var url = config.mp_api_uri + '/' + o.apiVersion + endpoint;

    if (worldStore.state.auth_id) {
      url = url + '?auth_id=' + worldStore.state.auth_id;
    }

    var ajaxOpts = {
      url:      url,
      dataType: 'json', // data type of response
      method:   method,
      data:     bodyParams ? JSON.stringify(bodyParams) : undefined,
      // By using text/plain, even though this is a JSON request,
      // we avoid preflight request. (Moneypot explicitly supports this)
      headers: {
        'Content-Type': 'text/plain'
      },
      // Callbacks
      success:  callbacks.success || noop,
      error:    callbacks.error || noop,
      complete: callbacks.complete || noop
    };

    $.ajax(_.merge({}, ajaxOpts, overrideOpts || {}));
  };
  // gRecaptchaResponse is string response from google server
  // `callbacks.success` signature	is fn({ claim_id: Int, amoutn: Satoshis })
  o.claimFaucet = function(gRecaptchaResponse, callbacks) {
    console.log('Hitting POST /claim-faucet');
    var endpoint = '/claim-faucet';
    var body = { response: gRecaptchaResponse };
    makeMPRequest('POST', body, endpoint, callbacks);
  };

  return o;
})();


var Dispatcher = new (function() {
  // Map of actionName -> [Callback]
  this.callbacks = {};

  var self = this;

  // Hook up a store's callback to receive dispatched actions from dispatcher
  this.registerCallback = function(actionName, cb) {
    //console.log('[Dispatcher] registering callback for:', actionName);

    if (!self.callbacks[actionName]) {
      self.callbacks[actionName] = [cb];
    } else {
      self.callbacks[actionName].push(cb);
    }
  };

  this.sendAction = function(actionName, payload) {
    //console.log('[Dispatcher] received action:', actionName, payload);

    // Ensure this action has 1+ registered callbacks
    if (!self.callbacks[actionName]) {
      throw new Error('Unsupported actionName: ' + actionName);
    }

    // Dispatch payload to each registered callback for this action
    self.callbacks[actionName].forEach(function(cb) {
      cb(payload);
    });
  };
});

////////////////////////////////////////////////////////////

var Store = function(storeName, initState, initCallback) {

  this.state = initState;
  this.emitter = new EventEmitter();

  // Execute callback immediately once store (above state) is setup
  // This callback should be used by the store to register its callbacks
  // to the dispatcher upon initialization
  initCallback.call(this);

  var self = this;

  // Allow components to listen to store events (i.e. its 'change' event)
  this.on = function(eventName, cb) {
    self.emitter.on(eventName, cb);
  };

  this.off = function(eventName, cb) {
    self.emitter.off(eventName, cb);
  };
};

////////////////////////////////////////////////////////////

// Manage auth_id //////////////////////////////////////
//
// - If auth_id is in url, save it into localStorage.
//   `expires_in` (seconds until expiration) will also exist in url
//   so turn it into a date that we can compare

var auth_id, access_token, expires_in, expires_at;
var confidential_token = helpers.getHashParams().confidential_token;
//if (helpers.getHashParams().confidential_token)
if(confidential_token) {
  console.log('[token manager] access_token in hash params');
//  localStorage.auth_id = null;
//  localStorage.access_token = null;
//  localStorage.expires_at = null;
  //get_auth_id();
} else if (localStorage.auth_id) {
  console.log('[token manager] auth_id in localStorage');
  auth_id = localStorage.auth_id;
  access_token = localStorage.access_token;
} else {
  console.log('[token manager] no auth_id');
}

// Scrub fragment params from url.
if (window.history && window.history.replaceState) {
  window.history.replaceState({}, document.title, "/");
} else {
  // For browsers that don't support html5 history api, just do it the old
  // fashioned way that leaves a trailing '#' in the url
  window.location.hash = '#';
}
////////////////////////
var linkmute = true;
var chatStore = new Store('chat', {
  messages: new CBuffer(config.chat_buffer_size),
  waitingForServer: false,
  userList: {},
  showChat: true,
  showUserList: false,
  loadingInitialMessages: true,
  sent_to: 0,
  message_key: genUuid(),
//  input_string: {str:''},
  newmsg: false,
  chatinit: false
}, function() {
  var self = this;

  Dispatcher.registerCallback('UPDATE_INPUT_STRING', function(newstring) {
    self.state.input_string = _.merge({}, self.state.input_string, newstring);
    self.emitter.emit('inputchange', self.state);
  });
  Dispatcher.registerCallback('CLEAR_INPUT_STRING', function() {
    self.state.input_string = '';
    self.emitter.emit('inputchange', self.state);
  });

  Dispatcher.registerCallback('SET_NEWMSG', function() {
    self.state.newmsg = true;
    self.emitter.emit('change', self.state);
  });
  Dispatcher.registerCallback('CLEAR_NEWMSG', function() {
    self.state.newmsg = false;
    self.emitter.emit('change', self.state);
  });


  // `data` is object received from socket auth
  Dispatcher.registerCallback('INIT_CHAT', function(data) {
    console.log('[ChatStore] received INIT_CHAT');
    // Give each one unique id
      //self.state.message_key = genUuid();
    var messages = data.chat.messages.map(function(message) {
      message.id = genUuid();//self.state.message_key;
      //self.state.message_key = genUuid();
      return message;
    });

    // Reset the CBuffer since this event may fire multiple times,
    // e.g. upon every reconnection to chat-server.
    self.state.messages.empty();
    self.state.messages.push.apply(self.state.messages, messages);
    self.state.messages.toArray().map(function(m) { m.id = genUuid();}); //console.log(m.id);});

    // Indicate that we're done with initial fetch
    self.state.loadingInitialMessages = false;

    // Load userList

    //self.state.userList = data.chat.userlist;

    for (var x = 0; x < data.chat.userlist.length; x++){
      self.state.userList[data.chat.userlist[x].uname] = data.chat.userlist[x];
    }
    linkmute = true;
    setTimeout(function(){linkmute = false;},3000);
    self.emitter.emit('change', self.state);
    self.emitter.emit('init');
  });

  Dispatcher.registerCallback('NEW_MESSAGE', function(message) {
    console.log('[ChatStore] received NEW_MESSAGE');
    message.id = self.state.message_key;
    self.state.messages.push(message);
    self.state.message_key = genUuid();
    self.state.waitingForServer = false;
    self.emitter.emit('change', self.state);
    self.emitter.emit('new_message');

  });

  Dispatcher.registerCallback('TOGGLE_CHAT_USERLIST', function() {
    console.log('[ChatStore] received TOGGLE_CHAT_USERLIST');
    self.state.showUserList = !self.state.showUserList;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('TOGGLE_CHAT', function() {
    console.log('[ChatStore] received TOGGLE_CHAT');
    self.state.showChat = !self.state.showChat;
    self.emitter.emit('change', self.state);
  });

  // user is { id: Int, uname: String, role: 'admin' | 'mod' | 'owner' | 'member' }
  Dispatcher.registerCallback('USER_JOINED', function(user) {
    console.log('[ChatStore] received USER_JOINED:', user);
    var match = false;

    for (var x = 0; x < Object.keys(self.state.userList).length; x++)
      {
        if (self.state.userList[x] != undefined){
          if (self.state.userList[x].uname == user.uname){
                match = true;
              }
          }else if (self.state.userList[user.uname] != undefined){
            if (self.state.userList[user.uname].uname == user.uname){
              match = true;
            }
          }
      }
    if (match == false){
    self.state.userList[user.uname] = user;
    self.emitter.emit('change', self.state);
    }
  });

  // user is { id: Int, uname: String, role: 'admin' | 'mod' | 'owner' | 'member' }
  Dispatcher.registerCallback('USER_LEFT', function(user) {
    console.log('[ChatStore] received USER_LEFT:', user);

    for (var x = 0; x < Object.keys(self.state.userList).length; x++)
      {
        if (self.state.userList[x] != undefined){
          if (self.state.userList[x].uname == user.uname){
                delete self.state.userList[x];
              }
          }else if (self.state.userList[user.uname] != undefined){
            if (self.state.userList[user.uname].uname == user.uname){
              delete self.state.userList[user.uname];
            }
          }
      }


    self.emitter.emit('change', self.state);
  });

  // Message is { text: String }
  Dispatcher.registerCallback('SEND_MESSAGE', function(text) {
    if (text.substring(0, 1) == '/') {
      // TIP CODE HERE
    Dispatcher.sendAction('PARSE_COMMAND',text);
    }
    else{
      console.log('[ChatStore] received SEND_MESSAGE');
      self.state.waitingForServer = true;
      self.emitter.emit('change', self.state);
      socket.emit('new_message', { text: text }, function(err) {
          if (err) { alert('Chat Error: ' + err); }
          });
      }
    });

    Dispatcher.registerCallback('SEND_TIP',function(text){
      var error = null;
      var send_private = false;
      var tipres = text.split(" ");
      var coin_type_send = tipres[3];
      var tipamount;// = Math.round(parseFloat(tipres[2]) * 1e8);
      var tipto = tipres[1];
      var d = new Date();

      if ((tipres[4] === 'PRIVATE')||(tipres[4] === 'private')){
      send_private = true;
      }

      if ((coin_type_send === 'BITS')||(coin_type_send === 'bits')){
        tipamount = (parseFloat(tipres[2]) * 100);
      }else if((coin_type_send === 'BTC')||(coin_type_send === 'btc')){
        tipamount = Math.round(parseFloat(tipres[2]) * 1e8);
      }else{
        error = "Invalid Coin Type use BITS or BTC";
      }

      if (worldStore.state.user.balance < tipamount){
          error = "BALANCE TOO LOW";
        }
      else if (tipamount < 100){
          error = worldStore.state.coin_type === 'BITS' ? "MUST SEND MORE THAN 1 BIT" : "MUST SEND MORE THAN 0.000001 BTC";
        }


      // send tip to moneypot
      if (!error){
        var params = {
            uname: tipto,
            amount: tipamount
          };
        socket.emit('send_tip', params, function(err, data) {
          if (err) {
            console.log('[socket] send_tip error:', err);
            return;
          }
          Dispatcher.sendAction('UPDATE_USER', { balance: worldStore.state.user.balance - tipamount});
          console.log('Successfully made tip: '+tipres[2]+' to '+tipto);

          text = "Sent: "+tipres[2] + " " + coin_type_send + " to " +tipto;
          if (send_private){
            Dispatcher.sendAction('NEW_MESSAGE', {channel: "lobby", text:text, created_at: d.toJSON(),user:{role: "BOT", uname: "PRIVATE"} });
          }else{
            self.state.waitingForServer = true;
            self.emitter.emit('change', self.state);
            socket.emit('new_message', { text: text }, function(err) {
              if (err) {
                alert('Chat Error: ' + err);
              }
            });
          }
        });
      }else {
        Dispatcher.sendAction('NEW_MESSAGE', {channel: "lobby", text:error, created_at: d.toJSON(),user:{role: "BOT", uname: "ERROR"}});
      }
    });

    // /rain [amount] [coin]
    Dispatcher.registerCallback('SEND_RAIN',function(text){
      var error = null;
      var tipres = text.split(" ");
      var coin_type_send = tipres[2];
      var totalrain;  //in sats
      var tipamount;  //in sats
      var tipto;// = tipres[1];
      var tiplist = [];
      var d = new Date();

      if ((coin_type_send === 'BITS')||(coin_type_send === 'bits')){
        coin_type_send = 'BITS';
        totalrain = (parseFloat(tipres[1]) * 100);
      }else if((coin_type_send === 'BTC')||(coin_type_send === 'btc')){
        coin_type_send = 'BTC';
        totalrain = Math.round(parseFloat(tipres[1]) * 1e8);
      }else{
        error = "Invalid Coin Type use BITS or BTC";
      }

      if (Object.keys(chatStore.state.userList).length > 1){
        tipamount = totalrain / (Object.keys(chatStore.state.userList).length - 1);
        _.values(chatStore.state.userList).map(function(u) {
            if (u.uname != worldStore.state.user.uname)
              {
                tiplist.push(u.uname);
              }
        })

      }else {
        error = "NOT ENOUGH USERS TO RAIN";
        tipamount = 0;
      }

      if (worldStore.state.user.balance < tipamount){
          error = "BALANCE TOO LOW TO FINISH RAINING";
          tipamount = 0;
        }
      else if (tipamount < 100){
          error = worldStore.state.coin_type === 'BITS' ? "MUST SEND MORE THAN 1 BIT TO EACH USER" : "MUST SEND MORE THAN 0.000001 BTC TO EACH USER";
          tipamount = 0;
        }

      // send tip to moneypot
      if ((!error) && (tipamount > 99)){

        tipto = tiplist[self.state.sent_to];

        var params = {
            amount: totalrain,
            type: coin_type_send
          };
        socket.emit('send_rain', params, function(err, data) {
            if (err) {
              console.log('[socket] send_rain error:', err);
              Dispatcher.sendAction('NEW_MESSAGE', {channel: "lobby", text:err, created_at: d.toJSON(),user:{role: "BOT", uname: "ERROR"}});
              return;
            }
            Dispatcher.sendAction('UPDATE_USER', { balance: worldStore.state.user.balance - totalrain});
            console.log('Successfully sent rain:', data);

          });

      }else {
        Dispatcher.sendAction('NEW_MESSAGE', {channel: "lobby", text:error, created_at: d.toJSON(),user:{role: "BOT", uname: "ERROR"}});
      }

    });

    function changeCSS(cssFile, cssLinkIndex) {
      var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);
      var newlink = document.createElement("link");
      newlink.setAttribute("rel", "stylesheet");
      newlink.setAttribute("type", "text/css");
      newlink.setAttribute("href", cssFile);
      document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
      }

    Dispatcher.registerCallback('PARSE_COMMAND',function(text){
      var error = null;
      var tipres = text.split(" ");
      var totalrain;
      var d = new Date();
      var coin_type_send = tipres[2];


      if (text.substring(0, 4) == "/tip") {
        Dispatcher.sendAction('SEND_TIP',text);
      }
      else if (text.substring(0, 5) == "/rain"){
        self.state.sent_to = 0;
        if ((coin_type_send === 'BITS')||(coin_type_send === 'bits')){
              totalrain = (parseFloat(tipres[1]) * 100);
            }else if((coin_type_send === 'BTC')||(coin_type_send === 'btc')){
              totalrain = Math.round(parseFloat(tipres[1]) * 1e8);
            }else{
                  error = "Invalid Coin Type use BITS or BTC";
                }
        if (totalrain > worldStore.state.user.balance)
              {
              error = "BALANCE TOO LOW";
              }
        if (!error){
          Dispatcher.sendAction('SEND_RAIN',text);
          }
        else{
          Dispatcher.sendAction('NEW_MESSAGE', {channel: "lobby", text:error, created_at: d.toJSON(),user:{role: "BOT", uname: "ERROR"}});
        }
      }else if (text.substring(0, 6) == "/light"){
        changeCSS('https://bootswatch.com/sandstone/bootstrap.min.css', 0);
      }
      else if (text.substring(0, 5) == "/dark"){
        changeCSS('https://bootswatch.com/cyborg/bootstrap.min.css', 0);
      }
      else if (text.substring(0, 5) == "/help"){
        text = "Commands Available:";
        Dispatcher.sendAction('NEW_MESSAGE', {channel: "lobby", text:text, created_at: d.toJSON(),user:{role: "BOT", uname: "HELP"} });
        text = "/tip [user] [amount] [type]";
        Dispatcher.sendAction('NEW_MESSAGE', {channel: "lobby", text:text, created_at: d.toJSON(),user:{role: "BOT", uname: "HELP"} });
        text = "/rain [amount] [type]";
        Dispatcher.sendAction('NEW_MESSAGE', {channel: "lobby", text:text, created_at: d.toJSON(),user:{role: "BOT", uname: "HELP"} });
        text = "/light and /dark";
        Dispatcher.sendAction('NEW_MESSAGE', {channel: "lobby", text:text, created_at: d.toJSON(),user:{role: "BOT", uname: "HELP"} });
      }
      else {  // SEND lINE MESSAGE IF COMMAND NOT RECOGNIZED
        console.log('Chat Command Not Recognized');
        self.state.waitingForServer = true;
        self.emitter.emit('change', self.state);
        socket.emit('new_message', { text: text }, function(err) {
          if (err) {
            alert('Chat Error: ' + err);
          }
        });
      }
    });


});

var firstseed = Math.floor(Math.random()*(Math.pow(2,32)));

var betStore = new Store('bet', {
  nextHash: undefined,
  lastHash: undefined,
  lastSalt: undefined,
  lastSecret: undefined,
  lastSeed: undefined,
  lastid: undefined,
  raw_outcome: undefined,
  wager: {
    str: '0.000001',
    num: 0.000001,
    error: undefined
  },
  ChanceInput: {
    str: '49.5000',
    num: 49.5000,
    error: undefined
  },
  multiplier: {
    str: '2.0000',
    num: 2.0000,
    error: undefined
  },
  clientSeed: {
    num: firstseed,
    str: firstseed.toString(),
    error:null
  },
  randomseed: false,
  pay_tables: {
    'ROW1': [2, 1.9, 1.8, 1.6, 1.45, 1.2, 1, 0.9, 0.8, 0.9, 1, 1.2, 1.45, 1.6, 1.8, 1.9, 2],
    'ROW2': [3, 1.5, 1.4, 1.3, 1.2, 0.2, 1.1, 1.1, 1.1, 1.1, 1.1, 0.2, 1.2, 1.3, 1.4, 1.5, 3],
    'ROW3': [23, 9, 3, 2, 1.5, 1.2, 1.1, 1, 0.4, 1, 1.1, 1.2, 1.5, 2, 3, 9, 23],
    'ROW4': [121, 47, 13, 5, 3, 1.4, 1, 0.5, 0.3, 0.5, 1, 1.4, 3, 5, 13, 47, 121],
    'ROW5': [999, 0, 50, 1, 1.2, 0, 1.1, 1.1, 0, 1.1, 1.1, 0, 1.2, 1, 50, 0, 999]
  },
  house_edge: config.house_edge,
  hotkeysEnabled: false,
  betVelocity: 150,
  rt_Outcome:{
    str: '14',
    num: 14,
    background: '#B50B32'//'#B50B32'
  },
  rt_TotalWager: 0,
  rt_ChipSize: 1,
  RollHistory:[3,21,1,26,16,0,8,23,7,10,0,16,5,24,13,18,3,2,19,31,14],
  BombSelect: 5,
  BS_Game:{
    state: 'STOP',
    bombs: 5,
    cleared: 0,
    stake: 100, //in sats
    next: 100, //in sats
  }
}, function() {
  var self = this;

  Dispatcher.registerCallback('SET_BOMBSELECT', function(num){
    if ((num > 0)&&(num < 25))
      {self.state.BombSelect = num;
        if ((num == 1)&&(self.state.house_edge > 0.039)){
          Dispatcher.sendAction('INC_HOUSE_EDGE');
        }
    self.emitter.emit('change', self.state);}

  });

  Dispatcher.registerCallback('START_BITSWEEP', function(){
    if ((self.state.BombSelect == 1)&&(self.state.house_edge > 0.039)){
      Dispatcher.sendAction('INC_HOUSE_EDGE');
    }
    self.state.BS_Game.state = 'RUNNING';
    self.state.BS_Game.bombs = self.state.BombSelect;
    self.state.BS_Game.cleared = 0;
    var chance = (25-self.state.BS_Game.bombs-self.state.BS_Game.cleared)/(25-self.state.BS_Game.cleared);
    self.state.BS_Game.stake = helpers.convCoinTypetoSats(self.state.wager.num);
    self.state.BS_Game.next = (self.state.BS_Game.stake * helpers.WinProbtoMultiplier(chance)) - self.state.BS_Game.stake;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('GET_NEXT_BITSWEEP', function(){
    self.state.BS_Game.cleared += 1;
    if (25-self.state.BS_Game.bombs-self.state.BS_Game.cleared <= 0){
      Dispatcher.sendAction('STOP_BITSWEEP');
    }
    else{
        var chance = (25-self.state.BS_Game.bombs-self.state.BS_Game.cleared)/(25-self.state.BS_Game.cleared);
        self.state.BS_Game.stake = self.state.BS_Game.stake + self.state.BS_Game.next;
        self.state.BS_Game.next = (self.state.BS_Game.stake * helpers.WinProbtoMultiplier(chance)) - self.state.BS_Game.stake;
    }
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('STOP_BITSWEEP', function(){
    self.state.BS_Game.state = 'STOP';
    self.state.BS_Game.stake = helpers.convCoinTypetoSats(self.state.wager.num);
    ShowAllBombs(self.state.BS_Game.cleared, self.state.BS_Game.bombs);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('TOGGLE_RND_SEED', function(){
    self.state.randomseed = !self.state.randomseed;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_PAY_TABLES', function(data) {
    self.state.pay_tables.ROW1 = data.ROW1;
    self.state.pay_tables.ROW2 = data.ROW2;
    self.state.pay_tables.ROW3 = data.ROW3;
    self.state.pay_tables.ROW4 = data.ROW4;
    self.state.pay_tables.ROW5 = data.ROW5;
    Dispatcher.sendAction('UPDATE_PLINKO');
  });

  ////////////
  Dispatcher.registerCallback('UPDATE_ROLLHISTORY', function(newroll){
    var color;
    self.state.RollHistory.shift();
    self.state.RollHistory.push(newroll);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_CHIPSIZE', function(newsize){
    self.state.rt_ChipSize = newsize;//_.merge({}, self.state.rt_ChipSize, newsize);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_TOTALWAGER', function(newwager){
    self.state.rt_TotalWager = newwager;//_.merge({}, self.state.rt_TotalWager, newwager);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_RT_OUTCOME', function(newOutcome) {
    self.state.rt_Outcome = _.merge({}, self.state.rt_Outcome, newOutcome);
    var n = parseInt(self.state.rt_Outcome.str, 10);
    if (isNaN(n)) {

    } else {
      self.state.rt_Outcome.str = n;
      self.state.rt_Outcome.num = n;
    }

    switch(self.state.rt_Outcome.num){
      case 0:
        self.state.rt_Outcome.background = '#009901';
        break;
      case 1:
      case 3:
      case 5:
      case 7:
      case 9:
      case 12:
      case 14:
      case 16:
      case 18:
      case 19:
      case 21:
      case 23:
      case 25:
      case 27:
      case 30:
      case 32:
      case 34:
      case 36:
        self.state.rt_Outcome.background = '#B50B32';
        break;
      default:
        self.state.rt_Outcome.background = 'black';
        break;
      }
    self.emitter.emit('change', self.state);
  });
  ////////////
  Dispatcher.registerCallback('INC_HOUSE_EDGE', function(){ //worldStore.state.currGameTab
    var he_limit = 0.05;
    if ((worldStore.state.currGameTab == 'BITSWEEP')&&(self.state.BombSelect == 1)){
      he_limit = 0.039;
    }else {
      he_limit = 0.05;
    }

    if (self.state.house_edge < he_limit){
        self.state.house_edge += 0.001;
        var winProb = helpers.multiplierToWinProb(self.state.multiplier.num);
        Dispatcher.sendAction('UPDATE_CHANCE_IN', {
                num: (winProb*100).toFixed(4),
                str: (winProb*100).toFixed(4).toString(),
                error: null
              });
        }else{
          self.state.house_edge = he_limit;
          var winProb = helpers.multiplierToWinProb(self.state.multiplier.num);
          Dispatcher.sendAction('UPDATE_CHANCE_IN', {
                  num: (winProb*100).toFixed(4),
                  str: (winProb*100).toFixed(4).toString(),
                  error: null
                });
        }
    Dispatcher.sendAction('UPDATE_BANKROLL');
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('DEC_HOUSE_EDGE', function(){
    if (self.state.house_edge > 0.008){
        self.state.house_edge -= 0.001;
        var winProb = helpers.multiplierToWinProb(self.state.multiplier.num);
        Dispatcher.sendAction('UPDATE_CHANCE_IN', {
                num: (winProb*100).toFixed(4),
                str: (winProb*100).toFixed(4).toString(),
                error: null
              });
        }
    Dispatcher.sendAction('UPDATE_BANKROLL');
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_CLIENT_SEED', function(newSeed) {
    self.state.clientSeed = _.merge({}, self.state.clientSeed, newSeed);

    var n = parseInt(self.state.clientSeed.str, 10);

    // If n is a number, ensure it's at least 1
    if (isFinite(n)) {
      n = Math.max(n, 1);
      self.state.clientSeed.str = n.toString();
    }

    // Ensure clientSeed is a number
    if (isNaN(n) || /[^\d]/.test(n.toString())) {
      self.state.clientSeed.error = 'INVALID_SEED';
    // Ensure clientSeed is less than max seed
    } else if (n > 4294967296) {
      self.state.clientSeed.error = 'SEED_TOO_HIGH';
      self.state.clientSeed.num = n;
    } else {
      // clientSeed is valid
      self.state.clientSeed.error = null;
      self.state.clientSeed.str = n.toString();
      self.state.clientSeed.num = n;
    }

    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('SET_NEXT_HASH', function(hexString) {
    self.state.nextHash = hexString;
    next_hash = hexString;
    self.emitter.emit('change', self.state);
    self.emitter.emit('lastfair_change', self.state);
  });

  Dispatcher.registerCallback('SET_LAST_FAIR', function(last_params) {
    self.state.lastHash = last_params.hash;
    self.state.lastSalt = last_params.salt;
    self.state.lastSecret = last_params.secret;
    self.state.lastSeed = last_params.seed;
    self.state.lastid = last_params.id;
    self.emitter.emit('lastfair_change', self.state);
  });

  Dispatcher.registerCallback('CALC_RAW_OUTCOME',function(){
  self.state.raw_outcome = ((self.state.lastSecret+self.state.lastSeed) % 4294967296);
  self.emitter.emit('lastfair_change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_LAST_HASH', function(str){
  self.state.lastHash = str;
  self.emitter.emit('lastfair_change', self.state);
  });
  Dispatcher.registerCallback('UPDATE_LAST_SALT', function(str){
  self.state.lastSalt = str;
  self.emitter.emit('lastfair_change', self.state);
  });
  Dispatcher.registerCallback('UPDATE_LAST_SECRET', function(str){
  self.state.lastSecret = str;
  self.emitter.emit('lastfair_change', self.state);
  });
  Dispatcher.registerCallback('UPDATE_LAST_SEED', function(str){
  self.state.lastSeed = str;
  self.emitter.emit('lastfair_change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_WAGER', function(newWager) {
    self.state.wager = _.merge({}, self.state.wager, newWager);

    var n = parseFloat(self.state.wager.str, 10);

    var isFloatRegexp = /^(\d*\.)?\d+$/;


    if (worldStore.state.coin_type === 'BITS'){
    // Ensure wagerString is a number
    //if (isNaN(n) || /[^\d]/.test(n.toString())) {
    if (isNaN(n) || !isFloatRegexp.test(n.toString())) {
      self.state.wager.error = 'INVALID_WAGER';
    // Ensure user can afford balance
    } else if (n < 0.01){
      self.state.wager.error = 'INVALID_WAGER';
    } else if (helpers.getPrecision(n) > 2) {
      self.state.wager.error = 'INVALID_WAGER';
    } else if (n * 100 > worldStore.state.user.balance) {
      self.state.wager.error = 'CANNOT_AFFORD_WAGER';
      self.state.wager.num = n;
    } else {
      // wagerString is valid
      self.state.wager.error = null;
      self.state.wager.str = n.toFixed(2).toString();
      self.state.wager.num = n;
    }
  }else{
    if (isNaN(n)) {
      self.state.wager.error = 'INVALID_WAGER';
    // Ensure user can afford balance
    } else if (n < 0.00000001){
      self.state.wager.error = 'INVALID_WAGER';
    } else if (helpers.getPrecision(n) > 8) {
      self.state.wager.error = 'INVALID_WAGER';
    } else if (n / 0.00000001 > worldStore.state.user.balance) {
      self.state.wager.error = 'CANNOT_AFFORD_WAGER';
      self.state.wager.num = n;
    } else {
      // wagerString is valid
      self.state.wager.error = null;
      self.state.wager.str = n.toFixed(8).toString();
      self.state.wager.num = n;
    }
  }


    self.emitter.emit('change', self.state);
  });
  Dispatcher.registerCallback('UPDATE_MULTIPLIER', function(newMult) {
    self.state.multiplier = _.merge({}, self.state.multiplier, newMult);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_CHANCE_IN', function(newChance) {
    self.state.ChanceInput = _.merge({}, self.state.ChanceInput, newChance);
    self.emitter.emit('change', self.state);
  });

});

// The general store that holds all things until they are separated
// into smaller stores for performance.
var worldStore = new Store('world', {
  isLoading: true,
  user: undefined,
  auth_id: auth_id,
  accessToken: access_token,
  hotkeysEnabled: false,
  currTab: 'ALL_BETS',
  currGameTab: 'DICE_GAME',
  coin_type:'BTC',
  first_bet: false,
  bets: new CBuffer(config.bet_buffer_size),
  allBets: new CBuffer(config.bet_buffer_size),

  LiveGraph: false,
  grecaptcha: undefined,
  bankrollbalance: 0.0,
  bankrollwagered: 0.0,
  bankrollinvested: 0.0,
  filterwager: {
    str: '0',
    num: 0.0,
    error: undefined
  },
  filterprofit: {
    str: '0',
    num: 0.0,
    error: undefined
  },
  filteruser: {
    str: 'User',
    error: undefined
  },
  filtergame: 'ALL GAMES',
  activePucks: {},
  // Pucks to render
  // Remove from this when they're done animating
  renderedPucks: {},
  // Used to show the latest X bets in the My Bets tab
  pucks: new CBuffer(50),
  plinko_running: false,
  rt_spin_running: false,
  payout_level: undefined,
  showwin: false,
  revealed_balance: 0,
  showPayoutEditor: false,
  showClassic: true,
  currentAppwager: 0,
  jackpotlist: new CBuffer(10),
  biggestwins: new CBuffer(10),
  biggestlosses: new CBuffer(10),
  biggestwagered: new CBuffer(10),
  biggestprofit: new CBuffer(10),
  biggestjackpots: new CBuffer(10)
}, function() {
  var self = this;

  Dispatcher.registerCallback('UPDATE_AUTH_ID', function(data) {
  //auth_id = localStorage.auth_id;
  auth_id = data.auth.id;
  access_token = data.token;
  expires_in = data.expires_in;
  expires_at = new Date(Date.now() + (expires_in * 1000));
  self.state.auth_id = auth_id;
  self.state.accessToken = access_token;
  self.state.user = data.auth.user;
  console.log('auth_id_set', data);
  localStorage.setItem('auth_id', auth_id);
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('expires_at', expires_at);
  self.emitter.emit('change', self.state);

});

Dispatcher.registerCallback('UPDATE_APP_INFO', function() {

socket.emit('app_info', function(err, data) {
  if (err) {
    console.log('[socket] app_info erro:', err);
    return;
  }
  console.log('[socket] app_info success:', data);
  self.state.currentAppwager = data.wagered;

  socket.emit('jackpot_data', function(err, data) {
    if (err) {
      console.log('[socket] jackpot_data erro:', err);
      return;
    }
    console.log('[socket] jackpot_data success:', data);
    console.assert(_.isArray(data));
    self.state.jackpotlist.empty();
    self.state.jackpotlist.push.apply(self.state.jackpotlist, data);

    self.emitter.emit('app_info_update', self.state);
    });

  });

});

Dispatcher.registerCallback('UPDATE_BIGGEST_INFO', function() {
//  self.state.biggestwins
//  self.state.biggestlosses
//  self.state.biggestwagered

socket.emit('biggestwin_info', function(err, data) {
  if (err) {
    console.log('[socket] app_info erro:', err);
    return;
  }
  console.log('[socket] biggestwin_info success:', data);
  //self.state.currentAppwager = data.wagered;
//  console.assert(_.isArray(data));
  self.state.biggestwins.empty();
  self.state.biggestlosses.empty();
  self.state.biggestwagered.empty();
  self.state.biggestprofit.empty();
  self.state.biggestjackpots.empty();
  self.state.biggestwins.push.apply(self.state.biggestwins, data.biggestwins);
  self.state.biggestlosses.push.apply(self.state.biggestlosses, data.biggestlosses);
  self.state.biggestwagered.push.apply(self.state.biggestwagered, data.biggestwagered);
  self.state.biggestprofit.push.apply(self.state.biggestprofit, data.biggestprofit);
  self.state.biggestjackpots.push.apply(self.state.biggestjackpots, data.biggestjackpots);

  self.emitter.emit('biggest_info_update', self.state);

  });

});



Dispatcher.registerCallback('INIT_USER', function(data) {
self.state.user = data.user;
self.emitter.emit('change', self.state);
});

  // data is object, note, assumes user is already an object
  Dispatcher.registerCallback('UPDATE_USER', function(data) {
    self.state.user = _.merge({}, self.state.user, data);
    self.emitter.emit('change', self.state);
  });

  // deprecate in favor of SET_USER
  Dispatcher.registerCallback('USER_LOGIN', function(user) {
    self.state.user = user;
    self.emitter.emit('change', self.state);
    self.emitter.emit('user_update');
  });

  // Replace with CLEAR_USER
  Dispatcher.registerCallback('USER_LOGOUT', function() {
    self.state.user = undefined;
    self.state.accessToken = undefined;
    localStorage.removeItem('expires_at');
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth_id');
    //self.state.bets.empty();
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('START_LOADING', function() {
    self.state.isLoading = true;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('STOP_LOADING', function() {
    self.state.isLoading = false;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('GRECAPTCHA_LOADED', function(_grecaptcha) {
    self.state.grecaptcha = _grecaptcha;
    self.emitter.emit('grecaptcha_loaded');
  });

  Dispatcher.registerCallback('UPDATE_FILTER_WAGER', function(newfilter) {
    self.state.filterwager = _.merge({}, self.state.filterwager, newfilter);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_FILTER_PROFIT', function(newfilter) {
    self.state.filterprofit= _.merge({}, self.state.filterprofit, newfilter);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_FILTER_USER', function(newfilter) {
    self.state.filteruser= _.merge({}, self.state.filteruser, newfilter);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('TOGGLE_GAME_FILTER',function(){
    //filtergame: 'ALL GAMES'
    switch(self.state.filtergame){
      case 'ALL GAMES':
        self.state.filtergame = 'DICE';
        break;
      case 'DICE':
        self.state.filtergame = 'PLINKO';
        break;
      case 'PLINKO':
        self.state.filtergame = 'ROULETTE';
        break;
      case 'ROULETTE':
        self.state.filtergame = 'BITSWEEP';
        break;
      case 'BITSWEEP':
        self.state.filtergame = 'ALL GAMES';
        break;
      default:
        self.state.filtergame = 'ALL GAMES';
        break;
    }
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('LOAD_CHART_DATA', function() {
    data1.datasets[0].data = getuserbets(config.bet_buffer_size);
    self.emitter.emit('bet_history_change', self.state);
  });

  Dispatcher.registerCallback('TOGGLE_COIN_TYPE', function() {
      var n = 0.01;

      if (!AutobetStore.state.Run_Autobet)
        {
          self.state.coin_type === 'BITS' ? self.state.coin_type = 'BTC' : self.state.coin_type = 'BITS';

          n = self.state.coin_type === 'BITS' ?  (betStore.state.wager.num * 1000000).toFixed(2) : (betStore.state.wager.num * 0.000001).toFixed(8);
          Dispatcher.sendAction('UPDATE_WAGER', { str: n.toString() });

          n = self.state.coin_type === 'BITS' ?  (AutobetStore.state.stophigher.num * 1000000).toFixed(2) : (AutobetStore.state.stophigher.num * 0.000001).toFixed(8);
          Dispatcher.sendAction('UPDATE_AUTO_STOPHIGHER', { str: n.toString(),
                                                          num: n
                                                          });

          n = self.state.coin_type === 'BITS' ?  (AutobetStore.state.stoplower.num * 1000000).toFixed(2) : (AutobetStore.state.stoplower.num * 0.000001).toFixed(8);
          Dispatcher.sendAction('UPDATE_AUTO_STOPLOWER', { str: n.toString(),
                                                          num: n
                                                          });

          n = self.state.coin_type === 'BITS' ?  (self.state.filterwager.num * 1000000).toFixed(2) : (self.state.filterwager.num * 0.000001).toFixed(8);
          Dispatcher.sendAction('UPDATE_FILTER_WAGER', { str: n.toString(),
                                                          num: n
                                                          });

          n = self.state.coin_type === 'BITS' ?  (self.state.filterprofit.num * 1000000).toFixed(2) : (self.state.filterprofit.num * 0.000001).toFixed(8);
          Dispatcher.sendAction('UPDATE_FILTER_PROFIT', { str: n.toString(),
                                                          num: n
                                                          });

          self.emitter.emit('change', self.state);
          self.emitter.emit('new_all_bet', self.state);
          self.emitter.emit('new_user_bet', self.state);
          self.emitter.emit('app_info_update', self.state);
          self.emitter.emit('biggest_info_update', self.state);
        }

    });

//////////
Dispatcher.registerCallback('START_ROULETTE',function(){
  self.state.rt_spin_running = true;
});

Dispatcher.registerCallback('STOP_ROULETTE',function(){
  self.state.rt_spin_running = false;
  self.emitter.emit('change', self.state);
});

Dispatcher.registerCallback('TOGGLE_LIVE_CHART', function() {
  self.state.LiveGraph = !self.state.LiveGraph;
  self.emitter.emit('bet_history_change', self.state);
});

Dispatcher.registerCallback('NEW_CHART_DATAPOINT', function(newnum) {
  var n = (Number(data1.datasets[0].data[data1.datasets[0].data.length - 1]) + Number(newnum));

  if (data1.labels.length < 100)
  {
    data1.labels.push(' ');
  }
  else{
  data1.datasets[0].data.shift();
  }
  data1.datasets[0].data.push(n);

  self.emitter.emit('bet_history_change', self.state);
});

//  Dispatcher.registerCallback('CLEAR_NEW_BET_HISTORY', function() {
//    self.state.newbetdata = false;
//    self.emitter.emit('bet_history_change', self.state);
//  });

Dispatcher.registerCallback('UPDATE_HISTORY', function() { //worldStore.state.chartbusy
  self.emitter.emit('bet_history_change', self.state);
});
////////////////////////////////////////////////////////////////////////
Dispatcher.registerCallback('TOGGLE_BOARD_TYPE', function(){
self.state.showClassic = !self.state.showClassic;
self.emitter.emit('plinko_board_change', self.state);
});

Dispatcher.registerCallback('UPDATE_PLINKO', function() { //worldStore.state.chartbusy
self.emitter.emit('plinko_game_change', self.state);
});

Dispatcher.registerCallback('SET_PLINKO_WIN', function() { //worldStore.state.chartbusy
//  self.emitter.emit('plinko_game_change', self.state);
self.state.showwin = true;
});

Dispatcher.registerCallback('CLEAR_PLINKO_WIN', function() { //worldStore.state.chartbusy
//  self.emitter.emit('plinko_game_change', self.state);
self.state.showwin = false;
});

Dispatcher.registerCallback('SET_REVEALED_BALANCE', function() {
var stillAnimatingPucks = _.keys(worldStore.state.renderedPucks).length > 0;
if (stillAnimatingPucks)
  {
  self.state.revealed_balance = self.state.revealed_balance;
}else{
  self.state.revealed_balance = self.state.user.balance;
}
});

Dispatcher.registerCallback('UPDATE_REVEALED_BALANCE', function(profit) {
  self.state.revealed_balance = self.state.revealed_balance + profit;
});

Dispatcher.registerCallback('RESET_PLINKO', function() {
data2.datasets[0].labels = labelfill(config.c),
data2.datasets[0].data = plinkobase(config.c);
self.state.plinko_running = false;
self.emitter.emit('plinko_game_change', self.state);
self.emitter.emit('change', self.state);
});

Dispatcher.registerCallback('TOGGLE_PAYOUT_EDITOR', function() {
self.state.showPayoutEditor = !self.state.showPayoutEditor;
self.emitter.emit('plinko_payout_change', self.state);
self.emitter.emit('plinko_game_change', self.state);
self.emitter.emit('change', self.state);
});

Dispatcher.registerCallback('SPAWN_PEAK', function(data) {
self.state.plinko_running = true;
self.state.payout_level = data.color;
//console.log('Spawning', data.color, 'puck...');
var path = data.path || generatePath();
var peak = new Peak({
  path: path,
  color: data.color,

  wager_satoshis: data.wager_satoshis,
  profit_satoshis: data.profit_satoshis,
  isTest: data.isTest,
  bet: data.bet,
  isFair: data.isFair,
  // When peak hits a peg
  onPeg: function(peak) {
  },
  // As soon as peak lands in a slot
  onSlot: function(peak) {
    delete worldStore.state.activePucks[peak.id];
    // ignore test pucks
    if (peak.isTest) {
      return;
    }
    // And also force wager validation now that balance is updated
    Dispatcher.sendAction('UPDATE_WAGER', {
      str: betStore.state.wager.str
    });
  Dispatcher.sendAction('NEW_BET', peak.bet);
  Dispatcher.sendAction('NEW_ALL_BET', peak.bet);
  },
  // When puck is finished animating and must be removed from board
  onComplete: function(peak) {
    delete worldStore.state.renderedPucks[peak.id];
  if (!worldStore.state.first_bet)
    {Dispatcher.sendAction('SET_FIRST');}
  self.emitter.emit('plinko_game_change', self.state);
  self.emitter.emit('change', self.state);
  }
});

// Don't add testpucks to history
if (!peak.isTest) {
  worldStore.state.pucks.push(peak);
}

worldStore.state.activePucks[peak.id] = peak;
worldStore.state.renderedPucks[peak.id] = peak;

peak.run();
self.emitter.emit('plinko_game_change', self.state);
});

// data.color: 'red' | 'green' | ...
// data.path: Array of 'L' and 'R'
// data.wager_satoshis: Int
// data.profit_satoshis: Int (satoshis)
// data.isTest: Bool - for 0 wager pucks that shouldn't hit the Moneypot
//   server. Intended to let unloggedin users play with the site.
// data.isFair: Bool
Dispatcher.registerCallback('SPAWN_PUCK', function(data) {

var path = data.path || generatePath();
var puck = new Puck({
  path: path,
  color: data.color,
  wager_satoshis: data.wager_satoshis,
  profit_satoshis: data.profit_satoshis,
  isTest: data.isTest,
  bet: data.bet,
  isFair: data.isFair,
  // When puck hits a peg
  onPeg: function(puck) {
  },
  // As soon as puck lands in a slot
  onSlot: function(puck) {
    Dispatcher.sendAction('UPDATE_REVEALED_BALANCE', data.profit_satoshis);
    delete worldStore.state.activePucks[puck.id];
    // ignore test pucks
    if (puck.isTest) {
      return;
    }

    // And also force wager validation now that balance is updated
    Dispatcher.sendAction('UPDATE_WAGER', {
      str: betStore.state.wager.str
    });
    Dispatcher.sendAction('NEW_BET', puck.bet);
  //  Dispatcher.sendAction('NEW_ALL_BET', puck.bet);
  },
  // When puck is finished animating and must be removed from board
  onComplete: function(puck) {
    delete worldStore.state.renderedPucks[puck.id];
    if (!worldStore.state.first_bet)
      {Dispatcher.sendAction('SET_FIRST');}
    self.emitter.emit('plinko_render_change', self.state);
    self.emitter.emit('change', self.state);
  }
});

// Don't add testpucks to history
if (!puck.isTest) {
  worldStore.state.pucks.push(puck);
}

worldStore.state.activePucks[puck.id] = puck;

worldStore.state.renderedPucks[puck.id] = puck;
self.emitter.emit('plinko_render_change', self.state);

puck.run();
self.emitter.emit('change', self.state);
});

Dispatcher.registerCallback('SET_FIRST', function(data) {
  self.state.first_bet = true;
  self.emitter.emit('change', self.state);
});

Dispatcher.registerCallback('CHANGE_TAB', function(tabName) {
  console.assert(typeof tabName === 'string');
  self.state.currTab = tabName;
  self.emitter.emit('change_tab', self.state);
});

Dispatcher.registerCallback('CHANGE_GAME_TAB', function(GametabName) {
  console.assert(typeof GametabName === 'string');
  self.state.currGameTab = GametabName;
  self.emitter.emit('change_tab', self.state);
});

// This is only for my bets? Then change to 'NEW_MY_BET'
Dispatcher.registerCallback('NEW_BET', function(bet) {
  console.assert(typeof bet === 'object');
//  self.state.bets.shift();
  self.state.bets.push(bet);
  if (self.state.LiveGraph)
    {
    Dispatcher.sendAction('NEW_CHART_DATAPOINT',helpers.convSatstoCointype(bet.profit));
    Dispatcher.sendAction('UPDATE_USERSTATS');
    }
  self.emitter.emit('new_user_bet', self.state);
});

Dispatcher.registerCallback('NEW_ALL_BET', function(betarray) {
  var wasnew = false;

  betarray.map(function(bet){
    self.state.currentAppwager += bet.wager;
    self.emitter.emit('app_info_update', self.state);
  if ((helpers.convSatstoCointype(bet.profit) <  worldStore.state.filterprofit.num) && (worldStore.state.filterprofit.num != 0) && (worldStore.state.filterprofit.num != null) && (!worldStore.state.filterprofit.error))
    {
    return;
    }
  else if ((helpers.convSatstoCointype(bet.wager) <  worldStore.state.filterwager.num) && (worldStore.state.filterwager.num != 0) && (worldStore.state.filterwager.num != null) && (!worldStore.state.filterwager.error))
      {
      return;
      }
  else if ((worldStore.state.filteruser.str != 'User')&&(worldStore.state.filteruser.str != ''))
      {
          var filtername = worldStore.state.filteruser.str.toLowerCase();
          var big = bet.uname.substring(0,filtername.length);
          var lowsub = big.toLowerCase();
          if (lowsub != filtername){
              return;
          }else {
            self.state.allBets.push(bet);
            wasnew = true;
          }
      }
  else if((worldStore.state.filtergame != 'ALL GAMES') && (worldStore.state.filtergame != bet.kind)){
    return;
    }
  else{
  //self.state.allBets.shift();
  self.state.allBets.push(bet);
  wasnew = true;
  //self.emitter.emit('new_all_bet', self.state);
  }
});

if (wasnew){
  self.emitter.emit('new_all_bet', self.state);
}

});

Dispatcher.registerCallback('INIT_ALL_BETS', function(bets) {
  console.assert(_.isArray(bets));
  self.state.allBets.push.apply(self.state.allBets, bets);
  self.emitter.emit('change', self.state);
  self.emitter.emit('new_all_bet', self.state);
});

Dispatcher.registerCallback('INIT_USER_BETS', function(newbets) {
  console.assert(_.isArray(newbets));
  self.state.bets.push.apply(self.state.bets, newbets);
  self.emitter.emit('change', self.state);
  self.emitter.emit('new_user_bet', self.state);
});

Dispatcher.registerCallback('LOAD_BET_HISTORY', function(bets) {
  console.assert(_.isArray(bets));
  self.state.bethistory.push.apply(self.state.bethistory, bets);
  self.emitter.emit('change', self.state);
});

Dispatcher.registerCallback('TOGGLE_HOTKEYS', function() {
  self.state.hotkeysEnabled = !self.state.hotkeysEnabled;
  self.emitter.emit('change', self.state);
});

Dispatcher.registerCallback('DISABLE_HOTKEYS', function() {
  self.state.hotkeysEnabled = false;
  self.emitter.emit('change', self.state);
});

Dispatcher.registerCallback('START_REFRESHING_USER', function() {
  self.state.isRefreshingUser = true;
  self.emitter.emit('change', self.state);
  /*
  var Payload = {
    app_id: config.app_id,
    auth_id: worldStore.state.auth_id
  };
  socket.emit('auth_id_data', Payload, function(err, data) {
    if (err) {
      console.log('Error auth_id:', err);
      Dispatcher.sendAction('STOP_REFRESHING_USER');
      return;
    }
    console.log('Successfully loaded user from auth_id:', data);
    if (data.user != undefined){
    var user = data.user;
    self.state.user = user;
    self.emitter.emit('change', self.state);
    self.emitter.emit('user_update');
    }
    Dispatcher.sendAction('STOP_REFRESHING_USER');
    //Dispatcher.sendAction('UPDATE_AUTH_ID',data);
    //Dispatcher.sendAction('INIT_CHAT', data);
  });
  */

  var Payload = {
    app_id: config.app_id,
    access_token: worldStore.state.accessToken
  };
  socket.emit('access_token_data', Payload, function(err, data) {
    if (err) {
      console.log('Error access_token_data:', err);
      Dispatcher.sendAction('STOP_REFRESHING_USER');
      return;
    }
    console.log('Successfully loaded user from access_token_data:', data);
    if (data.user != undefined){
    var user = data.user;
    self.state.user = user;
    self.emitter.emit('change', self.state);
    self.emitter.emit('user_update');
    }
    Dispatcher.sendAction('STOP_REFRESHING_USER');
  });


});

Dispatcher.registerCallback('STOP_REFRESHING_USER', function() {
  self.state.isRefreshingUser = false;
  self.emitter.emit('change', self.state);
});

Dispatcher.registerCallback('UPDATE_BANKROLL',function(){
//      "balance": 2835838782.20769,
//      "wagered": 20001333.23,
//      "invested": 10000.32
    self.emitter.emit('change', self.state);

    if (socket){
      socket.emit('bankroll_data', function(err, bankroll) {
        if (err) {
          console.log('Error bankroll_data:', err);
          return;
        }
        console.log('Successfully loaded bankroll_data:', bankroll);
        self.state.bankrollbalance = bankroll.balance;
        self.state.bankrollwagered = bankroll.wagered;
        self.state.bankrollinvested = bankroll.invested;
        self.emitter.emit('change', self.state);
      });
    }
  });


  Dispatcher.registerCallback('UPDATE_USERSTATS',function(){
        var Payload = {
          app_id: config.app_id,
          auth_id: worldStore.state.auth_id
        };
        socket.emit('auth_id_data', Payload, function(err, data) {
          if (err) {
            console.log('Error auth_id:', err);
            Dispatcher.sendAction('STOP_REFRESHING_USER');
            return;
          }
          console.log('Successfully UPDATE_USERSTATS from auth_id:', data);
          var user = data.user;
          self.state.user = user;
          self.emitter.emit('change', self.state);
        });

    });

///////
});

var Coin_Type_Toggle = React.createClass({
  displayName: 'Coin_Type_Toggle',
  _onClick: function() {
    Dispatcher.sendAction('TOGGLE_COIN_TYPE');
    Dispatcher.sendAction('LOAD_CHART_DATA');
  },
  render: function() {
    return (
        el.button(
          {
            type: 'button',
            className:  'btn navbar-btn btn-xs',
            disabled: AutobetStore.state.Run_Autobet,
            onClick: this._onClick
          },
          'Coin Type: ',
          worldStore.state.coin_type == 'BITS' ?
            el.span({className: 'label label-success'}, 'BITS') :
          el.span({className: 'label label-default'}, 'BTC')
        )
    );
  }
});

var UserBox = React.createClass({
  displayName: 'UserBox',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
    betStore.on('change', this._onStoreChange);
  },
  componentWillUnount: function() {
    worldStore.off('change', this._onStoreChange);
    betStore.off('change', this._onStoreChange);
  },
  _onLogout: function() {
    Dispatcher.sendAction('USER_LOGOUT');
  },
  _onRefreshUser: function() {
    Dispatcher.sendAction('START_REFRESHING_USER');
  },
  _openWithdrawPopup: function() {
    var windowUrl = config.mp_browser_uri + '/dialog/withdraw?app_id=' + config.app_id;
    var windowName = 'manage-auth';
    var windowOpts = [
      'width=420',
      'height=550',
      'left=100',
      'top=100'
    ].join(',');
    var windowRef = window.open(windowUrl, windowName, windowOpts);
    windowRef.focus();
    return false;
  },
  _openDepositPopup: function() {
    var windowUrl = config.mp_browser_uri + '/dialog/deposit?app_id=' + config.app_id;
    var windowName = 'manage-auth';
    var windowOpts = [
      'width=420',
      'height=550',
      'left=100',
      'top=100'
    ].join(',');
    var windowRef = window.open(windowUrl, windowName, windowOpts);
    windowRef.focus();
    return false;
  },
  render: function() {

    var innerNode;
    var nav_balance;
    var nav_uncbalance;

    var stillAnimatingPucks = _.keys(worldStore.state.renderedPucks).length > 0;

    if (worldStore.state.isLoading) {
      innerNode = el.p(
        {className: 'navbar-text'},
        'Loading...'
      );
    } else if (worldStore.state.user) {
      if (stillAnimatingPucks||worldStore.state.rt_spin_running||worldStore.state.plinko_running)
        {
        nav_balance = worldStore.state.revealed_balance;
      }else{
        nav_balance = worldStore.state.user.balance;
      }

      innerNode = el.div(
        null,

        // Deposit/Withdraw popup buttons
        el.div(
          {className: 'btn-group navbar-left btn-group-xs'},

          React.createElement(Coin_Type_Toggle, null),

          el.button(
            {
              type: 'button',
              className: 'btn navbar-btn btn-xs ' + (betStore.state.wager.error === 'CANNOT_AFFORD_WAGER' ? 'btn-success' : 'btn-default'),
              onClick: this._openDepositPopup
            },
            'Deposit'
          ),
          el.button(
            {
              type: 'button',
              className: 'btn btn-default navbar-btn btn-xs',
              onClick: this._openWithdrawPopup
            },
            'Withdraw'
          )
        ),
        // Balance
        el.span(
          {
            className: 'navbar-text bot_bal',
            style: {marginRight: '5px'}
          },
          helpers.convNumtoStr(worldStore.state.plinko_running ? worldStore.state.plinko_lastbalance : worldStore.state.user.balance) + worldStore.state.coin_type,
          !worldStore.state.user.unconfirmed_balance ?
           '' :
           el.span(
             {style: { color: '#e67e22'}},
             ' + ' + helpers.convNumtoStr(worldStore.state.user.unconfirmed_balance) + worldStore.state.coin_type +' pending'
           )
        ),
        // Refresh button
        el.button(
          {
            className: 'btn btn-link navbar-btn navbar-left ' + (worldStore.state.isRefreshingUser ? ' rotate' : ''),
            title: 'Refresh Balance',
            disabled: worldStore.state.isRefreshingUser,
            onClick: this._onRefreshUser,
            style: {
              paddingLeft: 0,
              paddingRight: 0,
              marginRight: '10px'
            }
          },
          el.span({className: 'glyphicon glyphicon-refresh'})
        ),
        // Logged in as...
        el.span(
          {className: 'navbar-text'},
          'Logged in as ',
          el.code(null, worldStore.state.user.uname)
        ),
        // Logout button
        el.button(
          {
            type: 'button',
            onClick: this._onLogout,
            className: 'navbar-btn btn btn-default'
          },
          'Logout'
        )
      );
    } else {
      // User needs to login
      innerNode = el.p(
        {className: 'navbar-text'},
        el.a(
          {
            href: config.mp_browser_uri + '/oauth/authorize' +
              '?app_id=' + config.app_id +
              '&redirect_uri=' + config.redirect_uri,
            className: 'btn btn-default'
          },
          'Login with Moneypot'
        )
      );
    }

    return el.div(
      {className: 'navbar-right'},
      innerNode
    );
  }
});

var Navbar = React.createClass({
  displayName: 'Navbar',
  render: function() {
    return el.div(
      {className: 'navbar'},
      el.div(
        {className: 'container-fluid'},
        el.div(
          {className: 'navbar-header'},
          el.a({className: 'navbar-brand', href:'/'}, config.app_name)
        ),
        // Links
        el.ul(
          {className: 'nav navbar-nav'},
          el.li(
            null,
            el.a(
              {
                href: config.mp_browser_uri + '/apps/' + config.app_id,
                target: '_blank'
              },
              'View on Moneypot ',
              // External site glyphicon
              el.span(
                {className: 'glyphicon glyphicon-new-window'}
              )
            )
          )
        ),

        // Userbox
        React.createElement(UserBox, null)
      )
    );
  }
});


var ChatBoxInput = React.createClass({
  displayName: 'ChatBoxInput',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    chatStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    chatStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  //
  getInitialState: function() {
    return { text: '' };
  },
  // Whenever input changes
  _onChange: function(e) {
    this.setState({ text: e.target.value });
  },
  // When input contents are submitted to chat server
  _onSend: function() {
    var self = this;
    Dispatcher.sendAction('SEND_MESSAGE', this.state.text);
    this.setState({ text: '' });
  },
  _onFocus: function() {
    // When users click the chat input, turn off bet hotkeys so they
    // don't accidentally bet
    if (worldStore.state.hotkeysEnabled) {
      Dispatcher.sendAction('DISABLE_HOTKEYS');
    }
  },
  _onKeyPress: function(e) {
    var ENTER = 13;
    if (e.which === ENTER) {
      if (this.state.text.trim().length > 0) {
        this._onSend();
      }
    }
  },
  render: function() {
    return (
      el.div(
        {className: 'row'},
        el.div(
          {className: 'col-md-9'},
          chatStore.state.loadingInitialMessages ?
            el.div(
              {
                style: {marginTop: '7px'},
                className: 'text-muted'
              },
              el.span(
                {className: 'glyphicon glyphicon-refresh rotate'}
              ),
              ' Loading...'
            )
          :
            el.input(
              {
                id: 'chat-input',
                className: 'form-control',
                type: 'text',
                value: this.state.text,
                placeholder: worldStore.state.user ?
                  'Click here and begin typing...' :
                  'Login to chat',
                onChange: this._onChange,
                onKeyPress: this._onKeyPress,
                onFocus: this._onFocus,
                ref: 'input',
                // TODO: disable while fetching messages
                disabled: !worldStore.state.user || chatStore.state.loadingInitialMessages
              }
            )
        ),
        el.div(
          {className: 'col-md-3'},
          el.button(
            {
              type: 'button',
              className: 'btn btn-default btn-block',
              disabled: !worldStore.state.user ||
                chatStore.state.waitingForServer ||
                this.state.text.trim().length === 0,
              onClick: this._onSend
            },
            'Send'
          )
        )
      )
    );
  }
});

var ChatUserList = React.createClass({
  displayName: 'ChatUserList',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  _onUserListToggle: function() {
    Dispatcher.sendAction('TOGGLE_CHAT_USERLIST');
  },
  render: function() {
    return (
      el.div(
        {className: 'panel panel-default'},
        el.div(
          {className: 'panel-heading'},
          'UserList',
          el.div(
            {
              className: 'text-right text-muted',
              style: { marginTop: '-15px' }
            },
          el.button(
            {
              className: 'btn btn-default btn-xs',
              onClick: this._onUserListToggle
            },
            chatStore.state.showUserList ? 'Hide' : 'Show'
          )
        )
        ),
        el.div(
          {className: 'panel-body'},
          el.div(
            {className: 'chat-list list-unstyled', ref: 'chatListRef'},
            _.values(chatStore.state.userList).map(function(u) {
              return el.li(
                {
                  key: u.uname
                },
                helpers.roleToLabelElement(u),
                ' ' + u.uname
              );
            })
          )
        ),
        el.div(
          {className: 'panel-footer'},
          'Users online: ' + Object.keys(chatStore.state.userList).length  // u.uname
        )
      )
    );
  }
});

var filteredmessage = function (rawtext){
  var linktext = undefined;
  var stringbefore = '';
  var stringafter = '';
  var intext = rawtext + '';
  var splittextarray = intext.split(" ");

  for (var x = 0; x < splittextarray.length; x++){
      if (splittextarray[x].substring(0, 4) == "http"){
          if (x > 0){
            for (var y = 0; y < x; y++){
              stringbefore += splittextarray[y] + ' ';
            }
          }
          linktext = splittextarray[x];
          for (var y = x+1; y < splittextarray.length; y++){
            stringafter += splittextarray[y] + ' ';
          }
        }
    }

  if ((linktext)&&(!linkmute)){
    return el.span(null,stringbefore,
            el.span(null,
                el.a(
                    {
                      href: linktext,
                      target: '_blank',
                      disabled: chatStore.state.loadingInitialMessages
                    }, linktext + ' '),
                    el.span(null,
                      stringafter
                    )
                  )
          );
  }else{
    return el.span(null,intext);
  }
};

var ChatBox = React.createClass({
  displayName: 'ChatBox',

  _onStoreChange: function() {
    this.forceUpdate();
  },
  // New messages should only force scroll if user is scrolled near the bottom
  // already. This allows users to scroll back to earlier convo without being
  // forced to scroll to bottom when new messages arrive
  _onNewMessage: function() {

    if (chatStore.state.showChat)
      {
       if (chatStore.state.newmsg == true){
         Dispatcher.sendAction('CLEAR_NEWMSG');
        }
      var node = ReactDOM.findDOMNode(this.refs.chatListRef);
      // Only scroll if user is within 100 pixels of last message
      var shouldScroll = function() {
        var distanceFromBottom = node.scrollHeight - ($(node).scrollTop() + $(node).innerHeight());
        console.log('DistanceFromBottom:', distanceFromBottom);
        return distanceFromBottom <= 150;
      };
      if (shouldScroll()) {
        this._scrollChat();
      }

      }else{
        if (chatStore.state.newmsg == false)
        Dispatcher.sendAction('SET_NEWMSG');
      }
  },
  _scrollChat: function() {
    var node = ReactDOM.findDOMNode(this.refs.chatListRef);
    if (node){$(node).scrollTop(node.scrollHeight);}
  },
  componentDidMount: function() {
    chatStore.on('change', this._onStoreChange);
    chatStore.on('new_message', this._onNewMessage);
    chatStore.on('init', this._scrollChat);
  },
  componentWillUnmount: function() {
    chatStore.off('change', this._onStoreChange);
    chatStore.off('new_message', this._onNewMessage);
    chatStore.off('init', this._scrollChat);
  },
  //
  _onUserListToggle: function() {
    Dispatcher.sendAction('TOGGLE_CHAT_USERLIST');
  },
  _onChatToggle: function() {
    if (chatStore.state.showUserList)
      {Dispatcher.sendAction('TOGGLE_CHAT_USERLIST');}
    Dispatcher.sendAction('TOGGLE_CHAT');
  },
  render: function() {
    var innernode;

    if (chatStore.state.showChat){

      innernode =el.div(null,
        el.div(
          {className: 'panel-body' },
          el.div(
            {className: 'chat-list list-unstyled', ref: 'chatListRef'},
            chatStore.state.messages.toArray().map(function(m) {
              return el.div(
                {
                  // Use message id as unique key
                  key: m.id
                },
                el.span(
                  {
                    style: {
                      fontFamily: 'monospace'
                    }
                  },
                  helpers.formatDateToTime(m.created_at),
                  ' '
                ),
                m.user ? helpers.roleToLabelElement(m.user) : '',
                m.user ? ' ' : '',
                el.code(
                  null,
                  m.user ?  m.user.uname :
                    // If system message:
                    'SYSTEM :: ' + m.text
                ),
                m.user ?
                  // If chat message
                  el.span(null, ' ',
                   filteredmessage(m.text)) :
                  // If system message
                  ''
              );

            })
          )
        ),
        el.div(
          {className: 'panel-footer'},
          React.createElement(ChatBoxInput, null)
        ),
        el.div({className: 'test-small'},'  Chat Rules: No begging/asking for loans or rain, and be polite. Violations may lead to a ban!')
      );

    }else {
      innernode = ''
    }

    return el.div(
      {id: 'chat-box'},
      el.div(
           {className: 'row'},
           el.div(
             {className: chatStore.state.showUserList ? 'col-sm-9':'col-sm-12'},
             el.div(
             {id: 'chat-box'},
             el.div(
             {className: 'panel panel-default'},
             el.div(
               {className: 'panel-heading'},
               'Chatbox ',
               el.span(null,
                 el.button(
                 {
                   className: 'btn btn-xs btn-primary',
                   onClick: this._onChatToggle
                 },
                 el.span({className: chatStore.state.newmsg ? 'label-success':'label-primary'},chatStore.state.showChat ? 'Hide' : 'Show')
               )),
               chatStore.state.showUserList ? '': el.div(
                 {
                   className: 'text-right text-muted',
                   style: { marginTop: '-15px' }
                 },
                 'Users online: ' + Object.keys(chatStore.state.userList).length + ' ',
                 // Show/Hide userlist button
                 el.button(
                   {
                     className: 'btn btn-xs btn-primary',
                     onClick: this._onUserListToggle
                   },
                   chatStore.state.showUserList ? 'Hide' : 'Show'
                 )
               )
             ),
             innernode
            )
            )
           ),
           chatStore.state.showUserList ?
           el.div(
             {className: 'col-sm-3'},
             React.createElement(ChatUserList, null)
           ):''
         )
    );
  }
});

//////////////////START DICE SPECIFIC CODE/////////////////////////

///Autobet code/////////////////////////////////////////////////////////////////
var AutobetStore = new Store('autobet', {
  ShowAutobet: false,  //FOR HIDING forms
  Run_Autobet: false,  //Enables Auto Wagering
  Stop_Autobet: false, //Flag to stop Before hititng wager
  Limitbets: false,
  BetsPlaced: 0,
  AutobetBase: 0.00,
  Prev_Balance: 0.00,
  Auto_cond:'<',
  Betlimit: {
    str: ' ',
    num: 0,
    error: undefined
  },
  Cond_Toggle: {
    str: ' ',
    num: 0,
    wincount:0,
    losscount:0,
    betcount:0,
    type:'WINS',
    error: undefined
  },
  multiplier: {
    str: '2.000',
    num: 2.000,
    error: undefined
  },
  on_loss_mul: true,
  multiplierwin: {
    str: '2.000',
    num: 2.000,
    error: undefined
  },
  on_win_mul: false,
  stoplower: {
    str: ' ',
    num: 0,
    error:null
  },
  stophigher: {
    str: ' ',
    num: 0,
    error:null
  }
}, function() {
  var self = this;

  Dispatcher.registerCallback('PLACE_AUTO_BET', function() {
    if (self.state.Stop_Autobet){
        console.log('stop auto bet Stop_Autobet set');
         Dispatcher.sendAction('STOP_RUN_AUTO');
       }
    else if (self.state.Run_Autobet){
      if (self.state.Auto_cond === '>'){
        $('#bet-hi')[0].click();
      }else {
        $('#bet-lo')[0].click();
      }
    }else{
      console.log('stop auto bet Stop_Autobet not set, Run_Autobet not set ');
      Dispatcher.sendAction('STOP_RUN_AUTO');
    }
  self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('AUTOBET_ROUTINE', function() {
    if (self.state.Limitbets){
        Dispatcher.sendAction('INC_AUTO_BETCOUNT');
      }
    Dispatcher.sendAction('UPDATE_AUTO_PREVBALANCE');
    Dispatcher.sendAction('PLACE_AUTO_BET');
  self.emitter.emit('change', self.state);
  });


  Dispatcher.registerCallback('START_RUN_AUTO', function() {
    console.log('start auto bet');
    self.state.AutobetBase = betStore.state.wager.num;
    self.state.Prev_Balance = worldStore.state.user.balance;
    self.state.BetsPlaced = 0;
    self.state.Cond_Toggle.wincount = 0;
    self.state.Cond_Toggle.losscount= 0;
    self.state.Cond_Toggle.betcount = 0;
    self.state.Run_Autobet = true;
    self.state.Stop_Autobet = false;
    self.emitter.emit('change', self.state);
    Dispatcher.sendAction('PLACE_AUTO_BET');
  });

  Dispatcher.registerCallback('ADJUST_AUTO_WAGER', function(wtype) {
    var multipler = wtype === 'LOSS' ? self.state.multiplier.num : self.state.multiplierwin.num
    var n;
    if (worldStore.state.coin_type === 'BITS'){
      n = (betStore.state.wager.num * multipler).toFixed(2);
    }else {
      n = (betStore.state.wager.num * multipler).toFixed(8);
    }
    Dispatcher.sendAction('UPDATE_WAGER', { str: n.toString() });

    if (helpers.convCoinTypetoSats(n) > worldStore.state.user.balance){
  //  if (helpers.convCoinTypetoSats(betStore.state.wager.num) > worldStore.state.user.balance){
      console.log('auto bet stopped from wager too large');
      Dispatcher.sendAction('STOP_RUN_AUTO');
      }
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('STOP_RUN_AUTO', function() {
    var n = self.state.AutobetBase;
    Dispatcher.sendAction('UPDATE_WAGER', { str: n.toString() });
    self.state.BetsPlaced = 0;
    self.state.Run_Autobet = false;
    self.state.Stop_Autobet = true;
    self.emitter.emit('change', self.state);
    console.log('stop auto bet');
  });

  Dispatcher.registerCallback('RETURN_AUTO_BASE', function() {
    var n = self.state.AutobetBase;
    Dispatcher.sendAction('UPDATE_WAGER', { str: n.toString() });
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('TOGGLE_AUTO_COND', function() {
    self.state.Auto_cond = self.state.Auto_cond === '<' ? '>':'<';
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('INC_AUTO_BETCOUNT', function() {
    self.state.BetsPlaced += 1;
    if (self.state.BetsPlaced >= self.state.Betlimit.num){
      console.log('auto bet stopped from bet limit reached');
      Dispatcher.sendAction('STOP_RUN_AUTO');
    }
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_AUTO_PREVBALANCE', function() {
    /////////betcount for toggle
    self.state.Cond_Toggle.betcount += 1;
    if ((self.state.Cond_Toggle.type === 'BETS') && (self.state.Cond_Toggle.num != 0) && (self.state.Cond_Toggle.num != null) && (self.state.Cond_Toggle.betcount >= self.state.Cond_Toggle.num))
      {
        self.state.Cond_Toggle.betcount = 0;
        Dispatcher.sendAction('TOGGLE_AUTO_COND');
      }
    /////////
    if (self.state.Prev_Balance < worldStore.state.user.balance){ //WIN
      if ((helpers.convSatstoCointype(worldStore.state.user.balance) >= self.state.stophigher.num) && (self.state.stophigher.num != 0)){
          console.log('auto bet stopped from balance > target');
          Dispatcher.sendAction('STOP_RUN_AUTO');
      }else{
          if (self.state.on_win_mul){
            Dispatcher.sendAction('ADJUST_AUTO_WAGER','WIN');
          }else{
          Dispatcher.sendAction('RETURN_AUTO_BASE');
          }
          self.state.Prev_Balance = worldStore.state.user.balance;
          ///////////on win count for toggle
          self.state.Cond_Toggle.wincount += 1;
          if ((self.state.Cond_Toggle.type === 'WINS') && (self.state.Cond_Toggle.num != 0) && (self.state.Cond_Toggle.num != null) && (self.state.Cond_Toggle.wincount >= self.state.Cond_Toggle.num))
            {
              self.state.Cond_Toggle.wincount = 0;
              Dispatcher.sendAction('TOGGLE_AUTO_COND');
            }
          ///////////
        }
    }else if((helpers.convSatstoCointype(worldStore.state.user.balance) <= self.state.stoplower.num) && (self.state.stoplower.num != 0)) {//LOSS
      console.log('auto bet stopped from balance < target');
      Dispatcher.sendAction('STOP_RUN_AUTO');
    }else{
      self.state.Prev_Balance = worldStore.state.user.balance;
      if (self.state.on_loss_mul){
        Dispatcher.sendAction('ADJUST_AUTO_WAGER','LOSS');
      }else{
      Dispatcher.sendAction('RETURN_AUTO_BASE');
      }
      ///////////on loss count for toggle
      self.state.Cond_Toggle.losscount += 1;
      if ((self.state.Cond_Toggle.type === 'LOSS') && (self.state.Cond_Toggle.num != 0) && (self.state.Cond_Toggle.num != null) && (self.state.Cond_Toggle.losscount >= self.state.Cond_Toggle.num))
        {
          self.state.Cond_Toggle.losscount = 0;
          Dispatcher.sendAction('TOGGLE_AUTO_COND');
        }
      ///////////
    }
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('TOGGLE_SHOW_AUTO', function() {
    self.state.ShowAutobet = !self.state.ShowAutobet;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('TOGGLE_LIMIT_BETS', function() {
    self.state.Limitbets = !self.state.Limitbets;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_BET_LIMIT', function(newlimit) {
    self.state.Betlimit = _.merge({}, self.state.Betlimit, newlimit);
    var n = parseInt(self.state.Betlimit.str, 10);
    // If n is a number, ensure it's at least 0
    if (isFinite(n)) {
      n = Math.max(n, 0);
      self.state.Betlimit.str = n.toString();
    }
    // Ensure Betlimit is a number
    if (isNaN(n) || /[^\d]/.test(n.toString())) {
      self.state.Betlimit.error = 'INVALID_BETLIM';}
    // Ensure Betlimit is less than max seed
     else {
      // Betlimit is valid
      self.state.Betlimit.error = null;
      self.state.Betlimit.str = n.toString();
      self.state.Betlimit.num = n;
    }
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('TOGGLE_ON_LOSS_MUL', function() {
    self.state.on_loss_mul = !self.state.on_loss_mul;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_AUTO_MULTIPLIER', function(newMult) {
    self.state.multiplier = _.merge({}, self.state.multiplier, newMult);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('TOGGLE_ON_WIN_MUL', function() {
    self.state.on_win_mul = !self.state.on_win_mul;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_AUTO_MULTIPLIER_ON_WIN', function(newMult) {
    self.state.multiplierwin = _.merge({}, self.state.multiplierwin, newMult);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_AUTO_STOPHIGHER', function(newstop) {
    self.state.stophigher = _.merge({}, self.state.stophigher, newstop);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_AUTO_STOPLOWER', function(newstop) {
    self.state.stoplower = _.merge({}, self.state.stoplower, newstop);
    self.emitter.emit('change', self.state);
  });


  Dispatcher.registerCallback('UPDATE_COND_TOGGLE', function(newtoggle) {
    self.state.Cond_Toggle = _.merge({}, self.state.Cond_Toggle, newtoggle);
    var n = parseInt(self.state.Cond_Toggle.str, 10);
    // If n is a number, ensure it's at least 0
    if (isFinite(n)) {
      n = Math.max(n, 0);
      self.state.Cond_Toggle.str = n.toString();
    }
    // Ensure Betlimit is a number
    if (isNaN(n) || /[^\d]/.test(n.toString())) {
      self.state.Cond_Toggle.error = 'INVALID_INPUT';}
    // Ensure Betlimit is less than max seed
     else {
      // Betlimit is valid
      self.state.Cond_Toggle.error = null;
      self.state.Cond_Toggle.str = n.toString();
      self.state.Cond_Toggle.num = n;
    }
    self.state.Cond_Toggle.betcount = 0;
    self.state.Cond_Toggle.wincount = 0;
    self.state.Cond_Toggle.losscount = 0;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('CHANGE_TOGGLE_TYPE', function() {
    switch (self.state.Cond_Toggle.type)
      {
        case 'WINS':
            self.state.Cond_Toggle.type = 'LOSS';
          break;
        case 'LOSS':
            self.state.Cond_Toggle.type = 'BETS';
          break;
        case 'BETS':
            self.state.Cond_Toggle.type = 'WINS';
          break;
        default: self.state.Cond_Toggle.type = 'WINS';
            break;
      }
      self.state.Cond_Toggle.betcount = 0;
      self.state.Cond_Toggle.wincount = 0;
      self.state.Cond_Toggle.losscount = 0;
    self.emitter.emit('change', self.state);
  });


});

var AutobetShowAuto = React.createClass({  //Code for Hide show button
  displayName: 'AutobetShowAuto',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  _onClick: function() {
    Dispatcher.sendAction('TOGGLE_SHOW_AUTO');
    Dispatcher.sendAction('START_REFRESHING_USER');
    this.forceUpdate();
  },
  render: function() {
    return (
      el.div(
        null,
        ''
      ),
      el.div(
        {className: 'text-center'},
        el.button(
          {
            type: 'button',
            className: 'btn btn-success btn-md btn-block',
            onClick: this._onClick
          },
          'Autobet: ',
          AutobetStore.state.ShowAutobet ?
            el.span({className: 'label label-success'}, 'HIDE') :
          el.span({className: 'label label-default'}, 'SHOW')
        )
      )
    );
  }
});

var AutobetBetlimit = React.createClass({ //Code for bet limit field
  displayName: 'AutobetBetlimit',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    AutobetStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    AutobetStore.off('change', this._onStoreChange);
  },
  _onBetlimitChange: function(e) {
    var str = e.target.value;
    Dispatcher.sendAction('UPDATE_BET_LIMIT', { str: str });
  },
  _onClick: function() {
    Dispatcher.sendAction('TOGGLE_LIMIT_BETS');
  },

  render: function() {
    return el.div(
      {className: 'form-group'},
      el.p(
        {className: 'h6', style: { fontWeight: 'bold', marginTop: '-15px' }},
        'Bet Limit',
        el.button(
            {
              type: 'button',
              className: 'btn btn-default btn-sm',
              onClick: this._onClick
            },
            AutobetStore.state.Limitbets ?
              el.span({className: 'label label-success'}, 'ENABLED') :
            el.span({className: 'label label-default'}, 'DISABLED')
          )
      ),
      el.div(
        {className: 'input-group', style: { marginTop: '-15px' }},
        el.input(
          {
            type: 'text',
            value: AutobetStore.state.Betlimit.str,
            className: 'form-control input-md',
            style: {fontWeight: 'bold'},
            onChange: this._onBetlimitChange
          }
        ),
        el.span(
          {className: 'input-group-addon'},
          'Bets'
        )

      )
    );
  }

});


var AutobetMultipler = React.createClass({
  displayName: 'AutobetMultipler',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    AutobetStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    AutobetStore.off('change', this._onStoreChange);
  },
  //
  _validateMultiplier: function(newStr) {
    var num = parseFloat(newStr, 10);
    // Ensure str is a number
    if (isNaN(num)) {
      Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER', { error: 'INVALID_MULTIPLIER' });
      // Ensure multiplier is >= -999x
    } else if (num < 0.0001) {
      Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER', { error: 'MULTIPLIER_TOO_LOW' });
      // Ensure multiplier is <= max allowed multiplier (999x for now)
    } else if (num > 999) {
      Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER', { error: 'MULTIPLIER_TOO_HIGH' });
      // Ensure no more than 2 decimal places of precision
    } else if (helpers.getPrecision(num) > 4) {
      Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER', { error: 'MULTIPLIER_TOO_PRECISE' });
      // multiplier str is valid
    } else {
      Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER', {
        num: num,
        error: null
      });
    }
  },
  _onMultiplierChange: function(e) {
    console.log('Auto Multiplier changed');
    var str = e.target.value;
    console.log('You entered', str, 'as your multiplier');
    Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER', { str: str });
    this._validateMultiplier(str);
  },
  _onClick: function() {
    Dispatcher.sendAction('TOGGLE_ON_LOSS_MUL');
  },
  render: function() {
    return el.div(
      {className: 'form-group', style: { marginTop: '-15px' }},
      el.p(
        {className: 'h6', style: AutobetStore.state.multiplier.error ? { color: 'red' } : { fontWeight: 'bold', marginTop: '-15px' }},
        'On Loss',
        el.button(
            {
              type: 'button',
              className: 'btn btn-default btn-sm',
              onClick: this._onClick
            },
            AutobetStore.state.on_loss_mul ?
              el.span({className: 'label label-success'}, 'MULTIPLY') :
            el.span({className: 'label label-default'}, 'RETURN TO BASE')
          )
      ),

      el.div(
        {className: 'input-group',style: { marginTop: '-15px' }},
        el.input(
          {
            type: 'text',
            value: AutobetStore.state.multiplier.str,
            className: 'form-control input-md',
            style: {fontWeight: 'bold'},
            onChange: this._onMultiplierChange
          }
        ),
        el.span(
          {className: 'input-group-addon'},
          'X'
        )
      )
    );
  }
});

var AutobetMultiplerOnWin = React.createClass({
  displayName: 'AutobetMultiplerOnWin',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    AutobetStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    AutobetStore.off('change', this._onStoreChange);
  },
  //
  _validateMultiplier: function(newStr) {
    var num = parseFloat(newStr, 10);
    // Ensure str is a number
    if (isNaN(num)) {
      Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER_ON_WIN', { error: 'INVALID_MULTIPLIER' });
      // Ensure multiplier is >= -999x
    } else if (num < 0.0001) {
      Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER_ON_WIN', { error: 'MULTIPLIER_TOO_LOW' });
      // Ensure multiplier is <= max allowed multiplier (999x for now)
    } else if (num > 999) {
      Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER_ON_WIN', { error: 'MULTIPLIER_TOO_HIGH' });
      // Ensure no more than 2 decimal places of precision
    } else if (helpers.getPrecision(num) > 4) {
      Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER_ON_WIN', { error: 'MULTIPLIER_TOO_PRECISE' });
      // multiplier str is valid
    } else {
      Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER_ON_WIN', {
        num: num,
        error: null
      });
    }
  },
  _onMultiplierChange: function(e) {
    console.log('Auto Multiplier on win changed');
    var str = e.target.value;
    console.log('You entered', str, 'as your multiplier');
    Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER_ON_WIN', { str: str });
    this._validateMultiplier(str);
  },
  _onClick: function() {
    Dispatcher.sendAction('TOGGLE_ON_WIN_MUL');
  },
  render: function() {
    return el.div(
      {className: 'form-group', style: { marginTop: '-15px' }},
      el.p(
        {className: 'h6', style: AutobetStore.state.multiplierwin.error ? { color: 'red' } : { fontWeight: 'bold', marginTop: '-15px' }},
        'On Win',
        el.button(
            {
              type: 'button',
              className: 'btn btn-default btn-sm',
              onClick: this._onClick
            },
            AutobetStore.state.on_win_mul ?
              el.span({className: 'label label-success'}, 'MULTIPLY') :
            el.span({className: 'label label-default'}, 'RETURN TO BASE')
          )
      ),

      el.div(
        {className: 'input-group',style: { marginTop: '-15px' }},
        el.input(
          {
            type: 'text',
            value: AutobetStore.state.multiplierwin.str,
            className: 'form-control input-md',
            style: {fontWeight: 'bold'},
            onChange: this._onMultiplierChange
          }
        ),
        el.span(
          {className: 'input-group-addon'},
          'X'
        )
      )
    );
  }
});

var AutobetStopLow = React.createClass({
  displayName: 'AutobetStopLow',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    AutobetStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    AutobetStore.off('change', this._onStoreChange);
  },
  //
  _validateStopLower: function(newStr) {
    var num = parseFloat(newStr, 10);

    // Ensure str is a number
    if (isNaN(num)) {
      Dispatcher.sendAction('UPDATE_AUTO_STOPLOWER', { error: 'INVALID_NUMBER' });
    } else if (num < 0) {
      Dispatcher.sendAction('UPDATE_AUTO_STOPLOWER', { error: 'NUMBER_TOO_LOW' });
    } else {
      Dispatcher.sendAction('UPDATE_AUTO_STOPLOWER', {
        num: num,
        error: null
      });
    }
  },
  _onStopLowChange: function(e) {
    var str = e.target.value;
    Dispatcher.sendAction('UPDATE_AUTO_STOPLOWER', { str: str });
    this._validateStopLower(str);
  },
  render: function() {
    return el.div(
      {className: 'form-group', style: { marginTop: '-10px' }},
      el.p(
        {className: 'h6', style: AutobetStore.state.stoplower.error ? { color: 'red',marginTop: '-5px' } : {fontWeight: 'bold',marginTop: '-5px'}},
        'Stop if Balance <'
      ),
      el.div(
        {className: 'input-group',style: { marginTop: '-10px' }},
        el.input(
          {
            type: 'text',
            value: AutobetStore.state.stoplower.str,
            className: 'form-control input-md',
            style: {fontWeight: 'bold'},
            onChange: this._onStopLowChange
          }
        ),
        el.span(
          {className: 'input-group-addon'},
          worldStore.state.coin_type
        )
      )
    );
  }
});

var AutobetStopHigh = React.createClass({
  displayName: 'AutobetStopHigh',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    AutobetStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    AutobetStore.off('change', this._onStoreChange);
  },
  //
  _validateStopHigher: function(newStr) {
    var num = parseFloat(newStr, 10);

    // Ensure str is a number
    if (isNaN(num)) {
      Dispatcher.sendAction('UPDATE_AUTO_STOPHIGHER', { error: 'INVALID_NUMBER' });
    } else if (num < 0) {
      Dispatcher.sendAction('UPDATE_AUTO_STOPHIGHER', { error: 'NUMBER_TOO_LOW' });
    } else {
      Dispatcher.sendAction('UPDATE_AUTO_STOPHIGHER', {
        num: num,
        error: null
      });
    }
  },
  _onStopHighChange: function(e) {
    var str = e.target.value;
    Dispatcher.sendAction('UPDATE_AUTO_STOPHIGHER', { str: str });
    this._validateStopHigher(str);
  },
  render: function() {
    return el.div(
      {className: 'form-group', style: { marginTop: '-10px' }},
      el.p(
        {className: 'h6', style: AutobetStore.state.stophigher.error ? { color: 'red',marginTop: '-5px' } : {fontWeight: 'bold',marginTop: '-5px'}},
        'Stop if Balance >'
      ),
      el.div(
        {className: 'input-group',style: { marginTop: '-10px' }},
        el.input(
          {
            type: 'text',
            value: AutobetStore.state.stophigher.str,
            className: 'form-control input-md',
            style: {fontWeight: 'bold'},
            onChange: this._onStopHighChange
          }
        ),
        el.span(
          {className: 'input-group-addon'},
          worldStore.state.coin_type
        )
      )
    );
  }
});

var AutobetCondInput = React.createClass({ //Code for Cond_Toggle input
  displayName: 'AutobetCondInput',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    AutobetStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    AutobetStore.off('change', this._onStoreChange);
  },
  _onCond_ToggleChange: function(e) {
    var str = e.target.value;
    Dispatcher.sendAction('UPDATE_COND_TOGGLE', { str: str });
  },

  _onClick: function() {
    Dispatcher.sendAction('CHANGE_TOGGLE_TYPE');
  },

  render: function() {
    return el.div(
      {className: 'form-group',style: {marginTop: '-10px' }},
      el.p(
        {className: 'h6', style: { fontWeight: 'bold', marginTop: '-5px' }},
        'Change Target'
      ),
      el.div(
        {className: 'btn-group btn-group-justified', style: {marginTop: '-10px'}},
      el.div(
        {className: 'input-group btn-group'},
        el.input(
            {
              type: 'text',
              value: AutobetStore.state.Cond_Toggle.str,
              className: 'form-control input-md',
              style: {fontWeight: 'bold'},
              onChange: this._onCond_ToggleChange
            }
          )
        ),
        el.div(
          {className: 'btn-group'},
          el.button(
              {
                type: 'button',
                className: 'btn btn-primary btn-md', style:{fontWeight: 'bold'},
                onClick: this._onClick
              },
              AutobetStore.state.Cond_Toggle.type
            )
        )
      )
    );
  }

});


var AutobetForms= React.createClass({
  displayName: 'AutobetForms',

  render: function() {
    return el.div(
      null,
      el.div(
        {className: 'col-xs-12',style: { marginTop: '-15px' }},
        el.hr(null)
      ),
        el.div(
          {className: 'col-xs-12 col-sm-4 col-md-4 col-lg-2'},
          React.createElement(AutobetBetlimit, null)
        ),
        el.div(
          {className: 'col-xs-12 col-sm-4 col-md-4 col-lg-2'},
          React.createElement(AutobetMultipler, null)
        ),
        el.div(
          {className: 'col-xs-12 col-sm-4 col-md-4 col-lg-2'},
          React.createElement(AutobetMultiplerOnWin, null)
        ),
        el.div(
          {className: 'col-xs-12 col-sm-4 col-md-4 col-lg-2'},
          React.createElement(AutobetStopHigh, null)
        ),
        el.div(
          {className: 'col-xs-12 col-sm-4 col-md-4 col-lg-2'},
          React.createElement(AutobetStopLow, null)
        ),
        el.div(
          {className: 'col-xs-12 col-sm-4 col-md-4 col-lg-2'},
          React.createElement(AutobetCondInput, null)
        )
      );
  }
});

var AutobetButtons= React.createClass({
  displayName: 'AutobetButtons',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    AutobetStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    AutobetStore.off('change', this._onStoreChange);
  },
  _onClickCond: function() {
    Dispatcher.sendAction('TOGGLE_AUTO_COND');
    this.forceUpdate();
  },
  render: function() {
    var winProb = helpers.multiplierToWinProb(betStore.state.multiplier.num);

    return el.div(
      {className: 'col-xs-12 col-md-6'},
        el.div(
          {className: 'col-xs-12 col-sm-8 col-md-6'},
          React.createElement(AutobetStart, null)
        ),
        el.div(
          {className: 'col-xs-12 col-sm-4 col-md-4'},
          el.button(
            {
              type: 'button',
              className: 'btn btn-primary btn-lg',
              onClick: this._onClickCond
            },
            'Target',
            AutobetStore.state.Auto_cond === '>' ? el.span({className: 'label label-default'}, '>', + (((winProb * -100) + 100 )-betStore.state.house_edge).toFixed(2).toString())
              :el.span({className: 'label label-default'}, '<', + ((winProb * - 100)*-1).toFixed(2).toString())
          )
        )
      );
  }
});


var AutobetStart = React.createClass({
 displayName: 'AutobetStart',
 _onStoreChange: function() {
   this.forceUpdate();
 },
 componentDidMount: function() {
   worldStore.on('change', this._onStoreChange);
   betStore.on('change', this._onStoreChange);
   AutobetStore.on('change', this._onStoreChange);
 },
 componentWillUnmount: function() {
   worldStore.off('change', this._onStoreChange);
   betStore.off('change', this._onStoreChange);
   AutobetStore.off('change', this._onStoreChange);
 },
 _onClickStart: function() {
   console.log('autobet start button click');
   Dispatcher.sendAction('START_RUN_AUTO');
 },
 _onClickStop: function() {
   console.log('autobet stop button click');
     Dispatcher.sendAction('STOP_RUN_AUTO');
 },
render: function(){
  var innerNode;

  // TODO: Create error prop for each input
  var error = betStore.state.wager.error || betStore.state.multiplier.error || betStore.state.clientSeed.error || AutobetStore.state.multiplier.error || AutobetStore.state.Betlimit.error || AutobetStore.state.stoplower.error || AutobetStore.state.stophigher.error;

  if (worldStore.state.isLoading) {
    // If app is loading, then just disable button until state change
    innerNode = el.button(
      {type: 'button', disabled: true, className: 'btn btn-lg btn-block btn-default'},
      'Loading...'
    );
  } else if (error) {
    // If there's a Autobet setting error, then render button in error state

    var errorTranslations = {
      'INVALID_SEED': 'Invalid Seed',
      'SEED_TOO_HIGH':'Seed too high',
      'CANNOT_AFFORD_WAGER': 'Balance too low',
      'INVALID_WAGER': 'Invalid wager',
      'WAGER_TOO_LOW': 'Wager too low',
      'WAGER_TOO_PRECISE': 'Wager too precise',
      'INVALID_MULTIPLIER': 'Invalid multiplier',
      'MULTIPLIER_TOO_PRECISE': 'Multiplier too precise',
      'MULTIPLIER_TOO_HIGH': 'Multiplier too high',
      'MULTIPLIER_TOO_LOW': 'Multiplier too low'
    };

    innerNode = el.button(
      {type: 'button',
       disabled: true,
       className: 'btn btn-lg btn-block btn-danger'},
      errorTranslations[error] || 'Setting Error'
    );
  } else if (worldStore.state.user) {
    // If user is logged in, let them submit bet
      if (AutobetStore.state.Run_Autobet){
        innerNode =
        el.button(
              {
                id: 'Stop-Auto-Bet',
                type: 'button',
                className: 'btn btn-lg btn-danger btn-block',
                onClick: this._onClickStop
              },
              'Stop Auto Bet'
            );
      }else{
        innerNode =
        el.button(
              {
                id: 'Start-Auto-Bet',
                type: 'button',
                className: 'btn btn-lg btn-success btn-block',
                onClick: this._onClickStart
              },
              'Start Auto Bet'
            );
        }
  } else {
    // If user isn't logged in, give them link to /oauth/authorize
    innerNode = el.a(
      {
        href: config.mp_browser_uri + '/oauth/authorize' +
          '?app_id=' + config.app_id +
          '&redirect_uri=' + config.redirect_uri,
        className: 'btn btn-lg btn-block btn-success'
      },
      'Login with MoneyPot'
    );
  }

  return el.div(
      null,
      innerNode
  );

}

});

////END Autobet////////////////////////////////////////////////////////////////////////
///LAST BET
var BetBoxLastBet = React.createClass({
  displayName: 'BetBoxLastBet',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('new_user_bet', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('new_user_bet', this._onStoreChange);
  },
  render: function() {
 var last_bet = '';
 var last_wager = helpers.convNumtoStr(100);
 var last_cond = '>';
 var last_target = 49.5000;
 var last_outcome = 50.0000;
 var last_profit = 100;
 last_bet = '';

 if (worldStore.state.first_bet){
   last_bet = worldStore.state.bets.data[worldStore.state.bets.end].id;
   last_wager = helpers.convNumtoStr(worldStore.state.bets.data[worldStore.state.bets.end].wager);
   last_cond = worldStore.state.bets.data[worldStore.state.bets.end].meta.cond;
   if (worldStore.state.bets.data[worldStore.state.bets.end].meta.kind == 'DICE'){
     last_target = worldStore.state.bets.data[worldStore.state.bets.end].meta.number.toFixed(4);
     last_outcome = worldStore.state.bets.data[worldStore.state.bets.end].outcome;
   }else {
     last_target = '-'
     last_outcome = '-'
   }
   last_profit = worldStore.state.bets.data[worldStore.state.bets.end].profit;
  }
  return el.div(
      null,
      el.div(
        {className: 'col-xs-12',style: { marginTop: '-15px' }},
        el.hr(null)
      ),
        el.div(
          { className: 'col-xs-12 well well-sm',style: {marginTop: '-15'}},
          el.div(
            { className: 'col-xs-12 col-sm-4 col-md-4 col-lg-2'},
            el.span(
            {className: 'lead'},
            'Last Bet:'
            ),
            el.span(
                null,
                el.a(
                  {
                    href: config.mp_browser_uri + '/bets/' + last_bet,
                    target: '_blank'
                  },
                  last_bet
                )
            )
          ),
          el.div(
             { className: 'col-xs-12 col-sm-4 col-md-4 col-lg-2'},
            el.span(
              {className: 'lead'},
              'Wager:'
            ),
            el.span(
              null,
              last_wager,
              worldStore.state.coin_type
            )
          ),
          el.div(
            { className: 'col-xs-12 col-sm-4 col-md-4 col-lg-2'},
            el.span(
              {className: 'lead'},
              'Target:'
            ),
            // target
            el.span(
              null,
              last_cond + ' ' + last_target
            )
          ),
          el.div( //field for progress-bar
          { className: 'col-xs-12 col-sm-4 col-md-4 col-lg-3'},
          // progress bar container
          el.div(
            {
              className: 'progress',
              style: {
                minWidth: '100px',
                position: 'relative',
                marginBottom: 0,
                // make it thinner than default prog bar
                height: '10px'
              }
            },
            el.div(
              {
                className: 'progress-bar ' +
                  (last_profit >= 0 ?
                   'progress-bar-success' : 'progress-bar-grey') ,
                style: {
                  float: last_cond === '<' ? 'left' : 'right',
                  width: last_cond === '<' ?
                    last_target.toString() + '%' :
                    (100 - last_target).toString() + '%'
                }
              }
            ),
            el.div(
              {
                style: {
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: last_outcome.toString() + '%',
                  borderRight: '3px solid #333',
                  height: '100%'
                }
              }
            )
          ),//end progressbar
          // arrow container
          el.div(
            {
              style: {
                position: 'relative',
                width: '100%',
                height: '15px'
              }
            },
            // arrow
            el.div(
              {
                style: {
                  position: 'absolute',
                  top: 0,
                  left: (last_outcome - 1).toString() + '%'
                }
              },
              el.div(
                {
                  style: {
                    width: '5em',
                    marginLeft: '-10px'
                  }
                },

                el.span(
                  {style: {fontFamily: 'monospace'}},
                  '' + last_outcome
                )
              )
            )
          )


        ),
        el.div(
          { className: 'col-xs-12 col-sm-4 col-md-4 col-lg-2'},
          el.span(
          {className: 'lead'},
          'Profit:'
          ),
          el.span(
            {style: { color: last_profit > 0 ? 'green' : 'red'}},
           last_profit > 0 ? '+' + helpers.convNumtoStr(last_profit) : helpers.convNumtoStr(last_profit),
           worldStore.state.coin_type
          )
        )
      )
      );
  }

});


////////////////////////////////////////////////////////////

  var Coin_Type_Toggle = React.createClass({
    displayName: 'Coin_Type_Toggle',
    _onClick: function() {
      Dispatcher.sendAction('TOGGLE_COIN_TYPE');
      Dispatcher.sendAction('LOAD_CHART_DATA');
    },
    render: function() {
      return (
          el.button(
            {
              type: 'button',
              className:  'btn navbar-btn btn-xs bot_bits',
              disabled: AutobetStore.state.Run_Autobet,
              onClick: this._onClick
            },
            'Coin Type: ',
            worldStore.state.coin_type == 'BITS' ?
              el.span({className: 'label label-success'}, 'BITS') :
            el.span({className: 'label label-default'}, 'BTC')
          )
      );
    }
  });


///////////////////
var BetBoxClientSeed = React.createClass({
  displayName: 'BetBoxClientSeed',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  _randomizeSeed: function(){
    console.log('clientSeed changed');
    var newseed = Math.floor(Math.random()*(Math.pow(2,32)));
    var str = newseed.toString();
    console.log('New Random String ', str);
    Dispatcher.sendAction('UPDATE_CLIENT_SEED', { str: str });
  },
  _onclientSeedChange: function(e) {
    console.log('clientSeed changed');
    var str = e.target.value;
    console.log('You entered', str, 'as your clientSeed');
    Dispatcher.sendAction('UPDATE_CLIENT_SEED', { str: str });
  },
  _onRndSeedToggle: function(){
    Dispatcher.sendAction('TOGGLE_RND_SEED');
  },
  render: function() {
    return el.div(
      {className: 'form-group'},
      el.p(
        {className: 'lead', style: { fontWeight: 'bold',marginTop: '-15px' }},
        'Client Seed:'
      ),
      el.div({className: 'form-group', style: { marginTop: '-15px'}},
          el.div(
            {className: 'input-group'},
            el.input(
              {
                type: 'text',
                value: betStore.state.clientSeed.str,
                style : {fontWeight: 'bold'},
                className: 'form-control input-md bot_seed',
                onChange: this._onclientSeedChange,
                onClick: this._onclientSeedChange
              }
            ),
            el.span({className:'input-group-btn'},
              el.button(
                {
                  type: 'button',
                  className: 'btn btn-primary btn-md', style:{fontWeight: 'bold',paddingLeft: '5px', paddingRight:'5px'},
                  onClick: this._randomizeSeed
                },
                el.span(null,'RND')
              )
            )
        ),
        el.div(null,
          el.button({
             type:'button',
             className:'btn btn-sm btn-default',
             onClick: this._onRndSeedToggle
            },
            el.span(
              {className: betStore.state.randomseed ? 'label-success':'label-default'},
              betStore.state.randomseed ? 'Randomize Each Bet':'Keep Seed for Each'
            )
          )
        )
      )
    );
  }
});


var BetBoxBalance = React.createClass({
  displayName: 'BetBoxBalance',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  //
  render: function() {

    var innerNode;
    var b_balance;
    var stillAnimatingPucks = _.keys(worldStore.state.renderedPucks).length > 0;

    if (worldStore.state.user) {
      if (stillAnimatingPucks||worldStore.state.rt_spin_running||worldStore.state.plinko_running)
        {
        b_balance = worldStore.state.revealed_balance;
      }else{
        b_balance = worldStore.state.user.balance;
      }
      innerNode = el.span(
        {className: 'lead'},
        helpers.commafy(helpers.convNumtoStr(b_balance)) + worldStore.state.coin_type
      );
    } else {
      innerNode = el.span(
        {
          className: 'lead',
        },
        '--'
      );
    }

    return el.div(
      null,
      el.span(
        {className: 'lead', style: { fontWeight: 'bold',marginTop: '-25px' }},
        'Balance: '
      ),
      innerNode
    );
  }
});



var BetBoxChance = React.createClass({
  displayName: 'BetBoxChance',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  //
  render: function() {
    // 0.00 to 1.00
    var winProb = helpers.multiplierToWinProb(betStore.state.multiplier.num);

    var isError = betStore.state.multiplier.error || betStore.state.wager.error;

    // Just show '--' if chance can't be calculated
    var innerNode;
    if (isError) {
      innerNode = el.span(
        {className: 'lead'},
        ' --'
      );
    } else {
      innerNode = el.span(
        {className: 'lead'},
        ' ' + (winProb * 100).toFixed(2).toString() + '%'
      );
    }

    return el.div(
      {},
      el.span(
        {className: 'lead', style: { fontWeight: 'bold',marginTop: '-25px' }},
        'Chance:'
      ),
      innerNode
    );
  }
});

var BetBoxTarget = React.createClass({
  displayName: 'BetBoxTarget',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  //
  render: function() {
    // 0.00 to 1.00
    var winProb = helpers.multiplierToWinProb(betStore.state.multiplier.num);

    var isError = betStore.state.multiplier.error || betStore.state.wager.error;

    // Just show '--' if chance can't be calculated
    var innerNode;
    if (isError) {
      innerNode = el.span(
        {className: 'lead'},
        ' --'
      );
    } else {
      innerNode = el.span(
        {className: 'text'},
        //((winProb * - 100)*-1).toFixed(4).toString() + '>n>' + (((winProb * -100) + 100 )-betStore.state.house_edge).toFixed(4).toString()
        ((winProb * - 100)*-1).toFixed(4).toString() + '>n>' + (99.9999 - (winProb * 100)).toFixed(4).toString()
      );
    }

    return el.div(
      {},
      el.span(
        {className: 'lead', style: { fontWeight: 'bold',marginTop: '-25px' }},
        'Target:'
      ),
      innerNode
    );
  }
});

var BetBoxProfit = React.createClass({
  displayName: 'BetBoxProfit',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  //
  render: function() {
    var profit;
    if (worldStore.state.coin_type === 'BITS'){
      profit = (betStore.state.wager.num * (betStore.state.multiplier.num - 1)).toFixed(2).toString();
    }
    else {
      profit = (betStore.state.wager.num * (betStore.state.multiplier.num - 1)).toFixed(8).toString();
    }
    var innerNode;
    if (betStore.state.multiplier.error || betStore.state.wager.error) {
      innerNode = el.span(
        {className: 'lead'},
        '--'
      );
    } else {
      innerNode = el.span(
        {
          className: 'text',
          style: { color: '#39b54a' }
        },
        '+' + profit + ' ' + worldStore.state.coin_type
      );
    }

    return el.div(
      null,
      el.span(
        {className: 'lead', style: { fontWeight: 'bold',marginTop: '-25px' }},
        'Profit: '
      ),
      innerNode
    );
  }
});

var BetBoxMaxProfit = React.createClass({
  displayName: 'BetBoxMaxProfit',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },

  render: function() {
    var innerNode;
      innerNode = el.span(
        {
          className: 'text'
        },
      helpers.convSatstoCointype(worldStore.state.bankrollbalance * betStore.state.house_edge).toString() + worldStore.state.coin_type
      );


    return el.div(
      null,
      el.span(
        {className: 'lead', style: { fontWeight: 'bold',marginTop: '-25px' }},
        'MaxProfit: '
      ),
      innerNode
    );
  }
});

var BetBoxMultiplier = React.createClass({
  displayName: 'BetBoxMultiplier',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  //
  _validateMultiplier: function(newStr) {
    var num = parseFloat(newStr, 10);

    // If num is a number, ensure it's at least 0.01x
    // if (Number.isFinite(num)) {
    //   num = Math.max(num, 0.01);
    //   this.props.currBet.setIn(['multiplier', 'str'], num.toString());
    // }

    var isFloatRegexp = /^(\d*\.)?\d+$/;

    var winProb = helpers.multiplierToWinProb(num);

    // Ensure str is a number
    if (isNaN(num) || !isFloatRegexp.test(newStr)) {
      Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'INVALID_MULTIPLIER' });
      // Ensure multiplier is >= 1.00x
    } else if (num < 1.001) {
      Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'MULTIPLIER_TOO_LOW' });
      // Ensure multiplier is <= max allowed multiplier (100x for now)
    } else if (num > 990000) {
      Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'MULTIPLIER_TOO_HIGH' });
      // Ensure no more than 2 decimal places of precision
    } else if (helpers.getPrecision(num) > 4) {
      Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'MULTIPLIER_TOO_PRECISE' });
      // multiplier str is valid
    } else {
      Dispatcher.sendAction('UPDATE_MULTIPLIER', {
        num: num,
        error: null
      });

      Dispatcher.sendAction('UPDATE_CHANCE_IN', {
        num: (winProb*100).toFixed(4),
        str: (winProb*100).toFixed(4).toString(),
        error: null
      });

    }
  },
  _onMultiplierChange: function(e) {
    console.log('Multiplier changed');
    var str = e.target.value;
    console.log('You entered', str, 'as your multiplier');
    Dispatcher.sendAction('UPDATE_MULTIPLIER', { str: str });
    this._validateMultiplier(str);
  },
  render: function() {
    return el.div(
      {className: 'form-group'},
      el.p(
        {className: 'lead',
         style: betStore.state.multiplier.error ? { fontWeight: 'bold',marginTop: '-10px',color: 'red' } : { fontWeight: 'bold',marginTop: '-10px' }
       },
          'Multiplier:'
      ),
      el.div(
        {className: 'input-group',style: { marginTop: '-15px' }},
        el.input(
          {
            type: 'text',
            value: betStore.state.multiplier.str,
            className: 'form-control input-md bot_multi',
            style: {fontWeight: 'bold'},
            onChange: this._onMultiplierChange,
             onClick: this._onMultiplierChange,
            disabled: !!worldStore.state.isLoading
          }
        ),
        el.span(
          {className: 'input-group-addon'},
          'X'
        )
      )
    );
  }
});

var BetBoxChanceInput = React.createClass({
  displayName: 'BetBoxChanceInput',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  //
  _validateChance: function(newStr) {
    var num = parseFloat(newStr, 10);

    var isFloatRegexp = /^(\d*\.)?\d+$/;

    // Ensure str is a number
    if (isNaN(num) || !isFloatRegexp.test(newStr)) {
      Dispatcher.sendAction('UPDATE_CHANCE_IN', { error: 'CHANCE_INVALID_CHARS' });
      // Ensure multiplier is >= 1.00x
    } else if (num < 0.0001) {
      Dispatcher.sendAction('UPDATE_CHANCE_IN', { error: 'CHANCE_TOO_LOW' });
      // Ensure multiplier is <= max allowed multiplier (100x for now)
    } else if (num > (100 - (betStore.state.house_edge * 100))) {  //(99.92)
      Dispatcher.sendAction('UPDATE_CHANCE_IN', { error: 'CHANCE_TOO_HIGH' });
      // Ensure no more than 2 decimal places of precision
    } else if (helpers.getPrecision(num) > 4) {
      Dispatcher.sendAction('UPDATE_CHANCE_IN', { error: 'CHANCE_TOO_PRECISE' });
      // multiplier str is valid
    } else {
      Dispatcher.sendAction('UPDATE_CHANCE_IN', {
        num: num,
        error: null
      });
      //update multiplier
      //
      if (helpers.WinProbtoMultiplier(num/100) < 1.001){
        Dispatcher.sendAction('UPDATE_MULTIPLIER', {
          num: helpers.WinProbtoMultiplier(num/100),
          str: helpers.WinProbtoMultiplier(num/100).toFixed(4).toString(),
          error: 'MULTIPLIER_TOO_LOW'
        });
      }else{
      Dispatcher.sendAction('UPDATE_MULTIPLIER', {
        num: helpers.WinProbtoMultiplier(num/100),
        str: helpers.WinProbtoMultiplier(num/100).toFixed(4).toString(),
        error: null
      });
      }
    }
  },
  _onChanceInChange: function(e) {
    console.log('Chance input changed');
    var str = e.target.value;
    console.log('You entered', str, 'as your chance');
    Dispatcher.sendAction('UPDATE_CHANCE_IN', { str: str });
    this._validateChance(str);
  },
  render: function() {
    return el.div(
      {className: 'form-group'},
      el.p(
        {className: 'lead',
         style: betStore.state.ChanceInput.error ? { fontWeight: 'bold',marginTop: '-10px',color: 'red' } : { fontWeight: 'bold',marginTop: '-10px' }
        },
          'Chance:'
        ),
      el.div(
        {className: 'input-group',style: { marginTop: '-15px' }},
        el.input(
          {
            type: 'text',
            value: betStore.state.ChanceInput.str,
            className: 'form-control input-md',
            style: {fontWeight: 'bold'},
            onChange: this._onChanceInChange,
            disabled: !!worldStore.state.isLoading
          }
        ),
        el.span(
          {className: 'input-group-addon'},
          '%'
        )
      )
    );
  }
});

var BetBoxWager = React.createClass({
  displayName: 'BetBoxWager',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  _onBalanceChange: function() {
    // Force validation when user logs in
    // TODO: Re-force it when user refreshes
    Dispatcher.sendAction('UPDATE_WAGER', {});
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
    worldStore.on('user_update', this._onBalanceChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
    worldStore.off('user_update', this._onBalanceChange);
  },
  _validateWager: function(newStr) {
    var num = parseFloat(newStr, 10);

    var isFloatRegexp = /^(\d*\.)?\d+$/;

    // Ensure str is a number
    if (worldStore.state.coin_type === 'BITS'){
    if (isNaN(num) || !isFloatRegexp.test(newStr)) {
      Dispatcher.sendAction('UPDATE_WAGER', { error: 'INVALID_WAGER' });
      // Ensure wager is greater than 0.01
    } else if (num < 0.01) {
      Dispatcher.sendAction('UPDATE_WAGER', { error: 'WAGER_TOO_LOW' });
      // Ensure balance is enough
    } else if (num * 100 > worldStore.state.user.balance) {
      Dispatcher.sendAction('UPDATE_WAGER', { error: 'CANNOT_AFFORD_WAGER' });
    } else if (helpers.getPrecision(num) > 2) {
      Dispatcher.sendAction('UPDATE_WAGER', { error: 'WAGER_TOO_PRECISE' });
      // multiplier str is valid
    } else {
      Dispatcher.sendAction('UPDATE_WAGER', {
        num: num,
        error: null
      });
    }
  }else {
    if (isNaN(num)) {
      Dispatcher.sendAction('UPDATE_WAGER', { error: 'INVALID_WAGER' });
      // Ensure wager is greater than 0.01
    } else if (num < 0.00000001) {
      Dispatcher.sendAction('UPDATE_WAGER', { error: 'WAGER_TOO_LOW' });
      // Ensure balance is enough
    } else if (num / 0.00000001 > worldStore.state.user.balance) {
      Dispatcher.sendAction('UPDATE_WAGER', { error: 'CANNOT_AFFORD_WAGER' });
    } else if (helpers.getPrecision(num) > 8) {
      Dispatcher.sendAction('UPDATE_WAGER', { error: 'WAGER_TOO_PRECISE' });
      // multiplier str is valid
    } else {
      Dispatcher.sendAction('UPDATE_WAGER', {
        num: num,
        error: null
      });
    }

  }


  },

  _onWagerChange: function(e) {
    var str = e.target.value;
    Dispatcher.sendAction('UPDATE_WAGER', { str: str });
    this._validateWager(str);
  },
  _onHalveWager: function() {
    var newWager = worldStore.state.coin_type === 'BITS' ? (betStore.state.wager.num / 2).toFixed(2) : (betStore.state.wager.num / 2).toFixed(8);

    Dispatcher.sendAction('UPDATE_WAGER', { str: newWager.toString() });
  },
  _onDoubleWager: function() {
    var n = worldStore.state.coin_type === 'BITS' ? (betStore.state.wager.num * 2).toFixed(2) : (betStore.state.wager.num * 2).toFixed(8);
    Dispatcher.sendAction('UPDATE_WAGER', { str: n.toString() });

  },
  _onMaxWager: function() {
    // If user is logged in, use their balance as max wager
    var balanceBits;
    if (worldStore.state.user) {
      balanceBits = worldStore.state.user.balance / 100;//Math.floor(helpers.convSatstoCointype(worldStore.state.user.balance));//  worldStore.state.user.balance / 100);
    } else {
      balanceBits = 42000;
    }
    Dispatcher.sendAction('UPDATE_WAGER', { str: helpers.convNumtoStr(worldStore.state.user.balance - 1) });
  },
  //
  render: function() {
    var style1 = { borderBottomLeftRadius: '0', borderBottomRightRadius: '0',fontWeight: 'bold' };
    var style2 = { borderTopLeftRadius: '0' };
    var style3 = { borderTopRightRadius: '0' };
    return el.div(
      {className: 'form-group'},
      el.p(
        {className: 'lead',
         style: betStore.state.wager.error ? {fontWeight: 'bold',marginTop: '-15px', color: 'red'} : {fontWeight: 'bold',marginTop: '-15px' }
        },
        'Wager:'
      ),
      el.div({className: 'input-group',style: { marginTop: '-15px' }},
        el.input(
          {
            value: betStore.state.wager.str,
            type: 'text',
            className: 'form-control input-md bot_wager',
            style: style1,
            onChange: this._onWagerChange,
             onClick: this._onWagerChange,
            disabled: ((!!worldStore.state.isLoading)||(betStore.state.BS_Game.state == 'RUNNING')),
            placeholder: 'Bits'
          }
        ),
        el.span(
          {className: 'input-group-addon'},
          worldStore.state.coin_type
        )
      ),
      el.div(
        {className: 'btn-group btn-group-justified'},
        el.div(
          {className: 'btn-group'},
          el.button(
            {
              className: 'btn btn-default btn-sm',
              type: 'button',
              style: style2,
              onClick: this._onHalveWager,
              disabled: ((!!worldStore.state.isLoading)||(betStore.state.BS_Game.state == 'RUNNING'))
            },
            '1/2x ', worldStore.state.hotkeysEnabled ? el.kbd(null, 'X') : ''
          )
        ),
        el.div(
          {className: 'btn-group'},
          el.button(
            {
              className: 'btn btn-default btn-sm',
              type: 'button',
              onClick: this._onDoubleWager,
              disabled: ((!!worldStore.state.isLoading)||(betStore.state.BS_Game.state == 'RUNNING'))
            },
            '2x ', worldStore.state.hotkeysEnabled ? el.kbd(null, 'C') : ''
          )
        ),
        el.div(
          {className: 'btn-group'},
          el.button(
            {
              className: 'btn btn-default btn-sm',
              type: 'button',
              style: style3,
              onClick: this._onMaxWager,
              disabled: ((!!worldStore.state.isLoading)||(betStore.state.BS_Game.state == 'RUNNING'))
            },
            'Max'
          )
        )
      )
    );
  }
});

//var autowait = false;
var prev_hash = '';
var next_hash = '';
var BetBoxButton = React.createClass({
  displayName: 'BetBoxButton',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
    betStore.on('change', this._onStoreChange);
    AutobetStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
    betStore.off('change', this._onStoreChange);
    AutobetStore.off('change', this._onStoreChange);
  },
  getInitialState: function() {
    return { waitingForServer: false };
  },
  // cond is '>' or '<'
  _makeBetHandler: function(cond) {
    var self = this;

    console.assert(cond === '<' || cond === '>');

    return function(e) {
      console.log('Placing bet...');
      // Indicate that we are waiting for server response
      self.setState({ waitingForServer: true });

      //if (betStore.state.nextHash == prev_hash){
        var hash = next_hash;
      //}else {
      //  var hash = betStore.state.nextHash;
      //}
      console.assert(typeof hash === 'string');

      var wagerSatoshis = helpers.convCoinTypetoSats(betStore.state.wager.num);// * 100;
      var multiplier = betStore.state.multiplier.num;
      var payoutSatoshis = wagerSatoshis * multiplier;

      var number = helpers.calcNumber(
        cond, helpers.multiplierToWinProb(multiplier)
      );

      var params = {
        wager: wagerSatoshis,
        client_seed: betStore.state.clientSeed.num,
        hash: hash,
        cond: cond,
        target: helpers.round10(number, -4),
        payout: payoutSatoshis
      };

      console.log('Emitting Socket for dice');
      socket.emit('dice_bet', params, function(err, bet) {
          console.log('Socket returned for dice');
          self.setState({ waitingForServer: false });
        if (err) {
          console.log('[socket] dice_bet failure:', err);
          self.setState({ waitingForServer: false });
          console.log('auto bet stopped from error');
          Dispatcher.sendAction('STOP_RUN_AUTO');
          return;
        }
        if (bet == null){
          console.log('[socket] dice_bet Timedout');
          self.setState({ waitingForServer: false });
          if (cond === '>'){
            $('#bet-hi')[0].click();
          }else {
            $('#bet-lo')[0].click();
          }
          return;
        }
        //autowait = true;
        //setTimeout(function(){ autowait = false;}, 100);
        console.log('[socket] dice_bet success:', bet);
        bet.meta = {
          cond: cond,
          number: number,
          hash: hash,
          kind: 'DICE',
          isFair: CryptoJS.SHA256(bet.secret + '|' + bet.salt).toString() === hash
        };

        // Sync up with the bets we get from socket
        bet.wager = wagerSatoshis;
        bet.uname = worldStore.state.user.uname;

        var last_params = {
          hash: hash,
          salt: bet.salt,
          secret: bet.secret,
          seed: betStore.state.clientSeed.num,
          id: bet.id
        }
        Dispatcher.sendAction('SET_LAST_FAIR', last_params);

        Dispatcher.sendAction('NEW_BET', bet);

        if (!worldStore.state.first_bet)
          {Dispatcher.sendAction('SET_FIRST');}
        // Update next bet hash
        //prev_hash = hash;
        next_hash = bet.next_hash;
        Dispatcher.sendAction('SET_NEXT_HASH', bet.next_hash);
        // Update user balance
        Dispatcher.sendAction('UPDATE_USER', {
          balance: worldStore.state.user.balance + bet.profit
        });

        self.setState({ waitingForServer: false });
        if (betStore.state.randomseed){
            var newseed = Math.floor(Math.random()*(Math.pow(2,32)));
            var str = newseed.toString();
            Dispatcher.sendAction('UPDATE_CLIENT_SEED', { str: str });
          }

        if (AutobetStore.state.Run_Autobet){
          console.log('Auto_bet routine enabled');
          //while(autowait){};
          //setTimeout(function(){ Dispatcher.sendAction('AUTOBET_ROUTINE');}, 50);
          Dispatcher.sendAction('AUTOBET_ROUTINE');
        }else {
          // Force re-validation of wager
          console.log('Auto_bet routine disabled');
          Dispatcher.sendAction('UPDATE_WAGER', { str: betStore.state.wager.str});
        }
      });

    };
  },
  render: function() {
    var innerNode;

    // TODO: Create error prop for each input
    var error = betStore.state.wager.error || betStore.state.multiplier.error || betStore.state.clientSeed.error || betStore.state.ChanceInput.error;

    if (worldStore.state.isLoading) {
      // If app is loading, then just disable button until state change
      innerNode = el.button(
        {type: 'button', disabled: true, className: 'btn btn-lg btn-block btn-default'},
        'Loading...'
      );
    } else if (error) {
      // If there's a betbox error, then render button in error state

      var errorTranslations = {
        'INVALID_SEED': 'Invalid Seed',
        'SEED_TOO_HIGH':'Seed too high',
        'CANNOT_AFFORD_WAGER': 'Balance too low',
        'INVALID_WAGER': 'Invalid wager',
        'WAGER_TOO_LOW': 'Wager too low',
        'WAGER_TOO_PRECISE': 'Wager too precise',
        'INVALID_MULTIPLIER': 'Invalid multiplier',
        'MULTIPLIER_TOO_PRECISE': 'Multiplier too precise',
        'MULTIPLIER_TOO_HIGH': 'Multiplier too high',
        'MULTIPLIER_TOO_LOW': 'Multiplier too low',
        'CHANCE_INVALID_CHARS': 'Invalid Characters in Chance',
        'CHANCE_TOO_LOW': 'Chance too low',
        'CHANCE_TOO_HIGH': 'Chance too high',
        'CHANCE_TOO_PRECISE': 'Chance too Precise'
      };

      innerNode = el.button(
        {type: 'button',
         disabled: true,
         className: 'btn btn-lg btn-block btn-danger'},
        errorTranslations[error] || 'Invalid bet'
      );
    } else if (worldStore.state.user) {
      // If user is logged in, let them submit bet
      innerNode =
        el.div(
          {className: 'row'},
          // bet hi
          el.div(
            {className: 'col-xs-6'},
            el.button(
              {
                id: 'bet-hi',
                type: 'button',
                className: 'btn btn-lg btn-info btn-block',
                onClick: this._makeBetHandler('>'),
                disabled: !!this.state.waitingForServer
              },
              'Bet Hi ', worldStore.state.hotkeysEnabled ? el.kbd(null, 'H') : ''
            )
          ),
          // bet lo
          el.div(
            {className: 'col-xs-6'},
            el.button(
              {
                id: 'bet-lo',
                type: 'button',
                className: 'btn btn-lg btn-info btn-block',
                onClick: this._makeBetHandler('<'),
                disabled: !!this.state.waitingForServer
              },
              'Bet Lo ', worldStore.state.hotkeysEnabled ? el.kbd(null, 'L') : ''
            )
          )
        // Add start autobet
        );
    } else {
      // If user isn't logged in, give them link to /oauth/authorize
      innerNode = el.a(
        {
          href: config.mp_browser_uri + '/oauth/authorize' +
            '?app_id=' + config.app_id +
            '&redirect_uri=' + config.redirect_uri,
          className: 'btn btn-lg btn-block btn-success'
        },
        'Login with MoneyPot'
      );
    }

    return el.div(
      null,
      el.div(
        (AutobetStore.state.ShowAutobet|| AutobetStore.state.Run_Autobet) ? {className: 'col-xs-12 col-md-4'}:{className: 'col-xs-12 col-md-8'},
        innerNode
      )
    );
  }
});

var HotkeyToggle = React.createClass({
  displayName: 'HotkeyToggle',
  _onClick: function() {
    Dispatcher.sendAction('TOGGLE_HOTKEYS');
  },
  render: function() {
    return (
      el.div(
        null,
        el.button(
          {
            type: 'button',
            className: 'btn btn-primary btn-md',
            onClick: this._onClick
          },
          'Hotkeys: ',
          worldStore.state.hotkeysEnabled ?
          el.span({className: 'label label-success'}, 'ON') :
          el.span({className: 'label label-default'}, 'OFF')
        )
      )
    );
  }
});


var SiteEdgeSelect = React.createClass({
  displayName: 'SiteEdgeSelect',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
  },
  _onClickDEC: function() {
    Dispatcher.sendAction('DEC_HOUSE_EDGE');
  },
  _onClickINC: function() {
    Dispatcher.sendAction('INC_HOUSE_EDGE');
  },
  _SETMIN: function(){
  //  Dispatcher.sendAction('MIN_HOUSE_EDGE');
  },
  render: function() {
    return (
      el.div(
       {className: 'btn-group'},
       el.p(
         {className: 'lead', style: { fontWeight: 'bold',marginTop: '-15px' }},
           'House Edge:'
       ),
       el.div(
         {className: 'btn-group btn-group-justified', style: {marginTop: '-15px'}},
         el.div(
           {className: 'btn-group'},
           el.button(
             {type: 'button',
               className: 'btn btn-primary btn-md',
              style: { fontWeight: 'bold', borderTopRightRadius: '0',borderBottomRightRadius: '0'},
              onClick: this._onClickDEC },
             '-'
           )
         ),
         el.div(
           {className: 'btn-group'},
          el.button(
            {className: 'btn btn-default btn-md bot_edge',
              onClick: this._SETMIN},
            (betStore.state.house_edge * 100).toFixed(1).toString() + '%'
            )
          ),
          el.div(
            {className: 'btn-group'},
            el.button(
              {
                type: 'button',
                className: 'btn btn-primary btn-md', style:{fontWeight: 'bold'},
                onClick: this._onClickINC},
              '+'
            )
          )
        )
      )
    );
  }
});


var BetBox = React.createClass({
  displayName: 'BetBox',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  render: function() {
    return el.div(
      null,
      el.div(
        {className: 'panel panel-default'},
        el.div(
          {className: 'panel-body'},
          el.div(
            {className: 'row'},
            el.div(
              {className: 'col-xs-12 col-sm-4 col-md-4 col-lg-2'},//col-xs-12
              React.createElement(BetBoxWager, null)
              ),
            el.div(
              {className: 'col-xs-12 col-sm-8 col-md-8 col-lg-4 well well-sm', style: {marginTop: '-15'}},
              el.div(
                {className: 'col-xs-12 col-sm-6 col-md-6'},
                React.createElement(BetBoxMultiplier, null)
                ),
              el.div(
                {className: 'col-xs-12 col-sm-6 col-md-6'},
                React.createElement(BetBoxChanceInput, null)
                )
            ),
            el.div(
              {className: 'col-xs-12 col-sm-4 col-md-4 col-lg-2'},
              React.createElement(BetBoxClientSeed, null)
            ),
            el.div(
              {className: 'col-xs-6 col-sm-4 col-md-4 col-lg-2'},
              React.createElement(SiteEdgeSelect, null)
            ),

            el.div(
              {className: 'col-xs-6 col-sm-4 col-md-4 col-lg-2'},
              React.createElement(AutobetShowAuto, null)
            ),

          AutobetStore.state.ShowAutobet ? el.div(
            null,
            React.createElement(AutobetForms, null)
            ) :'',
          // HR
            el.div(
              {className: 'row'},
              el.div(
                {className: 'col-xs-12',style: {marginTop: '-15'}},
                el.hr(null)
              )
            ),
            // Bet info bar
            el.div(
              {style: {marginTop: '-15'}},
              el.div(
                {className: 'col-xs-6 col-sm-6 col-md-6 col-lg-2'},//,style: {marginTop: '-15'}},
                React.createElement(BetBoxProfit, null)
              ),
              el.div(
                {className: 'col-xs-6 col-sm-6 col-md-6 col-lg-2'},//,style: {marginTop: '-15'}},
                React.createElement(BetBoxMaxProfit, null)
              ),
              el.div(
                {className: 'col-xs-12 col-sm-6 col-md-6 col-lg-3'},//,style: {marginTop: '-15'}},
                React.createElement(BetBoxTarget, null)
              ),
              el.div(
                {className: 'col-xs-12 col-sm-6 col-md-6 col-lg-3'},//,style: {marginTop: '-15'}},
                React.createElement(BetBoxBalance, null)
              )
            ),
          el.div(
            null,
            React.createElement(BetBoxLastBet,null)
          )
          )
        ),
        el.div(
          {className: 'panel-footer clearfix',style: { marginTop: '-15px' }},
          React.createElement(BetBoxButton, null),
          (AutobetStore.state.ShowAutobet|| AutobetStore.state.Run_Autobet) ? el.div(
            null,
            React.createElement(AutobetButtons, null)
          ):'',
        React.createElement(HotkeyToggle, null)
        )

      )

    );
  }
});

var GameTabs = React.createClass({
  displayName: 'GameTabs',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change_tab', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
    worldStore.on('app_info_update', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change_tab', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
    worldStore.off('app_info_update', this._onStoreChange);
  },
  _makeTabChangeHandler: function(GametabName) {
    var self = this;
    return function() {
      Dispatcher.sendAction('CHANGE_GAME_TAB', GametabName);
    };
  },
  render: function() {
    var jackpotsize;
     if (worldStore.state.jackpotlist.data[worldStore.state.jackpotlist.end] != null){
        jackpotsize = (worldStore.state.currentAppwager - worldStore.state.jackpotlist.data[worldStore.state.jackpotlist.end].sitewager) * 0.001;
      }else{
        jackpotsize = (worldStore.state.currentAppwager - (worldStore.state.currentAppwager - 256929092)) * 0.001;;
      }
    return el.ul(
      {className: 'nav nav-tabs'},
      el.li(
        {className: worldStore.state.currGameTab === 'DICE_GAME' ? 'active' : ''},
        el.a(
          {
            href: 'javascript:void(0)',
            onClick: this._makeTabChangeHandler('DICE_GAME')
          },
          el.span ({className: 'h5', style:{fontWeight: 'bold'}},'Dice')
        )
      ),
      el.li(
        {className: worldStore.state.currGameTab === 'PLINKO' ? 'active' : ''},
        el.a(
          {
            href: 'javascript:void(0)',
            onClick: this._makeTabChangeHandler('PLINKO')
          },
          el.span ({className: 'h5', style:{fontWeight: 'bold'}},'Plinko')
        )
      ),
      el.li(
        {className: worldStore.state.currGameTab === 'ROULETTE' ? 'active' : ''},
        el.a(
          {
            href: 'javascript:void(0)',
            onClick: this._makeTabChangeHandler('ROULETTE')
          },
          el.span ({className: 'h5', style:{fontWeight: 'bold'}},'Roulette')
        )
      ),
      el.li(
        {className: worldStore.state.currGameTab === 'BITSWEEP' ? 'active' : ''},
        el.a(
          {
            href: 'javascript:void(0)',
            onClick: this._makeTabChangeHandler('BITSWEEP')
          },
          el.span ({className: 'h5', style:{fontWeight: 'bold'}},'BitSweep')
        )
      ),
      el.li(
        //{className: 'btn-success'},
      //  el.a(
          {
            className: 'btn btn-md btn-success',
            href: 'javascript:void(0)'//,
          //  disabled: true
            //onClick: this._makeTabChangeHandler('BITSWEEP')
          },
          el.span ({className: 'h5', style:{fontWeight: 'bold'}},
            'Jackpot: ',
            el.span(null,
                        helpers.commafy(helpers.convSatstoCointype(jackpotsize).toString()) + ' ' + worldStore.state.coin_type
                      )
          )
      //  )
      )
    );
  }
});
////END DICE GAME
/////////////////////////////////////////////////////////////

var PlinkoBetButton = React.createClass({
  displayName: 'PlinkoBetButton',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
    betStore.on('change', this._onStoreChange);
    worldStore.on('plinko_game_change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
    betStore.off('change', this._onStoreChange);
    worldStore.on('plinko_game_change', this._onStoreChange);
  },
  getInitialState: function() {
    return { waitingForServer: false };
  },

  _onStartwager: function(n){
    var self = this;
    return function() {
      console.log('Placing plinko bet...');

      var pay_table = betStore.state.pay_tables[n];

      if (!pay_table) {
        alert('Unsupported pay table for row: ' + n);
        return;
      }

      var hash = betStore.state.nextHash;
      console.assert(typeof hash === 'string');

      var wagerSatoshis = helpers.convCoinTypetoSats(betStore.state.wager.num);// * 100;

      // Handle tests
      if (wagerSatoshis === 0) {
        if (worldStore.state.showClassic){
            Dispatcher.sendAction('SPAWN_PUCK', {
              color: n,
              path: generatePath(),
              wager_satoshis: 0,
              profit_satoshis: 0,
              isTest: true
            });
          return;
        }else{
            Dispatcher.sendAction('SPAWN_PEAK', {
              color: n,
              path: generatePath(),
              wager_satoshis: 0,
              profit_satoshis: 0,
              isTest: true
            });
        return;
        }
      }

      // Indicate that we are waiting for server response
      self.setState({ waitingForServer: true });

      var params = {
        hash: hash,
        client_seed: betStore.state.clientSeed.num, //set custom seed
        wager: wagerSatoshis,
        pay_table: pay_table
      };

      socket.emit('plinko_bet', params, function(err, bet) {
        if (err) {
          console.log('[socket] plinko_bet failure:', err);
          self.setState({ waitingForServer: false });
          console.log('auto bet stopped from error');
          Dispatcher.sendAction('STOP_RUN_AUTO');
          return;
        }
        console.log('[socket] plinko_bet success:', bet);
        // We don't get this info from the API, so assoc it for our use
          bet.meta = {
            cond: '>',
            number: 99.99,
            hash: hash,
            kind: 'PLINKO',
            isFair: CryptoJS.SHA256(bet.secret + '|' + bet.salt).toString() === hash
          };
          // Sync up with the bets we get from socket
          bet.wager = wagerSatoshis;
          bet.uname = worldStore.state.user.uname;

          var last_params = {
            hash: hash,
            salt: bet.salt,
            secret: bet.secret,
            seed: betStore.state.clientSeed.num,
            id: bet.id
          }
          Dispatcher.sendAction('SET_LAST_FAIR', last_params);

          // Update next bet hash
          Dispatcher.sendAction('SET_NEXT_HASH', bet.next_hash);
          // Update user balance
          Dispatcher.sendAction('SET_REVEALED_BALANCE');
          Dispatcher.sendAction('UPDATE_USER', {
            balance: worldStore.state.user.balance + bet.profit
          });

          // Dispatcher.sendAction('NEW_BET', bet);
          if (worldStore.state.showClassic){
            Dispatcher.sendAction('SPAWN_PUCK', {
              color: n,
              path: bet.outcome.split(''),
              wager_satoshis: wagerSatoshis,
              profit_satoshis: bet.profit,
              bet: bet,
              isFair: bet.meta.isFair
            });
          }else{
            Dispatcher.sendAction('SPAWN_PEAK', {
              color: n,
              path: bet.outcome.split(''),
              wager_satoshis: wagerSatoshis,
              profit_satoshis: bet.profit,
              bet: bet,
              isFair: bet.meta.isFair
            });
          }

          self.setState({
            waitingForServer: false
          });

          if (betStore.state.randomseed){
              var newseed = Math.floor(Math.random()*(Math.pow(2,32)));
              var str = newseed.toString();
              Dispatcher.sendAction('UPDATE_CLIENT_SEED', { str: str });
            }
          // Force re-validation of wager
          Dispatcher.sendAction('UPDATE_WAGER', {
            str: betStore.state.wager.str
          });


      });

    }

  },

  render: function() {
    var innerNode;

    // TODO: Create error prop for each input
    var error = betStore.state.wager.error || betStore.state.clientSeed.error;

    if (worldStore.state.isLoading) {
      // If app is loading, then just disable button until state change
      innerNode = el.button(
        {type: 'button', disabled: true, className: 'btn btn-lg btn-block btn-default'},
        'Loading...'
      );
    } else if (error) {
      // If there's a betbox error, then render button in error state
      var errorTranslations = {
        'INVALID_SEED': 'Invalid Seed',
        'SEED_TOO_HIGH':'Seed too high',
        'CANNOT_AFFORD_WAGER': 'Balance too low',
        'INVALID_WAGER': 'Invalid wager',
        'WAGER_TOO_LOW': 'Wager too low',
        'WAGER_TOO_PRECISE': 'Wager too precise',
      };

      innerNode = el.button(
        {type: 'button',
         disabled: true,
         className: 'btn btn-lg btn-block btn-danger'},
        errorTranslations[error] || 'Invalid bet'
      );
    } else if (worldStore.state.user) {
      // If user is logged in, let them submit bet
      innerNode = el.div(null,
      el.div(
        {className: 'btn-group btn-group-justified'},
        el.div(
          {className: 'btn-group'},
          el.button(
            { id: 'bet-ROW1',
              type: 'button',
              className: 'btn btn-default btn-lg btn-block',
              style: { fontWeight: 'bold'},
              onClick: this._onStartwager('ROW1'),
              disabled: !!this.state.waitingForServer || worldStore.state.plinko_running
             },
            'ROW 1', worldStore.state.hotkeysEnabled ? el.kbd(null, 'A') : ''
          )
        ),
        el.div(
          {className: 'btn-group'},
          el.button(
            { id: 'bet-ROW2',
              type: 'button',
              className: 'btn btn-success btn-lg btn-block',
              style: { fontWeight: 'bold'},
              onClick: this._onStartwager('ROW2'),
              disabled: !!this.state.waitingForServer || worldStore.state.plinko_running
             },
            'ROW 2', worldStore.state.hotkeysEnabled ? el.kbd(null, 'S') : ''
          )
        ),
        el.div(
          {className: 'btn-group'},
          el.button(
            { id: 'bet-ROW3',
              type: 'button',
              className: 'btn btn-primary btn-lg btn-block',
              style: { fontWeight: 'bold'},
              onClick: this._onStartwager('ROW3'),
              disabled: !!this.state.waitingForServer || worldStore.state.plinko_running
             },
            'ROW 3', worldStore.state.hotkeysEnabled ? el.kbd(null, 'D') : ''
          )
        ),
        el.div(
          {className: 'btn-group'},
          el.button(
            { id: 'bet-ROW4',
              type: 'button',
              className: 'btn btn-info btn-lg btn-block',
              style: { fontWeight: 'bold'},
              onClick: this._onStartwager('ROW4'),
              disabled: !!this.state.waitingForServer || worldStore.state.plinko_running
             },
            'ROW 4', worldStore.state.hotkeysEnabled ? el.kbd(null, 'F') : ''
          )
        ),
        el.div(
          {className: 'btn-group'},
          el.button(
            { id: 'bet-ROW5',
              type: 'button',
              className: 'btn btn-warning btn-lg btn-block',
              style: { fontWeight: 'bold'},
              onClick: this._onStartwager('ROW5'),
              disabled: !!this.state.waitingForServer || worldStore.state.plinko_running
             },
            'ROW 5', worldStore.state.hotkeysEnabled ? el.kbd(null, 'G') : ''
          )
        )
      )
      );
    }else {
      // If user isn't logged in, give them link to /oauth/authorize
      innerNode = el.a(
        {
          href: config.mp_browser_uri + '/oauth/authorize' +
            '?app_id=' + config.app_id +
            '&redirect_uri=' + config.redirect_uri,
          className: 'btn btn-lg btn-block btn-success'
        },
        'Login with MoneyPot'
      );
    }

      return el.div(
        null,

        innerNode
      );
    }
});


var PlinkoBetHistory = React.createClass({
  displayName: 'PlinkoBetHistory',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('new_user_bet', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('new_user_bet', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },

  render: function(){
    var last_bet = '';
    var last_wager = helpers.convNumtoStr(100);
    var last_profit = helpers.convNumtoStr(100);
    last_bet = '';

    if (worldStore.state.first_bet){
     last_bet = (worldStore.state.bets.data[worldStore.state.bets.end].bet_id||worldStore.state.bets.data[worldStore.state.bets.end].id);
     last_wager = helpers.convNumtoStr(worldStore.state.bets.data[worldStore.state.bets.end].wager);
     last_profit = worldStore.state.bets.data[worldStore.state.bets.end].profit;
    }

    return el.div(
      null,
      el.div(
        {className:'well well-sm col-xs-12'},
        el.div(
          { className: 'col-xs-4'},
          el.div(
          {className: 'text'},
          'Last Bet: ',
          el.span(
              {className: 'text'},
              el.a(
                {
                  href: config.mp_browser_uri + '/bets/' + last_bet,
                  target: '_blank'
                },
                last_bet
              )
          )
         )
        ),
        el.div(
          { className: 'col-xs-4'},
          el.div(
            {className: 'text'},
            'Wager: ',
          el.span(
            {className: 'text'},
            last_wager,
            worldStore.state.coin_type
          )
         )
        ),
        el.div(
          { className: 'col-xs-4'},
          el.div(
          {className: 'text'},
          'Profit: ',
          el.span(
            {className: 'text', style: { color: last_profit > 0 ? 'green' : 'red'}},
           last_profit > 0 ? '+' + helpers.convNumtoStr(last_profit) : helpers.convNumtoStr(last_profit),
           worldStore.state.coin_type
          )
        )
        )
      )
    );
  }

});

var PayoutEditor = React.createClass({
  displayName: 'PayoutEditor',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
    worldStore.on('plinko_game_change', this._onStoreChange);
    worldStore.on('plinko_render_change',this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
    worldStore.off('plinko_game_change', this._onStoreChange);
    worldStore.off('plinko_render_change',this._onStoreChange);
  },
  _toStrings: function(array) {
    return array.map(function(n) { return n.toString(); });
  },

  getInitialState: function() {
    // User-editable payout strings that must validate before they are
    // transformed into numbers and updated in worldStore
    return {
      ROW1: {
        error: undefined,
        strings: this._toStrings(betStore.state.pay_tables.ROW1),
      },
      ROW2: {
        error: undefined,
        strings: this._toStrings(betStore.state.pay_tables.ROW2),
      },
      ROW3: {
        error: undefined,
        strings: this._toStrings(betStore.state.pay_tables.ROW3)
      },
      ROW4: {
        error: undefined,
        strings: this._toStrings(betStore.state.pay_tables.ROW4)
      },
      ROW5: {
        error: undefined,
        strings: this._toStrings(betStore.state.pay_tables.ROW5)
      }
    };
  },
  _onReset: function() {
    // Reset state back to how it is in the store
    var originalState =  {
      ROW1: {
        error: undefined,
        strings: this._toStrings(betStore.state.pay_tables.ROW1),
      },
      ROW2: {
        error: undefined,
        strings: this._toStrings(betStore.state.pay_tables.ROW2),
      },
      ROW3: {
        error: undefined,
        strings: this._toStrings(betStore.state.pay_tables.ROW3)
      },
      ROW4: {
        error: undefined,
        strings: this._toStrings(betStore.state.pay_tables.ROW4)
      },
      ROW5: {
        error: undefined,
        strings: this._toStrings(betStore.state.pay_tables.ROW5),
      }
    };

    this.replaceState(originalState);
  },
  // Validates current state and sets errors if necessary
  _validateState: function() {
    // House edge must be >= 0.80
    var self = this;
    var _state = _.clone(this.state);
    ['ROW1', 'ROW2', 'ROW3', 'ROW4', 'ROW5'].forEach(function(row) {
      var edge = helpers.payTableToEdge(helpers.toFloats(_state[row].strings));
      console.log(row + ' edge:', edge);

      // Will be first invalid payout in this row or undefined if valid
      var invalidPayout = _.some(
        _state[row].strings,
        _.negate(helpers.isValidPayout)
      );

      if (invalidPayout) {
        _state[row].error = 'INVALID_PAYOUT';
      } else if (edge < 0.80) {
        _state[row].error = 'EDGE_TOO_SMALL';
      } else {
        // Valid
        _state[row].error = null;
      }

    });

    // Now update state
    this.setState(_state);
  },
  _onSave: function() {
    console.log('saving...', this.state.ROW5);
    Dispatcher.sendAction('UPDATE_PAY_TABLES', {
      ROW1: helpers.toFloats(this.state.ROW1.strings),
      ROW2: helpers.toFloats(this.state.ROW2.strings),
      ROW3: helpers.toFloats(this.state.ROW3.strings),
      ROW4: helpers.toFloats(this.state.ROW4.strings),
      ROW5: helpers.toFloats(this.state.ROW5.strings)
    });
  },
  _makeChangeHandler: function(row, idx) {
    var self = this;
    return function _changeHandler(e) {
      // TODO: Validate that it's legit float

      var oldState = _.clone(self.state);
      oldState[row].strings[idx] = e.target.value.slice(0, 4);
      self.setState(oldState);
      self._validateState();
    };
  },
  // takes row string, returns number
  _calcHouseEdge: function(row) {
    var n = helpers.round10(
      helpers.payTableToEdge(
        helpers.toFloats(this.state[row].strings)
      ),
      -2
    );
    return n;
  },
  _translateErrorConstant: (function() {
    var constants = {
      'EDGE_TOO_SMALL': 'House edge must be at least 0.80%',
      'INVALID_PAYOUT': 'At least one payout in this row is invalid'
    };
    return function(constant) {
      return constants[constant];
    };
  })(),

  _onHideEditor: function() {
    Dispatcher.sendAction('TOGGLE_PAYOUT_EDITOR');
  },
  // This is a super approximation
  // Returns number (bits) or undefined if it cannot be calculated from
  // current payout state due to error
  _calcMaxBet: function(row) {
    // Short-circuit on error
    if (this.state[row].error) {
      return;
    }
    var maxPayout = _.max(helpers.toFloats(this.state[row].strings));

    // Don't divide by zero
    if (maxPayout === 0) {
      return;
    }
    //'Invested: ' + helpers.convSatstoCointype(worldStore.state.bankrollbalance).toString() + ' ' + worldStore.state.coin_type
    var edge = this._calcHouseEdge(row);
    var maxBet = worldStore.state.bankrollbalance / (maxPayout-1) * (edge/100);
    return helpers.floor10(maxBet/100, -2);
  },
  // Prevent accidental bets when editing input fields when hotkeys
  // are enabled
  _onInputFocus: function() {
    if (worldStore.state.hotkeysEnabled) {
      Dispatcher.sendAction('DISABLE_HOTKEYS');
    }
  },
  render: function() {
    var self = this;

    var isError = _.some(['ROW1', 'ROW2', 'ROW3', 'ROW4', 'ROW5'], function(row) {
      return self.state[row].error;
    });

    // True if pucks are still on the board
    var stillAnimatingPucks = _.keys(worldStore.state.renderedPucks).length > 0;

    return (
      el.div(
        {className: 'panel panel-default'},
        el.div(
          {className: 'panel-heading'},
          el.button(
            {
              className: 'btn btn-link pull-right',
              type: 'button',
              onClick: this._onHideEditor
            },
            'Hide'
          ),
          el.h5(
            null,
            'Payout Editor'
          )
        ),
        el.div(
          {className: 'panel-body'},
          el.p(
            {},
            'Custum Payout Requirements:',
            el.ul(
              null,
              el.li(
                null,
                'House edge must be at least ',
                 el.span({style:{color: '#ffffff',backgroundColor: config.hexColors.dark['ROW2']}}, '0.80%')
              ),
              el.li(
                null,
                'Payouts can be in the range of ',
                el.span({style:{color: '#ffffff',backgroundColor: config.hexColors.dark['ROW2']}}, '0.00 to 9999')
              ),
              el.li(
                null,
                'The max bet allowed on a row is determined by the row\'s highest payout and house edge',
              el.li(
                null,
                'The max bets below are approximate and based off the ',
                el.a({
                        href: 'https://www.moneypot.com/investment',
                        target: '_blank'
                      },
                      'Moneypot bankroll'
                    ),
                    ' of ',
                    el.span({style:{color: '#ffffff',backgroundColor: config.hexColors.dark['ROW2']}},
                      helpers.commafy(helpers.convSatstoCointype(worldStore.state.bankrollbalance).toString())
                    ),
                    ' ' + worldStore.state.coin_type//' bits'
                  )

              )
            )
          ),
          el.hr(),
          ['ROW1', 'ROW2', 'ROW3', 'ROW4', 'ROW5'].map(function(row) {
            return el.div(
              {
                key: row
              },
              el.div({className:'well well-sm'},
              el.p(
                null,
                el.span(
                  {
                    style: {
                      color: '#ffffff',
                      backgroundColor: config.hexColors.dark[row],
                      padding: '2px 3px',
                      width: '100px',
                      display: 'inline-block',
                      textAlign: 'center'
                    }
                  },
                  _.capitalize(row)
                ),
                ' ',
                el.span(
                  {
                    style: {
                      fontFamily: 'Courier New'
                    }
                  },
                  el.span(
                    {
                      style: {
                        borderBottom: '1px solid #333',
                        borderColor: (self.state[row].error === 'EDGE_TOO_SMALL' || _.isNaN(self._calcHouseEdge(row))) ?
                          'red' : '#333',
                        color: (self.state[row].error === 'EDGE_TOO_SMALL' || _.isNaN(self._calcHouseEdge(row))) ?
                          'red' : '#ffffff'
                      }
                    },
                    (self.state[row].error && self.state[row].error !== 'EDGE_TOO_SMALL') ?
                      'XXX' :
                      self._calcHouseEdge(row).toFixed(2) + '%'
                  ),
                  ' house edge, '
                ),
                // Max bet approximation
                el.span(
                  {
                    style: {
                      fontFamily: 'Courier New'
                    }
                  },
                  '~',
                  (function() {
                    // Number (bits) or undefined (error)
                    var maxBet = self._calcMaxBet(row);

                    return el.span(
                      {
                        style: {borderBottom: '1px solid #333'}
                      },
                      maxBet ? helpers.commafy(helpers.convSatstoCointype(maxBet * 100).toString()) :
                        'XXX'
                    );
                  })(),
                  ' ' + worldStore.state.coin_type + ' Max Bet'
                ),
                // Display error if there is one
                ' ',
                self.state[row].error ?
                  el.span(
                    {
                      style: {
                        color: 'red'
                      }
                    },
                    self._translateErrorConstant(self.state[row].error)
                  ) :
                  ''

              ),
              self.state[row].strings.map(function(payoutStr, idx) {
                return el.span(
                  { key: row + '-' + idx },
                  el.input(
                    {
                      key: row + '-' + idx,
                      type: 'text',
                      className: 'form-control input-sm payout-control',
                      value: payoutStr,
                      style: {
                        fontFamily: 'Courier New',
                        width: '55px',
                        display: 'inline-block',
                        marginLeft: '5px',
                        marginBottom: '10px',
                        fontWeight: 'bold',
                        borderColor: (self.state[row].error === 'INVALID_PAYOUT' && !helpers.isValidPayout(payoutStr)) ?
                          'red' : '#ccc',
                        color: (self.state[row].error === 'INVALID_PAYOUT' && !helpers.isValidPayout(payoutStr)) ?
                          'red' : '#333'
                      },
                      onChange: self._makeChangeHandler(row, idx),
                      onFocus: self._onInputFocus
                    }
                  )

                );
              })
            )
            );
          })
        ),
        el.div(
          {className: 'panel-footer'},
          el.button(
            {
              type: 'button',
              className: 'btn btn-default',
              onClick: this._onReset
            },
            'Reset'
          ),
          ' ',
          el.button(
            {
              type: 'button',
              className: 'btn btn-primary',
              onClick: this._onSave,
              // Disable if there's any validation error
              // Also disable until pucks are finished animating, wait til they are removed
              disabled: isError || stillAnimatingPucks
            },
            'Save'
          ),
          ' ',
          isError ?
            el.span(
              {
                style: {
                  color: 'red'
                }
              },
              'You must fix the errors before you can save'
            ) :
            stillAnimatingPucks ?
              el.span(
                {
                  style: {
                    color: 'red'
                  }
                },
                'Wait until pucks are finished animating'
              ) :
              'Clicking save will update the current payouts below the game'
        )
      )
    );
  }
});


var PlinkoBetBox = React.createClass({
  displayName: 'PlinkoBetBox',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  _toggleClassic: function(){
  Dispatcher.sendAction('TOGGLE_BOARD_TYPE');
  },
  render: function() {
    // True if pucks are still on the board
    //var stillAnimatingPucks = _.keys(worldStore.state.renderedPucks).length > 0;
    return el.div(
      null,
      el.div(
        {className: 'panel panel-default'},
        el.div(
          {className: 'panel-heading'},
          el.div(
            {className: 'row'},
            el.div({className: 'text-right col-xs-3'},
              el.button({type: 'button', className: 'btn btn-md btn-primary', onClick: this._toggleClassic},'Toggle Board Type')
            ),
            el.div(
              {className: 'text-right col-xs-3'},
              React.createElement(HotkeyToggle, null)
            )
          )
        )
      )
    );
  }
});


function plinkobase(num) {
            var rtn = [];
            var n = 20;

            while (rtn.length < num) {
              rtn.push(n);
              if (rtn.length < num/2 ){
                  n += 10;
                }else{
                  n -= 10;
                }

            }
            return rtn;
  }

var data2 = {
    labels: labelfill(config.c),
    datasets: [ {
            label: "dataset1",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: plinkobase(config.c)
          } ]
};

var PlinkoChart = React.createClass({
displayName:'PlinkoChart',
_onStoreChange: function() {
  this.forceUpdate();
},
componentDidMount: function() {
  worldStore.on('plinko_game_change', this._onStoreChange);
},
componentWillUnmount: function() {
  worldStore.off('plinko_game_change', this._onStoreChange);
},

render: function() {
  console.log('[NewPlinkoChart]');
  //  <canvas id="plinko-canvas" width="750" height="280"></canvas>
  var props = { data: data2};
  var factory = React.createFactory(Chart.React['Bar']);
  var options = {
      options:{
        animation: false,
        pointDot : false,
        showScale: false,
        responsive: true,
        barValueSpacing : 3,
        showTooltips: false,

        scaleOverride: true,
        // ** Required if scaleOverride is true **
        // Number - The number of steps in a hard coded scale
        scaleSteps: config.n + 1,
        // Number - The value jump in the hard coded scale
        scaleStepWidth: 10,
        // Number - The scale starting value
        scaleStartValue: 0
  //      pointHitDetectionRadius : 5
        }
      };
  var _props = _.defaults({
    data: data2
  },options, props);

  var component = new factory(_props);

  return el.div(null,
        component
      );
  }
});


var pay_key = 0;

function generatebuttons(color,targetpayout,level){
  var rtn = [];
  var localcolor;
  var n;
  while (rtn.length < targetpayout.length) {
    n = rtn.length;
    switch (n)
          {
            case 0:
              if (Number(data2.datasets[0].data[0]) < 1)
                {
                localcolor = 'btn-default';
                }
              else if ((Number(data2.datasets[0].data[0]) > 1) && (Number(data2.datasets[0].data[1]) < 1) && (worldStore.state.payout_level === level)){
                localcolor = 'btn-warning';
              }else {
                localcolor = color;
              }
              break;
            case targetpayout.length - 1:
              if (Number(data2.datasets[0].data[30]) < 1)
                {
                localcolor = 'btn-default';
                }
              else if ((Number(data2.datasets[0].data[30]) > 1) && (Number(data2.datasets[0].data[29]) < 1) && (worldStore.state.payout_level === level)){
                localcolor = 'btn-warning';
              }else {
                localcolor = color;
              }
              break;
            default:
              if (Number(data2.datasets[0].data[(n * 2)-1]) < 1)
                {
                localcolor = 'btn-default';
                }
              else if ((Number(data2.datasets[0].data[(n * 2)-1]) > 1) && ((Number(data2.datasets[0].data[(n * 2)-2]) < 1)&& (Number(data2.datasets[0].data[(n * 2)]) < 1)) && (worldStore.state.payout_level === level)){
                localcolor = 'btn-warning';
              }else {
                localcolor = color;
              }
              break;

          }
    pay_key += 1;
    rtn.push(
        el.div({className:'btn-group',style: { marginLeft: '5px'},key: pay_key },
          el.button(
              {
                type: 'button',
                className: 'btn btn-sm ' + localcolor,
                style: { fontWeight: 'bold'},
                disabled: true
               },
              targetpayout[rtn.length].toString() + 'x'
            )
          )
        );

  }
  return rtn;
}


var PlinkoPayOuts = React.createClass({
  displayName: 'PlinkoPayOuts',

  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('plinko_game_change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('plinko_game_change', this._onStoreChange);
  },
//betStore.state.pay_tables.ROW1
  render: function() {
    var innernode0;
    var innernode1;
    var innernode2;
    var innernode3;
    var innernode4;
    innernode0 = el.div({className:'btn-group btn-group-justified'},
                  generatebuttons('btn-default',betStore.state.pay_tables.ROW1,'ROW1')
                );
    innernode1 = el.div({className:'btn-group btn-group-justified'},
                  generatebuttons('btn-success',betStore.state.pay_tables.ROW2,'ROW2')
                );
    innernode2 = el.div({className:'btn-group btn-group-justified'},
                  generatebuttons('btn-primary',betStore.state.pay_tables.ROW3,'ROW3')
                );
    innernode3 = el.div({className:'btn-group btn-group-justified'},
                  generatebuttons('btn-info',betStore.state.pay_tables.ROW4,'ROW4')
                );
    innernode4 = el.div({className:'btn-group btn-group-justified'},
                  generatebuttons('btn-warning',betStore.state.pay_tables.ROW5,'ROW5')
                );
    return el.div(
      null,
      el.div({className:'row'},
      innernode0
      ),
      el.div({className:'row'},
      innernode1
      ),
      el.div({className:'row'},
      innernode2
      ),
      el.div({className:'row'},
      innernode3
      ),
      el.div({className:'row'},
      innernode4
      )
    );
  }
});

// Repaint at 60fps
var fps = 60;
function paint() {
  setTimeout(function() {
    requestAnimationFrame(paint);
    if (Object.keys(worldStore.state.renderedPucks).length > 0) {
      canvas.renderAll();
    }
  }, 1000/fps);
}

var ClassicBoard = React.createClass({
  displayName: 'ClassicBoard',
  shouldComponentUpdate: function() {
    return false;
  },
  componentDidMount: function() {
    console.log('Mounting ClassicBoard...');
    // prep canvas
    //initializeBoard();
    canvas = new fabric.Canvas('board');
    canvas.selection = false;

    canvas.setDimensions({
      width: config.table_width,
      height: config.table_height+10// - 50
    });

    // mutate global kanvas reference
    kanvas = new Kanvas(canvas);
    kanvas.renderAll();
    paint();
  },
  render: function() {
    return el.canvas(
      {
        id: 'board',
        style: {
           marginTop:'-20px',
           marginLeft: '-17px'
        }
      },
      null
    );
  }
});


var PlinkoGameBoard = React.createClass({
  displayName: 'PlinkoGameBoard',

  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('plinko_payout_change', this._onStoreChange);
    worldStore.on('plinko_board_change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('plinko_payout_change', this._onStoreChange);
    worldStore.off('plinko_board_change', this._onStoreChange);
  },
  _toggleEditor: function(){
  Dispatcher.sendAction('TOGGLE_PAYOUT_EDITOR');
  },
  _toggleClassic: function(){
  Dispatcher.sendAction('TOGGLE_BOARD_TYPE');
  },

  render: function() {
    return el.div(
      null,
      el.div(
        {className: 'panel panel-default',style:{marginTop:'-7px'}},
        el.div(
          {className: 'panel-body'},
          worldStore.state.showClassic ?
              el.div(
                {className: 'col-xs-12 board-container',style: {marginBottom:'-170px'}},
                React.createElement(ClassicBoard, null)
              ) :
                  el.div(
                    {className: 'col-xs-12'},
                    React.createElement(PlinkoChart, null)
                  ),
          el.div(
            {className: worldStore.state.showClassic ? 'col-xs-9' :'col-xs-12'},
            React.createElement(PlinkoPayOuts,null)
          )
        ),
        el.div(
          {className:'panel-footer'},
          el.div(
            {className:'row'},
            el.div(
              {className:'well well-sm col-xs-6',style:{marginBottom:'-5px',marginLeft:'5px'}},
              el.div(
                {className: 'col-xs-12'},
                React.createElement(PlinkoBetButton, null)
              )
            ),
            el.div(
              {className: 'col-xs-2'},
              React.createElement(BetBoxWager, null)
            ),
            el.div(
              {className: 'col-xs-2'},
              React.createElement(BetBoxClientSeed, null)
            )
          ),
          el.div(
            {className:'row'},
            el.div(
              {className: 'col-xs-8'},
             React.createElement(PlinkoBetHistory,null)
            ),
            el.div(
              {className: 'col-xs-4'},
             React.createElement(BetBoxBalance, null)
            )

          ),
          el.div(
            {className:'row'},
            el.div({className: 'col-xs-3'},
              el.button({type: 'button', className: 'btn btn-md btn-primary', onClick: this._toggleEditor},'Toggle Payout Editor')
            ),
            el.div(
              {className: 'col-xs-3'},
              ''//React.createElement(AutobetShowAuto, null)
            )
          )
        )
      ),
      worldStore.state.showPayoutEditor ? React.createElement(PayoutEditor,null) : ''
    );
  }
});

////END PLINKO GAME
////////////////////////////////////////////////////////////

var RouletteBoard = React.createClass({
  displayName: 'RouletteBoard',

  render: function (){
    var last_wager;
    var last_profit;
    var lastbetnode;
    var bet_table;

    if (worldStore.state.first_bet){
       last_wager = helpers.convNumtoStr(worldStore.state.bets.data[worldStore.state.bets.end].wager);
       last_profit = worldStore.state.bets.data[worldStore.state.bets.end].profit;
     }else {
       last_wager = '--';
       last_profit = 0.00;
     }

    lastbetnode = el.div(null,
            el.div({className: 'lead',style:{marginTop:'20px'}},
            'Wager: ',
            el.span ({className:'text'}, last_wager + ' ' + worldStore.state.coin_type)
          ),
          el.div({className: 'lead'},
            'Profit: ',
            el.span(
              {className: 'text'},
             last_profit > 0 ? '+' + helpers.convNumtoStr(last_profit) : helpers.convNumtoStr(last_profit) + ' ',
             worldStore.state.coin_type
            )
        )
    );

    bet_table = el.div(null,
      el.table({className:'R_bet_table'},
        el.tbody(
          null,
          el.tr(null,
            el.td(
              {className:'rt-0 0', rowSpan:'3'},
              el.p(null,'0'),
              el.button ({className:'C_CHIP', type:'button'},''),
        		  el.div ({className:'four-bet'},''),
              el.div ({className:'tri1-bet'},''),
              el.div ({className:'tri2-bet'},''),
              el.div ({className:'split03-bet'},''),
              el.div ({className:'split02-bet'},''),
              el.div ({className:'split01-bet'},'')
            ),
            el.td(
              {className:'rt-red ODD R1 D12 S18 3'},
              el.p(null,'3'),
              el.button ({className:'C_CHIP',type: 'button'},''),
              el.div ({className:'SplitH-bet'},''),
              el.div ({className:'SplitV-bet'},''),
              el.div ({className:'Corner-bet'},'')
            ),
            el.td(
              {className:'rt-black EVEN R1 D12 S18 6'},
              el.p(null,'6'),
              el.button ({className:'C_CHIP',type: 'button'},''),
              el.div ({className:'SplitH-bet'},''),
              el.div ({className:'SplitV-bet'},''),
              el.div ({className:'Corner-bet'},'')
            ),
            el.td(
              {className:'rt-red ODD R1 D12 S18 9'},
              el.p(null,'9'),
              el.button ({className:'C_CHIP',type: 'button'},''),
              el.div ({className:'SplitH-bet'},''),
              el.div ({className:'SplitV-bet'},''),
              el.div ({className:'Corner-bet'},'')
            ),
            el.td(
              {className:'rt-red EVEN R1 D12 S18 12'},
              el.p(null,'12'),
              el.button ({className:'C_CHIP',type: 'button'},''),
              el.div ({className:'SplitH-bet'},''),
              el.div ({className:'SplitV-bet'},''),
              el.div ({className:'Corner-bet'},'')
            ),
            el.td(
              {className:'rt-black ODD R1 D24 S18 15'},
              el.p(null,'15'),
              el.button ({className:'C_CHIP',type: 'button'},''),
              el.div ({className:'SplitH-bet'},''),
              el.div ({className:'SplitV-bet'},''),
              el.div ({className:'Corner-bet'},'')
            ),
            el.td(
              {className:'rt-red EVEN R1 D24 S18 18'},
              el.p(null,'18'),
              el.button ({className:'C_CHIP',type: 'button'},''),
              el.div ({className:'SplitH-bet'},''),
              el.div ({className:'SplitV-bet'},''),
              el.div ({className:'Corner-bet'},'')
            ),
            el.td(
              {className:'rt-red ODD R1 D24 S36 21'},
              el.p(null,'21'),
              el.button ({className:'C_CHIP',type: 'button'},''),
              el.div ({className:'SplitH-bet'},''),
              el.div ({className:'SplitV-bet'},''),
              el.div ({className:'Corner-bet'},'')
            ),
            el.td(
              {className:'rt-black EVEN R1 D24 S36 24'},
              el.p(null,'24'),
              el.button ({className:'C_CHIP',type: 'button'},''),
              el.div ({className:'SplitH-bet'},''),
              el.div ({className:'SplitV-bet'},''),
              el.div ({className:'Corner-bet'},'')
            ),
            el.td(
              {className:'rt-red ODD R1 D36 S36 27'},
              el.p(null,'27'),
              el.button ({className:'C_CHIP',type: 'button'},''),
              el.div ({className:'SplitH-bet'},''),
              el.div ({className:'SplitV-bet'},''),
              el.div ({className:'Corner-bet'},'')
            ),
            el.td(
              {className:'rt-red EVEN R1 D36 S36 30'},
              el.p(null,'30'),
              el.button ({className:'C_CHIP',type: 'button'},''),
              el.div ({className:'SplitH-bet'},''),
              el.div ({className:'SplitV-bet'},''),
              el.div ({className:'Corner-bet'},'')
            ),
            el.td(
              {className:'rt-black ODD R1 D36 S36 33'},
              el.p(null,'33'),
              el.button ({className:'C_CHIP',type: 'button'},''),
              el.div ({className:'SplitH-bet'},''),
              el.div ({className:'SplitV-bet'},''),
              el.div ({className:'Corner-bet'},'')
            ),
            el.td(
              {className:'rt-red EVEN R1 D36 S36 36'},
              el.p(null,'36'),
              el.button ({className:'C_CHIP',type: 'button'},''),
              el.div ({className:'SplitV-bet'},'')
            ),
            el.td({className: 'rt-green R1_SEL'},el.p(null,'R1'),el.button ({className:'R1_CHIP',type: 'button'},''))
          ),
        el.tr(null,
          el.td(
          {className:'rt-black EVEN R2 D12 S18 2'},
            el.p(null,'2'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'SplitV-bet'},''),
            el.div ({className:'Corner-bet'},'')
          ),
          el.td(
            {className:'rt-red ODD R2 D12 S18 5'},
            el.p(null,'5'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'SplitV-bet'},''),
            el.div ({className:'Corner-bet'},'')
          ),
          el.td(
            {className:'rt-black EVEN R2 D12 S18 8'},
            el.p(null,'8'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'SplitV-bet'},''),
            el.div ({className:'Corner-bet'},'')
          ),
          el.td(
          {className:'rt-black ODD R2 D12 S18 11'},
            el.p(null,'11'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'SplitV-bet'},''),
            el.div ({className:'Corner-bet'},'')
          ),
          el.td(
            {className:'rt-red EVEN R2 D24 S18 14'},
            el.p(null,'14'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'SplitV-bet'},''),
            el.div ({className:'Corner-bet'},'')
          ),
          el.td(
            {className:'rt-black ODD R2 D24 S18 17'},
            el.p(null,'17'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'SplitV-bet'},''),
            el.div ({className:'Corner-bet'},'')
          ),
          el.td(
          {className:'rt-black EVEN R2 D24 S36 20'},
            el.p(null,'20'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'SplitV-bet'},''),
            el.div ({className:'Corner-bet'},'')
          ),
          el.td(
            {className:'rt-red ODD R2 D24 S36 23'},
            el.p(null,'23'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'SplitV-bet'},''),
            el.div ({className:'Corner-bet'},'')
          ),
          el.td(
            {className:'rt-black EVEN R2 D36 S36 26'},
            el.p(null,'26'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'SplitV-bet'},''),
            el.div ({className:'Corner-bet'},'')
          ),
          el.td(
          {className:'rt-black ODD R2 D36 S36 29'},
            el.p(null,'29'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'SplitV-bet'},''),
            el.div ({className:'Corner-bet'},'')
          ),
          el.td(
            {className:'rt-red EVEN R2 D36 S36 32'},
            el.p(null,'32'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'SplitV-bet'},''),
            el.div ({className:'Corner-bet'},'')
          ),
          el.td(
            {className:'rt-black ODD R2 D36 S36 35'},
            el.p(null,'35'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitV-bet'},'')
          ),
          el.td({className: 'rt-green R2_SEL'},el.p(null,'R2'),el.button ({className:'R2_CHIP',type: 'button'},''))
        ),
        el.tr(null,
          el.td(
          {className:'rt-red ODD R3 D12 S18 1'},
            el.p(null,'1'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'Street-bet'},''),
            el.div ({className:'StreetCorner-bet'},'')
          ),
          el.td(
            {className:'rt-black EVEN R3 D12 S18 4'},
            el.p(null,'4'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'Street-bet'},''),
            el.div ({className:'StreetCorner-bet'},'')
          ),
          el.td(
            {className:'rt-red ODD R3 D12 S18 7'},
            el.p(null,'7'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'Street-bet'},''),
            el.div ({className:'StreetCorner-bet'},'')
          ),
          el.td(
          {className:'rt-black EVEN R3 D12 S18 10'},
            el.p(null,'10'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'Street-bet'},''),
            el.div ({className:'StreetCorner-bet'},'')
          ),
          el.td(
            {className:'rt-black ODD R3 D24 S18 13'},
            el.p(null,'13'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'Street-bet'},''),
            el.div ({className:'StreetCorner-bet'},'')
          ),
          el.td(
            {className:'rt-red EVEN R3 D24 S18 16'},
            el.p(null,'16'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'Street-bet'},''),
            el.div ({className:'StreetCorner-bet'},'')
          ),
          el.td(
          {className:'rt-red ODD R3 D24 S36 19'},
            el.p(null,'19'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'Street-bet'},''),
            el.div ({className:'StreetCorner-bet'},'')
          ),
          el.td(
            {className:'rt-black EVEN R3 D24 S36 22'},
            el.p(null,'22'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'Street-bet'},''),
            el.div ({className:'StreetCorner-bet'},'')
          ),
          el.td(
            {className:'rt-red ODD R3 D36 S36 25'},
            el.p(null,'25'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'Street-bet'},''),
            el.div ({className:'StreetCorner-bet'},'')
          ),
          el.td(
          {className:'rt-black EVEN R3 D36 S36 28'},
            el.p(null,'28'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'Street-bet'},''),
            el.div ({className:'StreetCorner-bet'},'')
          ),
          el.td(
            {className:'rt-black ODD R3 D36 S36 31'},
            el.p(null,'31'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'Street-bet'},''),
            el.div ({className:'StreetCorner-bet'},'')
          ),
          el.td(
            {className:'rt-red EVEN R3 D36 S36 34'},
            el.p(null,'34'),
            el.button ({className:'C_CHIP',type: 'button'},''),
            el.div ({className:'Street-bet'},'')
          ),
          el.td({className: 'rt-green R3_SEL'},el.p(null,'R3'),el.button ({className:'R3_CHIP',type: 'button'},''))
        ),
        el.tr(null,el.td({style:{border:'none',height:'40px'}, colSpan:'14'},'')),
        el.tr( {style:{borderRadius:'15px'}},
          el.td( {style:{border:'none'}, rowSpan:'3'},''),
          el.td ({className:'rt-green r1 D12', colSpan:'4'},el.p(null,'1-12'),el.button ({className:'D12_CHIP',type: 'button'},'')),
          el.td ({className:'rt-green r1 D24', colSpan:'4'},el.p(null,'13-24'),el.button ({className:'D24_CHIP',type: 'button'},'')),
          el.td ({className:'rt-green r1 D36', colSpan:'4'},el.p(null,'25-36'),el.button ({className:'D36_CHIP',type: 'button'},'')),
          el.td( {style:{border:'none'}, rowSpan:'3'},'')
        ),
        el.tr(null,
          el.td ({className:'rt-green r2 S18', colSpan:'6'},el.p(null,'1-18'),el.button ({className:'S18_CHIP',type: 'button'},'')),
          el.td ({className:'rt-green r2 S36', colSpan:'6'},el.p(null,'19-36'),el.button ({className:'S36_CHIP',type: 'button'},''))
        ),
        el.tr(null,
          el.td ({className:'rt-green r3 ODD_SEL', colSpan:'3'},el.p(null,'ODD'),el.button ({className:'O_CHIP',type: 'button'},'')),
          el.td ({className:'rt-red r3 RED_SEL', colSpan:'3'},el.p(null,'RED'),el.button ({className:'R_CHIP',type: 'button'},'')),
          el.td ({className:'rt-black r3 BLACK_SEL', colSpan:'3'},el.p(null,'BLACK'),el.button ({className:'B_CHIP',type: 'button'},'')),
          el.td ({className:'rt-green r3 EVEN_SEL', colSpan:'3'},el.p(null,'EVEN'),el.button ({className:'E_CHIP',type: 'button'},''))
        )
        )
      )
    );

    return el.div(
      null,
      el.div(
        {className: 'RouletteTable', id: 'R-Table'},
        el.div ({className: 'rt'},
          el.div ({className: 'rt-field'},
            //el.div ({className:'rt-mask'},''),
            bet_table
          ),
          el.div ({className: 'col-xs-4 rt-wheel'},
            el.div ({className: 'outcome', id: 'outcome', style:{background: betStore.state.rt_Outcome.background}},betStore.state.rt_Outcome.str),//, style:{background: betStore.state.rt_Outcome.background}
            lastbetnode
          )
        )

      )
    );
  }

});


var rt_buttongen = setInterval(buttongen, 100);

function buttongen(){
  var singleBet = document.getElementsByClassName('C_CHIP');
  for(var y = 0; y < singleBet.length; y++){
    singleBet[y].onclick = function(){
      //console.log('left click');  //ADD CHIP
      if(disableSingleBet != true){
        var numbers = [parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML)]
        addChips(this, "chip", numbers, 36);
      }
    }
    singleBet[y].oncontextmenu = function(){
      //console.log('right click'); //REMOVE CHIP
      window.event.returnValue = false;
      if(disableSingleBet != true){
         var numbers = [parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML)]
         removeChips(this, numbers, 36);
         }
      }
    }
///////////////////////////////////////////////////////////////////////////////////////
//Outside Bets
  var Odd_Wager = document.getElementsByClassName('O_CHIP');
  for (var x = 0; x < Odd_Wager.length; x++){
      Odd_Wager[0].onclick = function(){
        if(disableSingleBet != true){
          var numbers = [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35];
          addChips(this,"halfChip", numbers, 2);
        }
      }
      Odd_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35];
          removeChips(this, numbers, 2);
        }
      }
  }

  var Red_Wager = document.getElementsByClassName('R_CHIP');
  for (var x = 0; x < Red_Wager.length; x++){
      Red_Wager[0].onclick = function(){
        if(disableSingleBet != true){
          var numbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
          addChips(this,"halfChip", numbers, 2);
        }
      }
      Red_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
          removeChips(this, numbers, 2);
        }
      }
  }

  var Black_Wager = document.getElementsByClassName('B_CHIP');
  for (var x = 0; x < Black_Wager.length; x++){
      Black_Wager[0].onclick = function(){
        if(disableSingleBet != true){
          var numbers = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];
          addChips(this,"halfChip", numbers, 2);
        }
      }
      Black_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];
          removeChips(this, numbers, 2);
        }
      }
  }

  var Eve_Wager = document.getElementsByClassName('E_CHIP');
  for (var x = 0; x < Eve_Wager.length; x++){
      Eve_Wager[0].onclick = function(){
        if(disableSingleBet != true){
        var numbers = [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36];
        addChips(this,"halfChip", numbers, 2);
        }
      }
      Eve_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36];
          removeChips(this, numbers, 2);
        }
      }
  }

  var S18_Wager = document.getElementsByClassName('S18_CHIP');
  for (var x = 0; x < S18_Wager.length; x++){
      S18_Wager[0].onclick = function(){
        if(disableSingleBet != true){
        var numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
        addChips(this,"halfChip", numbers, 2);
        }
      }
      S18_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
          removeChips(this, numbers, 2);
        }
      }
  }

  var S36_Wager = document.getElementsByClassName('S36_CHIP');
  for (var x = 0; x < S36_Wager.length; x++){
      S36_Wager[0].onclick = function(){
        if(disableSingleBet != true){
        var numbers = [19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36];
        addChips(this,"halfChip", numbers, 2);
        }
      }
      S36_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36];
          removeChips(this, numbers, 2);
        }
      }
  }

  var D12_Wager = document.getElementsByClassName('D12_CHIP');
  for (var x = 0; x < D12_Wager.length; x++){
      D12_Wager[0].onclick = function(){
        if(disableSingleBet != true){
          var numbers = [1,2,3,4,5,6,7,8,9,10,11,12];
          addChips(this, "dozenChip", numbers, 3);
        }
      }
      D12_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [1,2,3,4,5,6,7,8,9,10,11,12];
          removeChips(this, numbers, 3);
        }
      }
  }

  var D24_Wager = document.getElementsByClassName('D24_CHIP');
  for (var x = 0; x < D24_Wager.length; x++){
      D24_Wager[0].onclick = function(){
        if(disableSingleBet != true){
          var numbers = [13,14,15,16,17,18,19,20,21,22,23,24];
          addChips(this, "dozenChip", numbers, 3);
        }
      }
      D24_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [13,14,15,16,17,18,19,20,21,22,23,24];
          removeChips(this, numbers, 3);
        }
      }
  }

  var D36_Wager = document.getElementsByClassName('D36_CHIP');
  for (var x = 0; x < D36_Wager.length; x++){
      D36_Wager[0].onclick = function(){
        if(disableSingleBet != true){
          var numbers = [25,26,27,28,29,30,31,32,33,34,35,36];
          addChips(this, "dozenChip", numbers, 3);
        }
      }
      D36_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [25,26,27,28,29,30,31,32,33,34,35,36];
          removeChips(this, numbers, 3);
        }
      }
  }

  var R1_Wager = document.getElementsByClassName('R1_CHIP');
  for (var x = 0; x < R1_Wager.length; x++){
      R1_Wager[0].onclick = function(){
        if(disableSingleBet != true){
          var numbers = [3,6,9,12,15,18,21,24,27,30,33,36];
          addChips(this, "dozenChip", numbers, 3);
        }
      }
      R1_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [3,6,9,12,15,18,21,24,27,30,33,36];
          removeChips(this, numbers, 3);
        }
      }
  }

  var R2_Wager = document.getElementsByClassName('R2_CHIP');
  for (var x = 0; x < R2_Wager.length; x++){
      R2_Wager[0].onclick = function(){
        if(disableSingleBet != true){
          var numbers = [2,5,8,11,14,17,20,23,26,29,32,35];
          addChips(this, "dozenChip", numbers, 3);
        }
      }
      R2_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [2,5,8,11,14,17,20,23,26,29,32,35];
          removeChips(this, numbers, 3);
        }
      }
  }

  var R3_Wager = document.getElementsByClassName('R3_CHIP');
  for (var x = 0; x < R3_Wager.length; x++){
      R3_Wager[0].onclick = function(){
        if(disableSingleBet != true){
          var numbers = [1,4,7,10,13,16,19,22,25,28,31,34];
          addChips(this, "dozenChip", numbers, 3);
        }
      }
      R3_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [1,4,7,10,13,16,19,22,25,28,31,34];
          removeChips(this, numbers, 3);
        }
      }
  }
/////////////////////////////////////////////////////////////////////////////////
// FOR HIGHLIGHTING BUTTONS
  var tagOddElms = document.getElementsByClassName('ODD');
  var tagOddBet = document.getElementsByClassName('rt-green ODD_SEL');

  for (var x = 0; x < tagOddBet.length; x++){
      tagOddBet[0].onmouseover = function() {
        for (var y = 0; y < tagOddElms.length; y++) {
          tagOddElms[y].classList.add('select');
        }
      }
      tagOddBet[0].onmouseout = function() {
        for (var y = 0; y < tagOddElms.length; y++) {
          tagOddElms[y].classList.remove('select');
        }
      }
    }

  var tagEvenElms = document.getElementsByClassName('EVEN');
  var tagEvenBet = document.getElementsByClassName('rt-green EVEN_SEL');
  for (var x = 0; x < tagEvenBet.length; x++){
    tagEvenBet[0].onmouseover = function() {
      for (var y = 0; y < tagEvenElms.length; y++) {
        tagEvenElms[y].classList.add('select');
      }
    }
    tagEvenBet[0].onmouseout = function() {
      for (var y = 0; y < tagEvenElms.length; y++) {
        tagEvenElms[y].classList.remove('select');
      }
    }
  }

  var tagRedElms = document.getElementsByClassName('rt-red');
  var tagRedBet = document.getElementsByClassName('rt-red RED_SEL');
  for (var x = 0; x < tagRedBet.length; x++){
    tagRedBet[0].onmouseover = function() {
      for (var y = 0; y < tagRedElms.length; y++) {
        tagRedElms[y].classList.add('select');
      }
    }
    tagRedBet[0].onmouseout = function() {
      for (var y = 0; y < tagRedElms.length; y++) {
        tagRedElms[y].classList.remove('select');
      }
    }
  }

  var tagBlackElms = document.getElementsByClassName('rt-black');
  var tagBlackBet = document.getElementsByClassName('rt-black BLACK_SEL');
  for (var x = 0; x < tagBlackBet.length; x++){
    tagBlackBet[0].onmouseover = function() {
      for (var y = 0; y < tagBlackElms.length; y++) {
        tagBlackElms[y].classList.add('select');
      }
    }
    tagBlackBet[0].onmouseout = function() {
      for (var y = 0; y < tagBlackElms.length; y++) {
        tagBlackElms[y].classList.remove('select');
      }
    }
  }

  var tagRow1Elms = document.getElementsByClassName('R1');
  var tagRow1Bet = document.getElementsByClassName('rt-green R1_SEL');
  for (var x = 0; x < tagRow1Bet.length; x++){
    tagRow1Bet[0].onmouseover = function() {
      for (var y = 0; y < tagRow1Elms.length; y++) {
        tagRow1Elms[y].classList.add('select');
      }
    }
    tagRow1Bet[0].onmouseout = function() {
      for (var y = 0; y < tagRow1Elms.length; y++) {
        tagRow1Elms[y].classList.remove('select');
      }
    }
  }

  var tagRow2Elms = document.getElementsByClassName('R2');
  var tagRow2Bet = document.getElementsByClassName('rt-green R2_SEL');
  for (var x = 0; x < tagRow2Bet.length; x++){
    tagRow2Bet[0].onmouseover = function() {
      for (var y = 0; y < tagRow2Elms.length; y++) {
        tagRow2Elms[y].classList.add('select');
      }
    }
    tagRow2Bet[0].onmouseout = function() {
      for (var y = 0; y < tagRow2Elms.length; y++) {
        tagRow2Elms[y].classList.remove('select');
      }
    }
  }

  var tagRow3Elms = document.getElementsByClassName('R3');
  var tagRow3Bet = document.getElementsByClassName('rt-green R3_SEL');
  for (var x = 0; x < tagRow3Bet.length; x++){
    tagRow3Bet[0].onmouseover = function() {
      for (var y = 0; y < tagRow3Elms.length; y++) {
        tagRow3Elms[y].classList.add('select');
      }
    }
    tagRow3Bet[0].onmouseout = function() {
      for (var y = 0; y < tagRow3Elms.length; y++) {
        tagRow3Elms[y].classList.remove('select');
      }
    }
  }

  //1-12  D12
  var tagD12Elms = document.getElementsByClassName('D12');
  var tagD12Bet = document.getElementsByClassName('rt-green D12');
  for (var x = 0; x < tagD12Bet.length; x++){
    tagD12Bet[0].onmouseover = function() {
      for (var y = 0; y < tagD12Elms.length; y++) {
        tagD12Elms[y].classList.add('select');
      }
    }
    tagD12Bet[0].onmouseout = function() {
      for (var y = 0; y < tagD12Elms.length; y++) {
        tagD12Elms[y].classList.remove('select');
      }
    }
  }
  //13-24 D24
  var tagD24Elms = document.getElementsByClassName('D24');
  var tagD24Bet = document.getElementsByClassName('rt-green D24');
  for (var x = 0; x < tagD24Bet.length; x++){
    tagD24Bet[0].onmouseover = function() {
      for (var y = 0; y < tagD24Elms.length; y++) {
        tagD24Elms[y].classList.add('select');
      }
    }
    tagD24Bet[0].onmouseout = function() {
      for (var y = 0; y < tagD24Elms.length; y++) {
        tagD24Elms[y].classList.remove('select');
      }
    }
  }
  //25-36 D36
  var tagD36Elms = document.getElementsByClassName('D36');
  var tagD36Bet = document.getElementsByClassName('rt-green D36');
  for (var x = 0; x < tagD36Bet.length; x++){
    tagD36Bet[0].onmouseover = function() {
      for (var y = 0; y < tagD36Elms.length; y++) {
        tagD36Elms[y].classList.add('select');
      }
    }
    tagD36Bet[0].onmouseout = function() {
      for (var y = 0; y < tagD36Elms.length; y++) {
        tagD36Elms[y].classList.remove('select');
      }
    }
  }
  //1-18  S18
  var tagS18Elms = document.getElementsByClassName('S18');
  var tagS18Bet = document.getElementsByClassName('rt-green S18');
  for (var x = 0; x < tagS18Bet.length; x++){
    tagS18Bet[0].onmouseover = function() {
      for (var y = 0; y < tagS18Elms.length; y++) {
        tagS18Elms[y].classList.add('select');
      }
    }
    tagS18Bet[0].onmouseout = function() {
      for (var y = 0; y < tagS18Elms.length; y++) {
        tagS18Elms[y].classList.remove('select');
      }
    }
  }
  //19-36 S36
  var tagS36Elms = document.getElementsByClassName('S36');
  var tagS36Bet = document.getElementsByClassName('rt-green S36');
  for (var x = 0; x < tagS36Bet.length; x++){
    tagS36Bet[0].onmouseover = function() {
      for (var y = 0; y < tagS36Elms.length; y++) {
        tagS36Elms[y].classList.add('select');
      }
    }
    tagS36Bet[0].onmouseout = function() {
      for (var y = 0; y < tagS36Elms.length; y++) {
        tagS36Elms[y].classList.remove('select');
      }
    }
  }
// end highlights
///STREETBETS
var disableSingleBet = false;
var streetBet = document.getElementsByClassName('Street-bet');
for(var x = 0; x<streetBet.length;x++){
    streetBet[x].onmouseover = function(){
        var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
        disableSingleBet = true;
        this.parentElement.classList.add('select');
        document.getElementsByClassName(cur+1)[0].classList.add('select');
        document.getElementsByClassName(cur+2)[0].classList.add('select');
        }
    streetBet[x].onmouseout = function(){
        var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
        disableSingleBet = false;
        this.parentElement.classList.remove('select');
        document.getElementsByClassName(cur+1)[0].classList.remove('select');
        document.getElementsByClassName(cur+2)[0].classList.remove('select');
        }
    streetBet[x].onclick = function(){
        var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
        var num2 = num1 +1;
        var num3 = num1 +2;
        var numbers = [num1, num2, num3];
        addChips(this, "streetChip", numbers,12);
        }
    streetBet[x].oncontextmenu = function(){
      window.event.returnValue = false;
        var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
        var num2 = num1 +1;
        var num3 = num1 +2;
        var numbers = [num1, num2,num3];
        removeChips(this,numbers,12);
        }
    }
    ///STREETCORNERBETS
    var SCBet = document.getElementsByClassName('StreetCorner-bet');
    for(var x = 0; x<SCBet.length;x++){
        SCBet[x].onmouseover = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = true;
          this.parentElement.classList.add('select');
          document.getElementsByClassName(cur+1)[0].classList.add('select');
          document.getElementsByClassName(cur+2)[0].classList.add('select');
          document.getElementsByClassName(cur+3)[0].classList.add('select');
          document.getElementsByClassName(cur+4)[0].classList.add('select');
          document.getElementsByClassName(cur+5)[0].classList.add('select');
          }
        SCBet[x].onmouseout = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = false;
          this.parentElement.classList.remove('select');
          document.getElementsByClassName(cur+1)[0].classList.remove('select');
          document.getElementsByClassName(cur+2)[0].classList.remove('select');
          document.getElementsByClassName(cur+3)[0].classList.remove('select');
          document.getElementsByClassName(cur+4)[0].classList.remove('select');
          document.getElementsByClassName(cur+5)[0].classList.remove('select');
          }
        SCBet[x].onclick = function(){
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +1;
          var num3 = num1 +2;
          var num4 = num1 +3;
          var num5 = num1 +4;
          var num6 = num1 +5;
          var numbers = [num1, num2, num3, num4, num5, num6];
          addChips(this, "dsChip", numbers,6);
          }
        SCBet[x].oncontextmenu = function(){
          window.event.returnValue = false;
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +1;
          var num3 = num1 +2;
          var num4 = num1 +3;
          var num5 = num1 +4;
          var num6 = num1 +5;
          var numbers = [num1, num2, num3, num4, num5, num6];
          removeChips(this,numbers,6);
          }
    }
    //FOURBET
    var fourBet = document.getElementsByClassName('four-bet');
    for(var x = 0; x<fourBet.length;x++){
        fourBet[x].onmouseover = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = true;
          this.parentElement.classList.add('select');
          document.getElementsByClassName(cur+1)[0].classList.add('select');
          document.getElementsByClassName(cur+2)[0].classList.add('select');
          document.getElementsByClassName(cur+3)[0].classList.add('select');
          }
        fourBet[x].onmouseout = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = false;
          this.parentElement.classList.remove('select');
          document.getElementsByClassName(cur+1)[0].classList.remove('select');
          document.getElementsByClassName(cur+2)[0].classList.remove('select');
          document.getElementsByClassName(cur+3)[0].classList.remove('select');
          }
        fourBet[x].onclick = function(){
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +1;
          var num3 = num1 +2;
          var num4 = num1 +3;
          var numbers = [num1, num2, num3, num4];
          addChips(this, "fourChip", numbers,9);
          }
        fourBet[x].oncontextmenu = function(){
          window.event.returnValue = false;
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +1;
          var num3 = num1 +2;
          var num4 = num1 +3;
          var numbers = [num1, num2, num3, num4];
          removeChips(this,numbers,9);
          }
    }
    /////////////////
    var s03Bet = document.getElementsByClassName('split03-bet');
    for(var x = 0; x<s03Bet.length;x++){
        s03Bet[x].onmouseover = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = true;
          this.parentElement.classList.add('select');
          document.getElementsByClassName(cur+3)[0].classList.add('select');
          }
        s03Bet[x].onmouseout = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = false;
          this.parentElement.classList.remove('select');
          document.getElementsByClassName(cur+3)[0].classList.remove('select');
          }
        s03Bet[x].onclick = function(){
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num4 = num1 +3;
          var numbers = [num1, num4];
          addChips(this, "s3Chip", numbers,18);
          }
        s03Bet[x].oncontextmenu = function(){
          window.event.returnValue = false;
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num4 = num1 +3;
          var numbers = [num1,num4];
          removeChips(this,numbers,18);
          }
    }

    var s02Bet = document.getElementsByClassName('split02-bet');
    for(var x = 0; x<s02Bet.length;x++){
        s02Bet[x].onmouseover = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = true;
          this.parentElement.classList.add('select');
          document.getElementsByClassName(cur+2)[0].classList.add('select');
          }
        s02Bet[x].onmouseout = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = false;
          this.parentElement.classList.remove('select');
          document.getElementsByClassName(cur+2)[0].classList.remove('select');
          }
        s02Bet[x].onclick = function(){
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +2;
          var numbers = [num1, num2];
          addChips(this, "s2Chip", numbers,18);
          }
        s02Bet[x].oncontextmenu = function(){
          window.event.returnValue = false;
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +2;
          var numbers = [num1,num2];
          removeChips(this,numbers,18);
          }
    }

    var s01Bet = document.getElementsByClassName('split01-bet');
    for(var x = 0; x<s01Bet.length;x++){
        s01Bet[x].onmouseover = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = true;
          this.parentElement.classList.add('select');
          document.getElementsByClassName(cur+1)[0].classList.add('select');
          }
        s01Bet[x].onmouseout = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = false;
          this.parentElement.classList.remove('select');
          document.getElementsByClassName(cur+1)[0].classList.remove('select');
          }
        s01Bet[x].onclick = function(){
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +1;
          var numbers = [num1, num2];
          addChips(this, "s1Chip", numbers,18);
          }
        s01Bet[x].oncontextmenu = function(){
          window.event.returnValue = false;
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +1;
          var numbers = [num1,num2];
          removeChips(this,numbers,18);
          }
    }


    var tri1Bet = document.getElementsByClassName('tri1-bet');
    for(var x = 0; x<tri1Bet.length;x++){
        tri1Bet[x].onmouseover = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = true;
          this.parentElement.classList.add('select');
          document.getElementsByClassName(cur+2)[0].classList.add('select');
          document.getElementsByClassName(cur+3)[0].classList.add('select');
          }
        tri1Bet[x].onmouseout = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = false;
          this.parentElement.classList.remove('select');
          document.getElementsByClassName(cur+2)[0].classList.remove('select');
          document.getElementsByClassName(cur+3)[0].classList.remove('select');
          }
        tri1Bet[x].onclick = function(){
          var numbers = [0,2,3];
          addChips(this, "tri1Chip", numbers,12);
          }
        tri1Bet[x].oncontextmenu = function(){
          window.event.returnValue = false;
          var numbers = [0,2,3];
          removeChips(this,numbers,12);
          }
    }

    var tri2Bet = document.getElementsByClassName('tri2-bet');
    for(var x = 0; x<tri2Bet.length;x++){
        tri2Bet[x].onmouseover = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = true;
          this.parentElement.classList.add('select');
          document.getElementsByClassName(cur+1)[0].classList.add('select');
          document.getElementsByClassName(cur+2)[0].classList.add('select');
          }
        tri2Bet[x].onmouseout = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = false;
          this.parentElement.classList.remove('select');
          document.getElementsByClassName(cur+1)[0].classList.remove('select');
          document.getElementsByClassName(cur+2)[0].classList.remove('select');
          }
        tri2Bet[x].onclick = function(){
          var numbers = [0,2,1];
          addChips(this, "tri2Chip", numbers,12);
          }
        tri2Bet[x].oncontextmenu = function(){
          window.event.returnValue = false;
          var numbers = [0,2,1];
          removeChips(this,numbers,12);
        }
    }

    var SBH = document.getElementsByClassName('SplitH-bet');
    for(var b = 0; b < SBH.length; b++){
        SBH[b].onmouseover = function(){
          disableSingleBet = true;
          this.parentElement.classList.add('select');
          this.parentElement.nextElementSibling.classList.add('select');
          }
        SBH[b].onmouseout = function(){
          disableSingleBet = false;
          this.parentElement.classList.remove('select');
          this.parentElement.nextElementSibling.classList.remove('select');
          }
        SBH[b].onclick = function(){
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +3;
          var numbers = [num1, num2];
          addChips(this, "SVchip", numbers,18);
          }
        SBH[b].oncontextmenu = function(){
          window.event.returnValue = false;
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +3;
          var numbers = [num1, num2];
          removeChips(this,numbers,18);
          }
    }

    var SBV = document.getElementsByClassName('SplitV-bet');
    for(var b = 0; b < SBV.length; b++){
        SBV[b].onmouseover = function(){
          disableSingleBet = true;
          this.parentElement.classList.add('select');
          for(var u = 0; u < this.parentElement.classList.length; u++){
            switch(this.parentElement.classList[u]){
              case '3':
              case '6':
              case '9':
              case '12':
              case '15':
              case '18':
              case '21':
              case '24':
              case '27':
              case '30':
              case '33':
              case '36':
              case '2':
              case '5':
              case '8':
              case '11':
              case '14':
              case '17':
              case '20':
              case '23':
              case '26':
              case '29':
              case '32':
              case '35':
                var tmpIndex = parseInt(this.parentElement.classList[u]) - 1;
                document.getElementsByClassName(tmpIndex)[0].classList.add('select');
                break;
              }
            }
        }
        SBV[b].onmouseout = function(){
            disableSingleBet = false;
            this.parentElement.classList.remove('select');
            for(var u = 0; u < this.parentElement.classList.length; u++){
              switch(this.parentElement.classList[u]){
                case '3':
                case '6':
                case '9':
                case '12':
                case '15':
                case '18':
                case '21':
                case '24':
                case '27':
                case '30':
                case '33':
                case '36':
                case '2':
                case '5':
                case '8':
                case '11':
                case '14':
                case '17':
                case '20':
                case '23':
                case '26':
                case '29':
                case '32':
                case '35':
                  var tmpIndex = parseInt(this.parentElement.classList[u]) - 1;
                  document.getElementsByClassName(tmpIndex)[0].classList.remove('select');
                  break;
                }
            }
          }
          SBV[b].onclick = function(){
            var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
            var num2 = num1 -1;
            var numbers = [num1, num2];
            addChips(this, "SHchip", numbers,18);
            }
          SBV[b].oncontextmenu = function(){
            window.event.returnValue = false;
            var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
            var num2 = num1 -1;
            var numbers = [num1, num2];
            removeChips(this, numbers,18);
            }
        }

        var CB = document.getElementsByClassName('Corner-bet');
        for(var t = 0; t < CB.length; t++){
            CB[t].onmouseover = function(){
              disableSingleBet = true;
              this.parentElement.classList.add('select');
              for(var u = 0; u < this.parentElement.classList.length; u++){
                switch(this.parentElement.classList[u]){
                  case '3':
                  case '6':
                  case '9':
                  case '12':
                  case '15':
                  case '18':
                  case '21':
                  case '24':
                  case '27':
                  case '30':
                  case '33':
                  case '2':
                  case '5':
                  case '8':
                  case '11':
                  case '14':
                  case '17':
                  case '20':
                  case '23':
                  case '26':
                  case '29':
                  case '32':
                    var tmpIndex1 = parseInt(this.parentElement.classList[u]) -1;
                    var tmpIndex2 = parseInt(this.parentElement.classList[u]) +2;
                    var tmpIndex3 = parseInt(this.parentElement.classList[u]) +3;
                    document.getElementsByClassName(tmpIndex1)[0].classList.add('select');
                    document.getElementsByClassName(tmpIndex2)[0].classList.add('select');
                    document.getElementsByClassName(tmpIndex3)[0].classList.add('select');
                    break;
                  }
                }
        }
        CB[t].onmouseout = function(){
            disableSingleBet = false;
            this.parentElement.classList.remove('select');
            for(var u = 0; u < this.parentElement.classList.length; u++){
              switch(this.parentElement.classList[u]){
                case '3':
                case '6':
                case '9':
                case '12':
                case '15':
                case '18':
                case '21':
                case '24':
                case '27':
                case '30':
                case '33':
                case '2':
                case '5':
                case '8':
                case '11':
                case '14':
                case '17':
                case '20':
                case '23':
                case '26':
                case '29':
                case '32':
                  var tmpIndex1 = parseInt(this.parentElement.classList[u]) - 1;
                  var tmpIndex2 = parseInt(this.parentElement.classList[u]) +2;
                  var tmpIndex3 = parseInt(this.parentElement.classList[u]) +3;
                  document.getElementsByClassName(tmpIndex1)[0].classList.remove('select');
                  document.getElementsByClassName(tmpIndex2)[0].classList.remove('select');
                  document.getElementsByClassName(tmpIndex3)[0].classList.remove('select');
                  break;
                }
              }
          }
        CB[t].onclick = function(){
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +3;
          var num3 = num1 -1;
          var num4 = num1 +2;
          var numbers = [num1, num2,num3, num4];
          addChips(this, "cnChip", numbers,9);
          }
        CB[t].oncontextmenu = function(){
          window.event.returnValue = false;
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +3;
          var num3 = num1 -1;
          var num4 = num1 +2;
          var numbers = [num1, num2,num3, num4];
          removeChips(this, numbers,9);
          }
  }
////////
  if (singleBet.length > 0)
  {
    clearInterval(rt_buttongen);
  }

};


function createChips(chipType, numbers, multiplier) {
  var baseBet = betStore.state.rt_ChipSize;
  for(s = 0; s < numbers.length; s++){
      payout[numbers[s]] += baseBet*multiplier;
    }
  var div = document.createElement('div');
  var wagered = betStore.state.rt_TotalWager + baseBet;
  Dispatcher.sendAction('UPDATE_TOTALWAGER', wagered);
  div.className = chipType;
  div.style.background = "#57C3FD";
  div.innerHTML = baseBet;
  return div;
}

function addChips(parent, chipType, numbers, multiplier) {
    if(disableChips == false){
        multiplier = multiplier *100;
        var baseBet = betStore.state.rt_ChipSize;
        if (parent.children.length == 0) {
          parent.appendChild(createChips(chipType, numbers, multiplier));
        } else {
            for(s = 0; s < numbers.length; s++){
              payout[numbers[s]] += baseBet*multiplier;
            }
        var newVal = parseInt(parent.children[0].innerHTML) + baseBet;
        var wagered = betStore.state.rt_TotalWager + baseBet;
        Dispatcher.sendAction('UPDATE_TOTALWAGER', wagered);
        parent.children[0].innerHTML = newVal.toString();
        parent.children[0].style.background = "#57C3FD";
      }
    }
}

function removeChips(parent, numbers, multiplier) {
    if(disableChips == false){
      multiplier = multiplier *100;
      var baseBet = betStore.state.rt_ChipSize;
    if (parent.children.length == 1) {
      var newVal = parseInt(parent.children[0].innerHTML) - baseBet;
      if (newVal<1){
        for(s = 0; s < numbers.length; s++){
          payout[numbers[s]] -= (baseBet+newVal)*multiplier;
          }
          var wagered = betStore.state.rt_TotalWager - (baseBet+newVal);
          Dispatcher.sendAction('UPDATE_TOTALWAGER', wagered);
      } else if (newVal > 0){
          for(s = 0; s < numbers.length; s++){
          payout[numbers[s]] -= baseBet*multiplier;
          }
          var wagered = betStore.state.rt_TotalWager - baseBet;
          Dispatcher.sendAction('UPDATE_TOTALWAGER', wagered);
        }
      parent.children[0].innerHTML = newVal.toString();
      parent.children[0].style.background = "#57C3FD";
      if (newVal < 1) {
        parent.removeChild(parent.children[0]);
        }
      }
    }
}

function clearAllChips(){
  var chipSets = ["chip", "SVchip", "SHchip", "cnChip", "dozenChip", "halfChip", "streetChip", "dsChip", "s1Chip", "s2Chip", "s3Chip", "tri1Chip", "tri2Chip", "fourChip"];
  for(var x = 0; x< chipSets.length; x++){
    var  currChip = document.getElementsByClassName(chipSets[x]);
    while(currChip[0]){
  	   currChip[0].remove();
      }
    }
  for(var c = 0; c<payout.length;c++){
    payout[c] = 0;
    }
    var wagered = 0;
    Dispatcher.sendAction('UPDATE_TOTALWAGER', wagered);
    disableChips = false;
}

function DoubleAllChips(){
  var chipSets = ["chip", "SVchip", "SHchip", "cnChip", "dozenChip", "halfChip", "streetChip", "dsChip", "s1Chip", "s2Chip", "s3Chip", "tri1Chip", "tri2Chip", "fourChip"];
  for(var x = 0; x< chipSets.length; x++){
    var currChip = document.getElementsByClassName(chipSets[x]);
    if (currChip[0]){
      for (m = 0; m < currChip.length; m++){
        var newVal = parseInt(currChip[m].innerHTML) * 2;
        currChip[m].innerHTML = newVal.toString();
        }
      }
    }
  for(var c = 0; c<payout.length;c++){
    if (payout[c] > 0){
        payout[c] = payout[c] *2;
      }
    }

    var wagered = betStore.state.rt_TotalWager * 2;
    Dispatcher.sendAction('UPDATE_TOTALWAGER', wagered);
    disableChips = false;
}

function HalfAllChips(){
  var chipSets = ["chip", "SVchip", "SHchip", "cnChip", "dozenChip", "halfChip", "streetChip", "dsChip", "s1Chip", "s2Chip", "s3Chip", "tri1Chip", "tri2Chip", "fourChip"];
  for(var x = 0; x< chipSets.length; x++){
    var currChip = document.getElementsByClassName(chipSets[x]);
    if (currChip[0]){
      for (m = 0; m < currChip.length; m++){
        var newVal = parseInt(currChip[m].innerHTML)/2;
        if (newVal < 1){
            clearAllChips();
            return;
        }else{
            currChip[m].innerHTML = newVal.toString();
        }

        }
      }
    }
  var wagered = 0;
  for(var c = 0; c<payout.length;c++){
    if (payout[c] > 1){
        payout[c] = payout[c] /2;
      }
    }
    var wagered = betStore.state.rt_TotalWager / 2;
    Dispatcher.sendAction('UPDATE_TOTALWAGER', wagered);
    disableChips = false;
}

var rangeParam =[];
var payout =[];
var disableChips = false;

payout.length = 37;
for(var c = 0; c<payout.length;c++){
  payout[c] = 0;
  }

function setRangeParam(){
rangeParam =[];
for(var x = 0; x < 37; x++){
    rangeParam.push(
        {
            from: Math.floor((Math.pow(2,32)*x)/37),
            to: Math.floor((Math.pow(2,32)*(x+1))/37),
            value: payout[x]
        }
    );
}
}

function convertRawToNumber(outcome){
    for(var x = 0; x<rangeParam.length; x++){
        if(outcome>=rangeParam[x].from && outcome<rangeParam[x].to){
            var number = x;
            }
        }
    return number;
}


var RouletteButtons = React.createClass({
  displayName: 'RouletteButtons',

  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
    betStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
    betStore.off('change', this._onStoreChange);
  },

  _onSpinClick: function(){
    console.log('Started Roulette Bet');
    disableChips = true;
    setRangeParam();
    var payouts = rangeParam;
    var wager = betStore.state.rt_TotalWager *100;
    var hash = betStore.state.nextHash;
    var bodyParams = {
    client_seed: betStore.state.clientSeed.num,
    hash: hash,
    payouts: payouts,
    wager: wager,
    max_subsidy:0
	  }

    socket.emit('roulette_bet', bodyParams, function(err, bet) {
      if (err) {
        console.log('[socket] roulette_bet failure:', err);
        disableChips = false;
        return;
      }
      console.log('[socket] roulette_bet success:', bet);
      bet.meta = {
        cond: '>',
        number: 99.99,
        hash: hash,
        kind: 'ROULETTE',
        isFair: CryptoJS.SHA256(bet.secret + '|' + bet.salt).toString() === hash
      };
      // Sync up with the bets we get from socket
      bet.wager = wager;
      bet.uname = worldStore.state.user.uname;

      var last_params = {
        hash: hash,
        salt: bet.salt,
        secret: bet.secret,
        seed: betStore.state.clientSeed.num,
        id: bet.id
      }
      Dispatcher.sendAction('SET_LAST_FAIR', last_params);

      Dispatcher.sendAction('SET_NEXT_HASH', bet.next_hash);
      Dispatcher.sendAction('SET_REVEALED_BALANCE');
      Dispatcher.sendAction('START_ROULETTE');
      Dispatcher.sendAction('UPDATE_USER', {
        balance: worldStore.state.user.balance + bet.profit
      });

      var target = convertRawToNumber(bet.outcome)
      animateRoll(target, bet);

    });

  },

  _validateChip: function(newStr) {
    var num = parseInt(newStr, 10);
    // If num is a number, ensure it's at least 1 bit
    if (isFinite(num)) {
      num = Math.max(num, 1);
    }
    // Ensure str is a number
    if (isNaN(num) || /[^\d]/.test(num.toString())) {
      return;
    }else if (num < 1) {
      return;
    }else if (num > 100000) {
      return;
    }else {
      Dispatcher.sendAction('UPDATE_CHIPSIZE', num);
    }
  },
  _onChipChange: function(e){
    var str = e.target.value;
    this._validateChip(str);
    console.log('Chip Change');
  },
  _INC_CHIPSIZE: function(){
    var tempsize = betStore.state.rt_ChipSize;
    if (tempsize < 10000)
      {
        tempsize++;
      }
    if ((tempsize > 2) && (tempsize < 5)){
       tempsize = 5;
      }else if ((tempsize > 5) && (tempsize < 10)){
      tempsize = 10;
      }else if ((tempsize > 10) && (tempsize < 20)){
      tempsize = 20;
      }else if ((tempsize > 20) && (tempsize < 50)){
      tempsize = 50;
      }else if ((tempsize > 50) && (tempsize < 100)){
      tempsize = 100;
      }else if ((tempsize > 100) && (tempsize < 500)){
      tempsize = 500;
      }else if ((tempsize > 500) && (tempsize < 1000)){
      tempsize = 1000;
      }else if ((tempsize > 1000) && (tempsize < 2000)){
      tempsize = 2000;
      }else if ((tempsize > 2000) && (tempsize < 5000)){
      tempsize = 5000;
      }else if ((tempsize > 5000) && (tempsize < 10000)){
      tempsize = 10000;
      }
      Dispatcher.sendAction('UPDATE_CHIPSIZE', tempsize);
  },
  _DEC_CHIPSIZE: function(){
    var tempsize = betStore.state.rt_ChipSize;
    if (tempsize > 1){
        tempsize--;
      }
    if ((tempsize < 5) && (tempsize > 2)){
       tempsize = 2;
     }else if ((tempsize < 10) && (tempsize > 5)){
      tempsize = 5;
    }else if ((tempsize < 20) && (tempsize > 10)){
      tempsize = 10;
    }else if ((tempsize < 50) && (tempsize > 20)){
      tempsize = 20;
    }else if ((tempsize < 100) && (tempsize > 50)){
      tempsize = 50;
    }else if ((tempsize < 500) && (tempsize > 100)){
      tempsize = 100;
    }else if ((tempsize < 1000) && (tempsize > 500)){
      tempsize = 500;
    }else if ((tempsize < 2000) && (tempsize > 1000)){
      tempsize = 1000;
    }else if ((tempsize < 5000) && (tempsize > 2000)){
      tempsize = 2000;
    }else if ((tempsize < 10000) && (tempsize > 5000)){
      tempsize = 5000;
    }
      Dispatcher.sendAction('UPDATE_CHIPSIZE', tempsize);
  },
  _OnClearChips: function(){
    clearAllChips();
  },
  _OnHalfChips: function(){
    HalfAllChips();
  },
  _OnDoubleChips: function(){
    DoubleAllChips();
  },
  render: function(){
    return el.div(
      null,
      el.div(
        {className:'col-xs-3'},
        el.button(
          { id: 'RT-SPIN',
            type: 'button',
            className: 'btn btn-info btn-md btn-block',
            style: { fontWeight: 'bold'},//,
            onClick: this._onSpinClick,
            disabled: !!disableChips || betStore.state.rt_TotalWager < 1 || betStore.state.rt_TotalWager*100 > worldStore.state.user.balance
           },
           'SPIN', worldStore.state.hotkeysEnabled ? el.kbd(null, 'SPC') : ''
        )
      ),
      el.div({className:'col-xs-3'},
        el.div({className:'h6 col-xs-3',style: {fontWeight:'bold'}}, 'Chipsize'),
          el.div({className: 'form-group col-xs-9'},
              el.div({className: 'input-group'},
                el.input(
                    {
                      type: 'text',
                      value: betStore.state.rt_ChipSize.toString(),
                      className: 'form-control input-md',
                      style: {fontWeight: 'bold'},
                      onChange: this._onChipChange
                    }
                  ),
                  el.span(
                      {className: 'input-group-btn'},
                      el.button(
                          {
                            type: 'button',
                            className: 'btn btn-primary btn-md', style:{fontWeight: 'bold'},
                            onClick: this._INC_CHIPSIZE
                          },
                          el.span({className: 'glyphicon glyphicon-arrow-up'})
                        )
                  ),
                  el.span(
                      {className: 'input-group-btn'},
                      el.button(
                          {
                            type: 'button',
                            className: 'btn btn-primary btn-md', style:{fontWeight: 'bold'},
                            onClick: this._DEC_CHIPSIZE
                          },
                          el.span({className: 'glyphicon glyphicon-arrow-down'})
                        )
                  )
                )
            )
       ),
      el.div({className:'col-xs-2'},
          el.span({className:'lead'},'Wager: '),
          el.span({className:'text'},betStore.state.rt_TotalWager.toString() + ' BITS')
      ),
      el.div({className:'col-xs-2'},
        el.div({className:'btn-group'},
          el.div({className:'btn-group'},
            el.button(
              { id: 'RT-HALF',
                type: 'button',
                className: 'btn btn-primary btn-md',
                style: { fontWeight: 'bold'},
                onClick: this._OnHalfChips,
                disabled: (betStore.state.rt_TotalWager < 2)
               },
               '1/2X', worldStore.state.hotkeysEnabled ? el.kbd(null, 'X') : ''
            )
          ),
          el.div({className:'btn-group'},
            el.button(
              { id: 'RT-DOUBLE',
                type: 'button',
                className: 'btn btn-primary btn-md',
                style: { fontWeight: 'bold'},
                onClick: this._OnDoubleChips,
                disabled: (betStore.state.rt_TotalWager < 1)
               },
               '2X', worldStore.state.hotkeysEnabled ? el.kbd(null, 'C') : ''
            )
          )
        ),
        el.div(null,
          el.button(
            { id: 'RT-CLEAR',
              type: 'button',
              className: 'btn btn-warning btn-md',
              style: { fontWeight: 'bold'},
              onClick: this._OnClearChips
             },
             'Clear Table'
          )
        )
      ),
      el.div(
        {className: 'text-right col-xs-2'},
        React.createElement(HotkeyToggle, null)
      )
    );
  }


});


var color_picker = function(number){
  var result = '';
  switch(number){
    case 0:
      result = '#009901';
      break;
    case 1:
    case 3:
    case 5:
    case 7:
    case 9:
    case 12:
    case 14:
    case 16:
    case 18:
    case 19:
    case 21:
    case 23:
    case 25:
    case 27:
    case 30:
    case 32:
    case 34:
    case 36:
      result = '#B50B32';
      break;
    default:
      result = 'black';
      break;
    }
  return result;
}

var RollHistory = React.createClass({
  displayName: 'RollHistory',
  render: function(){
    var Picked =[];
    for (var x = 0; x < 21; x++)
      {
        Picked[x] = color_picker(betStore.state.RollHistory[x]);
      }
    var innerNode;
    innerNode = el.div(null,
      el.div(null,//{className:'row'},
          el.div ({className: 'col-xs-1 history', style:{background: Picked[20]}},betStore.state.RollHistory[20].toString()),
          el.div ({className: 'col-xs-1 history', style:{background: Picked[19]}},betStore.state.RollHistory[19].toString()),
          el.div ({className: 'col-xs-1 history', style:{background: Picked[18]}},betStore.state.RollHistory[18].toString()),
          el.div ({className: 'col-xs-1 history', style:{background: Picked[17]}},betStore.state.RollHistory[17].toString()),
          el.div ({className: 'col-xs-1 history', style:{background: Picked[16]}},betStore.state.RollHistory[16].toString()),
          el.div ({className: 'col-xs-1 history', style:{background: Picked[15]}},betStore.state.RollHistory[15].toString()),
          el.div ({className: 'col-xs-1 history', style:{background: Picked[14]}},betStore.state.RollHistory[14].toString()),
          el.div ({className: 'col-xs-1 history', style:{background: Picked[13]}},betStore.state.RollHistory[13].toString()),
          el.div ({className: 'col-xs-1 history', style:{background: Picked[12]}},betStore.state.RollHistory[12].toString()),
          el.div ({className: 'col-xs-1 history', style:{background: Picked[11]}},betStore.state.RollHistory[11].toString()),
          el.div ({className: 'col-xs-1 history', style:{background: Picked[10]}},betStore.state.RollHistory[10].toString()),
          el.div ({className: 'col-xs-1 history', style:{background: Picked[9]}},betStore.state.RollHistory[9].toString()),
          el.div ({className: 'col-xs-1 history', style:{background: Picked[8]}},betStore.state.RollHistory[8].toString()),
          el.div ({className: 'col-xs-1 history', style:{background: Picked[7]}},betStore.state.RollHistory[7].toString()),
          el.div ({className: 'col-xs-1 history', style:{background: Picked[6]}},betStore.state.RollHistory[6].toString()),
          el.div ({className: 'col-xs-1 history', style:{background: Picked[5]}},betStore.state.RollHistory[5].toString()),
          el.div ({className: 'col-xs-1 history', style:{background: Picked[4]}},betStore.state.RollHistory[4].toString()),
          el.div ({className: 'col-xs-1 history', style:{background: Picked[3]}},betStore.state.RollHistory[3].toString()),
          el.div ({className: 'col-xs-1 history', style:{background: Picked[2]}},betStore.state.RollHistory[2].toString()),
          el.div ({className: 'col-xs-1 history', style:{background: Picked[1]}},betStore.state.RollHistory[1].toString()),
          el.div ({className: 'col-xs-1 history', style:{background: Picked[0]}},betStore.state.RollHistory[0].toString())
        )
    );
    return el.div(null,innerNode);
  }
});


var RouletteBox = React.createClass({
  displayName: 'RouletteBox',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('new_user_bet', this._onStoreChange);
    betStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('new_user_bet', this._onStoreChange);
    betStore.off('change', this._onStoreChange);
  },
  render: function() {
    return el.div(
      null,
      el.div(
        {className: 'panel panel-default'},
        el.div(
          {className: 'panel-body'},
          React.createElement(RouletteBoard, null)
        ),
        el.div(
          {className: 'col-xs-12 well well-sm'},
          React.createElement(RollHistory, null)
        ),
        el.div(
          {className:'panel-footer clearfix'},
          React.createElement(RouletteButtons, null)
        )
      )
    );
  }
});


function animateRoll(target, bet){

var duration = 1;
var countLoop;
var startCount = setInterval(function(){
  duration = duration +5;
  if(duration >29){
    duration = 29;
  }
    clearInterval(countLoop);
    countLoop = setInterval(countup, duration);
    if(duration > 28 && betStore.state.rt_Outcome.num == target){
      clearInterval(countLoop);
      clearInterval(startCount);
      disableChips = false;
      Dispatcher.sendAction('UPDATE_ROLLHISTORY', target);
      Dispatcher.sendAction('STOP_ROULETTE');
      if (!worldStore.state.first_bet)
        {Dispatcher.sendAction('SET_FIRST');}
      Dispatcher.sendAction('NEW_BET', bet);
      }
    }, 30);
};

function countup(){
  var outcome = betStore.state.rt_Outcome.num;
  outcome++;
  if(outcome > 36){
    outcome = 0;
  }
 Dispatcher.sendAction('UPDATE_RT_OUTCOME', { str: outcome.toString() });
};
////END ROULETTE
//////////////////////////////////////////////////////////

/////START BITSWEEP
/////////////////////////////////////////////////////////

var BitSweepBombs = React.createClass({
displayName: 'BitSweepBombs',
_set_bombs: function(num){
   return function () {Dispatcher.sendAction('SET_BOMBSELECT', num);}
},
_validateBombs: function(newStr) {
  var num = parseInt(newStr, 10);

  // Ensure str is a number
  if (isNaN(num)) {
  }
  else if ((num > 0)&&(num < 25)){
    Dispatcher.sendAction('SET_BOMBSELECT', num);
  }

},

_onBombChange: function(e) {
  var str = e.target.value;
  //Dispatcher.sendAction('UPDATE_WAGER', { str: str });
  this._validateBombs(str);
},
render: function() {
  var style1 = { borderBottomLeftRadius: '0', borderBottomRightRadius: '0',fontWeight: 'bold' };
  var style2 = { borderTopLeftRadius: '0',fontWeight: 'bold' };
  var style3 = { borderTopRightRadius: '0',fontWeight: 'bold' };
return el.div(
        null,
        el.div({className: 'input-group',style: { marginTop: '-15px' }},
              el.input(
                {
                  value: betStore.state.BombSelect.toString(),
                  type: 'text',
                  className: 'form-control input-md',
                  style: style1,
                  onChange: this._onBombChange,
                   onClick: this._onBombChange,
                  disabled: ((!!worldStore.state.isLoading)||(betStore.state.BS_Game.state == 'RUNNING')),
                  placeholder: 'Bombs'
                }
              ),
              el.span(
                {className: 'input-group-addon'},
                'BOMBS'
              )
        ),
        el.div(
          {className:'btn-group btn-group-justified'},
          el.div(
            {className:'btn-group'},
            el.button(
                {
                  type: 'button',
                  className: 'btn btn-md ' + (betStore.state.BombSelect == 1 ? 'btn-warning' : 'btn-default'),
                  style:style2,
                  onClick: this._set_bombs(1),
                  disabled: (betStore.state.BS_Game.state == 'RUNNING')
                },
                el.span({className: 'glyphicon glyphicon-certificate'}),
                '1'
              )
          ),
          el.div(
            {className:'btn-group'},
            el.button(
                {
                  type: 'button',
                  className: 'btn btn-md ' + (betStore.state.BombSelect == 5 ? 'btn-warning' : 'btn-default'),
                  style:{fontWeight: 'bold'},
                  onClick: this._set_bombs(5),
                  disabled: (betStore.state.BS_Game.state == 'RUNNING')
                },
                el.span({className: 'glyphicon glyphicon-certificate'}),
                '5'
              )
          ),
          el.div(
            {className:'btn-group'},
            el.button(
                {
                  type: 'button',
                  className: 'btn btn-md ' + (betStore.state.BombSelect == 10 ? 'btn-warning' : 'btn-default'),
                  style:{fontWeight: 'bold'},
                  onClick: this._set_bombs(10),
                  disabled: (betStore.state.BS_Game.state == 'RUNNING')
                },
                el.span({className: 'glyphicon glyphicon-certificate'}),
                '10'
              )
          ),
          el.div(
            {className:'btn-group'},
            el.button(
                {
                  type: 'button',
                  className: 'btn btn-md ' + (betStore.state.BombSelect == 20 ? 'btn-warning' : 'btn-default'),
                  style:style3,
                  onClick: this._set_bombs(20),
                  disabled: (betStore.state.BS_Game.state == 'RUNNING')
                },
                el.span({className: 'glyphicon glyphicon-certificate'}),
                '20'
              )
          )
        )
    );
  }

});


var BitSweepBetButton = React.createClass({
displayName: 'BitSweepBetButton',
_onStoreChange: function() {
this.forceUpdate();
},
componentDidMount: function() {
worldStore.on('change', this._onStoreChange);
betStore.on('change', this._onStoreChange);
},
componentWillUnmount: function() {
worldStore.off('change', this._onStoreChange);
betStore.off('change', this._onStoreChange);
},
_start_game: function(){
  clearAllTiles();
  Dispatcher.sendAction('START_BITSWEEP');
},
_stop_game: function(){
  Dispatcher.sendAction('STOP_BITSWEEP');
},
render: function() {

  var innerNode;

  // TODO: Create error prop for each input
  var error = betStore.state.wager.error || betStore.state.clientSeed.error;

  if (worldStore.state.isLoading) {
    // If app is loading, then just disable button until state change
    innerNode = el.button(
      {type: 'button', disabled: true, className: 'btn btn-lg btn-block btn-default'},
      'Loading...'
    );
  } else if (error) {
    // If there's a betbox error, then render button in error state

    var errorTranslations = {
      'INVALID_SEED': 'Invalid Seed',
      'SEED_TOO_HIGH':'Seed too high',
      'CANNOT_AFFORD_WAGER': 'Balance too low',
      'INVALID_WAGER': 'Invalid wager',
      'WAGER_TOO_LOW': 'Wager too low',
      'WAGER_TOO_PRECISE': 'Wager too precise'
    };
    if (betStore.state.BS_Game.state == 'RUNNING')
      {
        Dispatcher.sendAction('STOP_BITSWEEP');
      }
    innerNode = el.button(
      {type: 'button',
       disabled: true,
       className: 'btn btn-lg btn-block btn-danger'},
      errorTranslations[error] || 'Invalid bet'
    );
  } else if (worldStore.state.user) {
    // If user is logged in, let them submit bet
    innerNode = el.button(
        {
          id: 'BS-START',
          type: 'button',
          className: 'btn btn-lg btn-success btn-block',
          style:{fontWeight: 'bold'},
          onClick: betStore.state.BS_Game.state == 'RUNNING' ? this._stop_game : this._start_game
        },
        betStore.state.BS_Game.state == 'RUNNING' ? 'CASH OUT' : 'START GAME',
        worldStore.state.hotkeysEnabled ? el.kbd(null, 'SPC') : ''
      );

  } else {
    // If user isn't logged in, give them link to /oauth/authorize
    innerNode = el.a(
      {
        href: config.mp_browser_uri + '/oauth/authorize' +
          '?app_id=' + config.app_id +
          '&redirect_uri=' + config.redirect_uri,
        className: 'btn btn-lg btn-block btn-success'
      },
      'Login with MoneyPot'
    );
  }

return el.div(
      null,
      innerNode
    );
  }

});

var BitSweepStakeWell = React.createClass({
displayName: 'BitSweepStakeWell',
render: function() {
return el.div(
      null,
      el.div(
        {className: 'col-xs-12 well well-sm'},
        el.div(
          {className:'col-xs-12 col-md-6 text text-left'},
          'Next: ',
          el.span(
            {className: 'text', style: { color: 'green'}},
            betStore.state.BS_Game.state == 'RUNNING' ? helpers.convNumtoStr(betStore.state.BS_Game.next) : '--'//'0.25'
          )
        ),
        el.div(
          {className:'col-xs-12 col-md-6 text text-left'},
          'Stake: ',
          el.span(
            {className: 'text', style: { color: 'orange'}},
            betStore.state.BS_Game.state == 'RUNNING' ? helpers.convNumtoStr(betStore.state.BS_Game.stake) : '--'//'1.00'
          )
        )
      )
    );
  }
});

var BitSweepLastBet = React.createClass({
displayName: 'BitSweepLastBet',
_onStoreChange: function() {
  this.forceUpdate();
},
componentDidMount: function() {
  worldStore.on('new_user_bet', this._onStoreChange);
  worldStore.on('change', this._onStoreChange);
},
componentWillUnmount: function() {
  worldStore.off('new_user_bet', this._onStoreChange);
  worldStore.off('change', this._onStoreChange);
},

render: function(){
  var last_bet = '';
  //var last_wager = helpers.convNumtoStr(100);
  var last_profit = 100;
  last_bet = '';

  if (worldStore.state.first_bet){
   last_bet = (worldStore.state.bets.data[worldStore.state.bets.end].bet_id||worldStore.state.bets.data[worldStore.state.bets.end].id);
   //last_wager = helpers.convNumtoStr(worldStore.state.bets.data[worldStore.state.bets.end].wager);
   last_profit = worldStore.state.bets.data[worldStore.state.bets.end].profit;
  }

  return el.div(
    null,
    el.div(
      {className:'well well-sm col-xs-12'},
      el.div(
        { className: 'col-xs-12 col-md-6'},
        el.div(
        {className: 'text'},
        'Last: ',
        el.span(
            {className: 'text'},
            el.a(
              {
                href: config.mp_browser_uri + '/bets/' + last_bet,
                target: '_blank'
              },
              last_bet
            )
        )
       )
      ),
      el.div(
        { className: 'col-xs-12 col-md-6'},
        el.div(
        {className: 'text'},
        'Profit: ',
        el.span(
          {className: 'text', style: { color: last_profit > 0 ? 'green' : 'red'}},
         last_profit > 0 ? '+' + helpers.convNumtoStr(last_profit) : helpers.convNumtoStr(last_profit)
        )
      )
      )
    )
  );
}
});



var BitSweepBetBox = React.createClass({
displayName: 'BitSweepBetBox',
_onStoreChange: function() {
this.forceUpdate();
},
componentDidMount: function() {
worldStore.on('new_user_bet', this._onStoreChange);
betStore.on('change', this._onStoreChange);
},
componentWillUnmount: function() {
worldStore.off('new_user_bet', this._onStoreChange);
betStore.off('change', this._onStoreChange);
},
render: function() {
return el.div(
      null,
      el.div(
        {className: 'col-xs-12'},
        React.createElement(BetBoxWager, null)
      ),
      el.div(
        {className: 'col-xs-12',style: {marginTop:'10px'}},
        React.createElement(BitSweepBombs, null)
      ),
      el.div(
        {className: 'row'},
        el.div(
          {className: 'col-xs-12',style: {marginTop: '-15px'}},
          el.hr(null)
        )
      ),
      el.div(
        {className: 'col-xs-12 text-center'},
        React.createElement(BitSweepBetButton, null)
      ),
      el.div(
        {className: 'row'},
        el.div(
          {className: 'col-xs-12',style: {marginTop: '10px'}},
          React.createElement(BitSweepStakeWell, null)
        )
      ),
      el.div(
        {className: 'row'},
        el.div(
          {className: 'col-xs-12'},
          React.createElement(BitSweepLastBet, null)
        )
      )
    );
  }

});


var BitSweepSettingsBox = React.createClass({
displayName: 'BitSweepSettingsBox',
_onStoreChange: function() {
this.forceUpdate();
},
componentDidMount: function() {
worldStore.on('change', this._onStoreChange);
betStore.on('change', this._onStoreChange);
},
componentWillUnmount: function() {
worldStore.off('change', this._onStoreChange);
betStore.off('change', this._onStoreChange);
},
render: function() {
return el.div(
      null,
      el.div(
        {className: 'col-xs-12'},//{className: 'col-xs-6 col-sm-4 col-md-4 col-lg-2'},
        React.createElement(BetBoxClientSeed, null)
      ),
      el.div(
        {className: 'col-xs-12'}, //{className: 'col-xs-6 col-sm-4 col-md-4 col-lg-2'},
        React.createElement(SiteEdgeSelect, null)
      ),
      el.div(
        {className: 'col-xs-12',style:{marginTop:'15px'}}, //{className: 'col-xs-12 col-sm-4 col-md-4 col-lg-2'},
        React.createElement(HotkeyToggle, null)
      )
    );
  }

});


var BitSweepBoard = React.createClass({
  displayName: 'BitSweepBoard',

  render: function (){
    var bet_table;
    bet_table = el.div(null,
      el.table({className:'B_bet_table'},
        el.tbody(
          null,
          el.tr(null,
            el.td(
              {className:'bs-hide 1'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 2'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 3'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 4'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 5'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            )
          ),
          el.tr(null,
            el.td(
              {className:'bs-hide 6'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 7'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 8'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 9'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 10'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            )
          ),
          el.tr(null,
            el.td(
              {className:'bs-hide 11'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 12'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 13'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 14'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 15'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            )
          ),
          el.tr(null,
            el.td(
              {className:'bs-hide 16'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 17'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 18'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 19'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 20'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            )
          ),
          el.tr(null,
            el.td(
              {className:'bs-hide 21'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 22'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 23'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 24'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 25'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            )
          )
        )
      )
    );

    return el.div(
      null,
      el.div(
        {className: 'BitSweepTable', id: 'B-Table'},
        el.div ({className: 'bs'},

            el.div ({className:'col-xs-12 col-md-5 col-lg-3 text-left', style:{marginTop:'15px'}},
              React.createElement(BitSweepBetBox, null)
            ),
            el.div ({className: 'bs-field text-left col-xs-12 col-md-6'},
              bet_table
            ),
            el.span ({className:'col-xs-12 col-md-6 col-lg-3 text-left', style:{marginTop:'15px'}},
              React.createElement(BitSweepSettingsBox, null)
            )

        )

      )
    );
  }

});

var BS_buttongen = setInterval(bsbuttongen, 100);

function bsbuttongen(){
  var singleBet = document.getElementsByClassName('BS_BTN');
  for(var y = 0; y < singleBet.length; y++){
    singleBet[y].onclick = function(){
      console.log('left click');  //ADD CHIP
        RevealTile(this);
    }
    }

  if (singleBet.length > 0)
  {
    clearInterval(BS_buttongen);
  }

};


function createTile(tileType, numbers) {
  var profit = numbers;
  var div = document.createElement('div');
  div.className = tileType;
  if (tileType == 'BOMB_TILE'){
      div.innerHTML = '';
  }else if (profit){
    div.innerHTML = '+' + profit;
  }

  return div;
}


var bs_rangeParam =[];

function set_BS_RangeParam(){
bs_rangeParam =[];

var chance = (25-betStore.state.BS_Game.bombs-betStore.state.BS_Game.cleared)/(25-betStore.state.BS_Game.cleared);
var range = Math.floor(Math.pow(2,32)*(chance))

    bs_rangeParam.push(
        {
        from: 0,
        to: range,
        value: betStore.state.BS_Game.stake+betStore.state.BS_Game.next
        }
    );
    bs_rangeParam.push(
        {
        from: range+1,
        to: Math.pow(2,32)-1,
        value: 0
        }
    );

}

var tile_wait = false;
function RevealTile(parent) {

  if (betStore.state.BS_Game.state == 'RUNNING'){
        if ((parent.children.length == 0) && (tile_wait == false)) {

          set_BS_RangeParam();
          var payouts = bs_rangeParam;

          var wager = betStore.state.BS_Game.stake;
          var hash = betStore.state.nextHash;

          var bodyParams = {
          client_seed: betStore.state.clientSeed.num,
          hash: hash,
          payouts: payouts,
          wager: wager,
          max_subsidy:0
          }
          tile_wait = true;
          socket.emit('bitsweep_bet', bodyParams, function(err, bet) {
            if (err) {
              tile_wait = false;
              console.log('[socket] bitsweep_bet failure:', err);
              return;
            }
            console.log('[socket] bitsweep_bet success:', bet);
            bet.meta = {
              cond: '>',
              number: 99.99,
              hash: hash,
              kind: 'BITSWEEP',
              isFair: CryptoJS.SHA256(bet.secret + '|' + bet.salt).toString() === hash
            };
            // Sync up with the bets we get from socket
            bet.wager = wager;
            bet.uname = worldStore.state.user.uname;

            var last_params = {
              hash: hash,
              salt: bet.salt,
              secret: bet.secret,
              seed: betStore.state.clientSeed.num,
              id: bet.id
            }
            Dispatcher.sendAction('SET_LAST_FAIR', last_params);

            Dispatcher.sendAction('NEW_BET', bet);

            if (!worldStore.state.first_bet)
              {Dispatcher.sendAction('SET_FIRST');}

            Dispatcher.sendAction('SET_NEXT_HASH', bet.next_hash);

            Dispatcher.sendAction('UPDATE_USER', {
              balance: worldStore.state.user.balance + bet.profit
            });

            if (betStore.state.randomseed){
                var newseed = Math.floor(Math.random()*(Math.pow(2,32)));
                var str = newseed.toString();
                Dispatcher.sendAction('UPDATE_CLIENT_SEED', { str: str });
              }

            if (bet.profit > 0){
              parent.appendChild(createTile("WIN_TILE", helpers.convSatstoCointype(betStore.state.BS_Game.next)));
              Dispatcher.sendAction('GET_NEXT_BITSWEEP');
            }else{
              betStore.state.BS_Game.cleared++;
              parent.appendChild(createTile("BOMB_TILE", ''));
              Dispatcher.sendAction('STOP_BITSWEEP');
            }
            tile_wait = false;
          });

        } else {
            if (tile_wait){
              setTimeout(function(){ tile_wait = false;},500);
            }
        }
      }

}


function clearAllTiles(){
  var chipSets = ["WIN_TILE", "BOMB_TILE"];
  for(var x = 0; x< chipSets.length; x++){
    var  currChip = document.getElementsByClassName(chipSets[x]);
    while(currChip[0]){
  	   currChip[0].remove();
      }
    }
}

function ShowAllBombs(revealed,bombs){
  var shownbombs;
  var last_profit = -1;
  if (worldStore.state.bets.data[worldStore.state.bets.end] != undefined){
      last_profit = worldStore.state.bets.data[worldStore.state.bets.end].profit;
      }
  var hidden = 25-revealed-1;
  if ((last_profit > 0)||(betStore.state.BS_Game.cleared == 0)){
    shownbombs = 0;
  }else {
    shownbombs = 1;
  }

  var toggle = !!Math.floor(Math.random() * 2);
  var singleTile = document.getElementsByClassName('BS_BTN');
  for(var y = 0; y < singleTile.length; y++){
    if (singleTile[y].children.length == 0) {
      if ((hidden > bombs)&&(shownbombs < bombs)){
          toggle = !!Math.floor(Math.random() * 2);
          if (toggle){
            singleTile[y].appendChild(createTile("BOMB_TILE", ''));
            shownbombs++;
          }else{
            singleTile[y].appendChild(createTile("WIN_TILE", ''));
          }
      }else if (shownbombs < bombs){
        singleTile[y].appendChild(createTile("BOMB_TILE", ''));
        shownbombs++;
      }else{
        singleTile[y].appendChild(createTile("WIN_TILE", ''));
      }
      hidden--;
    }
  }
}



var BitSweepBox = React.createClass({
  displayName: 'BitSweepBox',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('new_user_bet', this._onStoreChange);
    betStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('new_user_bet', this._onStoreChange);
    betStore.off('change', this._onStoreChange);
  },
  render: function() {
    return el.div(
      null,
      el.div(
        {className: 'panel panel-default'},
      //  el.div(
      //    {className: 'panel-heading h6'},
      //    'Under Constuction'
      //  ),
        el.div(
          {className: 'panel-body text-center'},
          React.createElement(BitSweepBoard, null)
        )
      )
    );
  }

});

/////END BITSWEEP
/////////////////////////////////////////////////////////
var DiceGameTabContent = React.createClass({
  displayName: 'DiceGameTabContent',
  _onStoreChange: function() {
  this.forceUpdate();
  },
  componentDidMount: function() {
  worldStore.on('change_tab', this._onStoreChange);
  },
  componentWillUnmount: function() {
  worldStore.off('change_tab', this._onStoreChange);
  },
  render: function() {
    return el.div(
      null,
      React.createElement(BetBox, null)
    );
  }
});

var RouletteTabContent = React.createClass({
  displayName: 'RouletteTabContent',
  _onStoreChange: function() {
    rt_buttongen = setInterval(buttongen, 100);
    clearAllChips();
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change_tab', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change_tab', this._onStoreChange);
  },
  render: function() {
    return el.div(
      null,
      React.createElement(RouletteBox, null)
    );
  }
});
////////////////////////////////////////////////////////////////////////////////////////
var PlinkoTabContent = React.createClass({
  displayName: 'PlinkoTabContent',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change_tab', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change_tab', this._onStoreChange);
  },
  render: function() {
    return el.div(
      null,
      React.createElement(PlinkoBetBox, null),
      React.createElement(PlinkoGameBoard, null)
    );
  }
});

var BitsweepTabContent = React.createClass({
  displayName: 'BitsweepTabContent',
  _onStoreChange: function() {
    BS_buttongen = setInterval(bsbuttongen, 100);
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change_tab', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change_tab', this._onStoreChange);
  },
  render: function() {
    return el.div(
      null,
      React.createElement(BitSweepBox, null)
    );
  }
});
///////////////////////////////////////////////////////////////////////////////////////
var GameTabContent = React.createClass({
  displayName: 'GameTabContent',
  _onStoreChange: function() {
   this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change_tab', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change_tab', this._onStoreChange);
  },
  render: function() {
    switch(worldStore.state.currGameTab) {
      case 'DICE_GAME':
        return React.createElement(DiceGameTabContent, null);
      case 'ROULETTE':
        return React.createElement(RouletteTabContent, null);
      case 'PLINKO':
        return React.createElement(PlinkoTabContent, null);
      case 'BITSWEEP':
        return React.createElement(BitsweepTabContent, null);
      default:
        alert('Unsupported currGameTab value: ', worldStore.state.currGameTab);
        break;
    }
  }
});



var Tabs = React.createClass({
  displayName: 'Tabs',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change_tab', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change_tab', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  _makeTabChangeHandler: function(tabName) {
    var self = this;
    return function() {
    if (worldStore.state.user){
       Dispatcher.sendAction('UPDATE_BANKROLL');
       Dispatcher.sendAction('UPDATE_USERSTATS');
      }
      Dispatcher.sendAction('CHANGE_TAB', tabName);
    };
  },
  render: function() {
    return el.ul(
      {className: 'nav nav-tabs'},
      el.li(
        {className: worldStore.state.currTab === 'ALL_BETS' ? 'active' : ''},
        el.a(
          {
            href: 'javascript:void(0)',
            onClick: this._makeTabChangeHandler('ALL_BETS')
          },
          'All Bets'
        )
      ),
      // Only show MY BETS tab if user is logged in
      !worldStore.state.user ? '' :
        el.li(
          {className: 'bot_mybets ' + (worldStore.state.currTab === 'MY_BETS' ? 'active' : '')},
          el.a(
            {
              href: 'javascript:void(0)',
              onClick: this._makeTabChangeHandler('MY_BETS')
            },
            'My Bets'
          )
        ),
      el.li(
        {className: worldStore.state.currTab === 'JACKPOT' ? 'active' : ''},
        el.a(
          {
            href: 'javascript:void(0)',
            onClick: this._makeTabChangeHandler('JACKPOT')
          },
          'Jackpot'
        )
      ),
      // Display faucet tab even to guests so that they're aware that
      // this casino has one.
      !config.recaptcha_sitekey ? '' :
        el.li(
          {className: worldStore.state.currTab === 'FAUCET' ? 'active' : ''},
          el.a(
            {
              href: 'javascript:void(0)',
              onClick: this._makeTabChangeHandler('FAUCET')
            },
            el.span(null, 'Faucet ')
          )
        ),
      !worldStore.state.user ? '' :
        el.li(
          {className: worldStore.state.currTab === 'STATS' ? 'active' : ''},
          el.a(
            {
              href: 'javascript:void(0)',
              onClick: this._makeTabChangeHandler('STATS')
            },
            'Stats'
          )
        ),
        el.li(
          {className: worldStore.state.currTab === 'BIGGEST' ? 'active' : ''},
          el.a(
            {
              href: 'javascript:void(0)',
              onClick: this._makeTabChangeHandler('BIGGEST')
            },
            'Biggest'
          )
        ),
        el.li(
          {className: worldStore.state.currTab === 'HELP' ? 'active' : ''},
          el.a(
            {
              href: 'javascript:void(0)',
              onClick: this._makeTabChangeHandler('HELP')
            },
            'Help & FAQ'
          )
        )
    );
  }
});

var MyBetsTabContent = React.createClass({
  displayName: 'MyBetsTabContent',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('new_user_bet', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('new_user_bet', this._onStoreChange);
  },
  render: function() {
    return el.div(null,
      el.table(
        {className: 'table bot_bets'},
        el.thead(null,
          el.tr(null,
            el.th(null, 'ID'),
            el.th(null, 'Time'),
            el.th(null, 'Raw_Outcome'),
            el.th(null, 'Wager'),
            el.th(null, 'Target'),
            el.th(null, 'Roll'),
            el.th(null, 'Profit')
          )
        ),
        el.tbody(null,
          worldStore.state.bets.toArray().map(function(bet) {
              var type;
              if (bet.meta.kind == 'DICE'){
                  type = 'DICE';
                }else if (bet.meta.kind == 'PLINKO'){
                  type = 'PLINKO';
                }else if (bet.meta.kind == 'ROULETTE'){
                  type = 'ROULETTE';
                }else {
                 type = 'BITSWEEP';
                }

            return el.tr(
              {
                key: bet.bet_id || bet.id
              },
              // bet id
              el.td(null,
                el.a(
                  {
                    href: config.mp_browser_uri + '/bets/' + (bet.bet_id || bet.id),
                    target: '_blank'
                  },
                  bet.bet_id || bet.id
                )
              ),
              // Time
              el.td(null,
                helpers.formatDateToTime(bet.created_at)
              ),
              // Raw Outcome
              el.td(null,
                bet.raw_outcome ? bet.raw_outcome : '--'
              ),
              // wager
              el.td(null,
                helpers.convNumtoStr(bet.wager) + ' ' + worldStore.state.coin_type
              ),
              // target
              el.td(null,
                bet.meta.kind == 'DICE' ? bet.meta.cond + ' ' + bet.meta.number.toFixed(4) : type
              ),
              // roll
              el.td(null,
                bet.meta.kind == 'DICE' ? bet.outcome + ' ' : '-',
                bet.meta.isFair ?
                  el.span(
                    {className: 'label label-success'}, 'Verified') : ''
              ),
              // profit
              el.td(
                {style: {color: bet.profit > 0 ? 'green' : 'red'}},
                bet.profit > 0 ? '+' + helpers.convNumtoStr(bet.profit) : helpers.convNumtoStr(bet.profit),
                ' ' + worldStore.state.coin_type

              )
            );
          }).reverse()
        )
      )
    );
  }
});

var FaucetTabContent = React.createClass({
  displayName: 'FaucetTabContent',
  getInitialState: function() {
    return {
      // SHOW_RECAPTCHA | SUCCESSFULLY_CLAIM | ALREADY_CLAIMED | WAITING_FOR_SERVER
      faucetState: 'SHOW_RECAPTCHA',
      // :: Integer that's updated after the claim from the server so we
      // can show user how much the claim was worth without hardcoding it
      // - It will be in satoshis
      claimAmount: undefined
    };
  },
  // This function is extracted so that we can call it on update and mount
  // when the window.grecaptcha instance loads
  _renderRecaptcha: function() {
    worldStore.state.grecaptcha.render(
      'recaptcha-target',
      {
        sitekey: config.recaptcha_sitekey,
        callback: this._onRecaptchaSubmit
      }
    );
  },
  // `response` is the g-recaptcha-response returned from google
  _onRecaptchaSubmit: function(response) {
    var self = this;
    console.log('recaptcha submitted: ', response);

    self.setState({ faucetState: 'WAITING_FOR_SERVER' });

    MoneyPot.claimFaucet(response, {
      // `data` is { claim_id: Int, amount: Satoshis }
      success: function(data) {
        Dispatcher.sendAction('UPDATE_USER', {
          balance: worldStore.state.user.balance + data.amount
        });
        Dispatcher.sendAction('START_REFRESHING_USER');
        self.setState({
          faucetState: 'SUCCESSFULLY_CLAIMED',
          claimAmount: data.amount
        });
      },
      error: function(xhr, textStatus, errorThrown) {
        if (xhr.responseJSON && xhr.responseJSON.error === 'FAUCET_ALREADY_CLAIMED') {
          self.setState({ faucetState: 'ALREADY_CLAIMED' });
        }
      }
    });
  },
  // This component will mount before window.grecaptcha is loaded if user
  // clicks the Faucet tab before the recaptcha.js script loads, so don't assume
  // we have a grecaptcha instance
  componentDidMount: function() {
    if (worldStore.state.grecaptcha) {
      this._renderRecaptcha();
    }

    worldStore.on('grecaptcha_loaded', this._renderRecaptcha);
  },
  componentWillUnmount: function() {
    worldStore.off('grecaptcha_loaded', this._renderRecaptcha);
  },
  render: function() {

    // If user is not logged in, let them know only logged-in users can claim
    if (!worldStore.state.user) {
      return el.p(
        {className: 'lead'},
        'You must login to claim faucet'
      );
    }

    var innerNode;
    // SHOW_RECAPTCHA | SUCCESSFULLY_CLAIMED | ALREADY_CLAIMED | WAITING_FOR_SERVER
    switch(this.state.faucetState) {
    case 'SHOW_RECAPTCHA':
      innerNode = el.div(
        { id: 'recaptcha-target' },
        !!worldStore.state.grecaptcha ? '' : 'Loading...'
      );
      break;
    case 'SUCCESSFULLY_CLAIMED':
      innerNode = el.div(
        null,
        'Successfully claimed ' + this.state.claimAmount/100 + ' bits.' +
          // TODO: What's the real interval?
          ' You can claim again in 5 minutes.'
      );
      break;
    case 'ALREADY_CLAIMED':
      innerNode = el.div(
        null,
        'ALREADY_CLAIMED'
      );
      break;
    case 'WAITING_FOR_SERVER':
      innerNode = el.div(
        null,
        'WAITING_FOR_SERVER'
      );
      break;
    default:
      alert('Unhandled faucet state');
      return;
    }

    return el.div(
      null,
      innerNode
    );
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////
var FilterUserInput = React.createClass({
  displayName:'FilterUserInput',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  _onFilterUserChange: function(e) {
    var str = e.target.value;
    Dispatcher.sendAction('UPDATE_FILTER_USER', { str: str });
  },
  render: function(){
    return el.div(null,
        el.div({className: 'col-xs-12 col-sm-6 col-lg-3',style:{marginBottom:'-5px'}},
        el.div(
          {className: 'form-group'},
          el.span(
            {className: 'input-group input-group-sm'},
            el.span({className: 'input-group-addon'},'User'),
            el.input(
              {
                value: worldStore.state.filteruser.str,
                type: 'text',
                className: 'form-control input-sm',
                onChange: this._onFilterUserChange,
                placeholder: 'User'
              }
            )
          )
        )
      )
    );
  }
});

var FilterWagerInput = React.createClass({
  displayName:'FilterWagerInput',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  _validateFilterWager: function(newStr) {
    var num = parseFloat(newStr, 10);

    // Ensure str is a number
    if (isNaN(num)) {
      Dispatcher.sendAction('UPDATE_FILTER_WAGER', {
        num: 0.0,
        error: null });
    } else if (num < 0) {
      Dispatcher.sendAction('UPDATE_FILTER_WAGER', {
      num: 0.0,
      error: null });
    } else {
      Dispatcher.sendAction('UPDATE_FILTER_WAGER', {
        num: num,
        error: null
      });
    }
  },
  _onFilterWagerChange: function(e) {
    var str = e.target.value;
    Dispatcher.sendAction('UPDATE_FILTER_WAGER', { str: str });
    this._validateFilterWager(str);
  },

  render: function(){
    return el.div(null,
        el.div({className: 'col-xs-12 col-sm-6 col-lg-3',style:{marginBottom:'-5px'}},
          el.div(
            {className: 'form-group'},
            el.span(
              {className: 'input-group input-group-sm'},
              el.span({className: 'input-group-addon'},'Wager >'),
              el.input(
                {
                  value: worldStore.state.filterwager.str,
                  type: 'text',
                  className: 'form-control input-sm',
                  onChange: this._onFilterWagerChange,
                  placeholder: 'bits'
                }
              ),
              el.span({className: 'input-group-addon'},worldStore.state.coin_type)
            )
          )
        )
      );
  }
});

var FilterProfitInput = React.createClass({
  displayName:'FilterProfitInput',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  _validateFilterProfit: function(newStr) {
    var num = parseFloat(newStr, 10);

    // Ensure str is a number
    if (isNaN(num)) {
      Dispatcher.sendAction('UPDATE_FILTER_PROFIT', {
        num: 0.0,
        error: null });
    } else if (num < 0) {
      Dispatcher.sendAction('UPDATE_FILTER_PROFIT', {
        num: 0.0,
        error: null });
    } else {
      Dispatcher.sendAction('UPDATE_FILTER_PROFIT', {
        num: num,
        error: null
      });
    }
  },
  _onFilterProfitChange: function(e) {
    var str = e.target.value;
    Dispatcher.sendAction('UPDATE_FILTER_PROFIT', { str: str });
    this._validateFilterProfit(str);
  },

  render: function(){
    return el.div(null,
      el.div({className: 'col-xs-12 col-sm-6 col-lg-3',style:{marginBottom:'-5px'}},
        el.div(
          {className: 'form-group'},
          el.span(
            {className: 'input-group input-group-sm'},
            el.span({className: 'input-group-addon'},'Profit >'),
            el.input(
              {
                value: worldStore.state.filterprofit.str,
                type: 'text',
                className: 'form-control input-sm',
                onChange: this._onFilterProfitChange,
                placeholder: 'bits'
              }
            ),
            el.span({className: 'input-group-addon'},worldStore.state.coin_type)
          )
        )
      )
    );
  }
});

var GameFilterSelect = React.createClass({
  displayName: 'GameFilterSelect',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  _togglegamefilter: function(){
    Dispatcher.sendAction('TOGGLE_GAME_FILTER', null);
  },
  render: function() {
      //this.props.selected = colours[0];
      return el.div(null,
        el.div({className: 'col-xs-12 col-md-6 col-lg-3'},
          el.div({className:'btn-group'},
            el.button({
                      type: 'button',
                      className:'btn btn-md btn-block btn-primary',
                      style:{fontWeight: 'bold'},
                      onClick: this._togglegamefilter,
                    },
                    worldStore.state.filtergame
                  )
          )
        )
      );
  }

});

////////////////////////////////////////////////////////////////////////////////////////
var allbetdelay = false;
var renderallbet = true;

var AllBetsTabContent = React.createClass({
  displayName: 'AllBetsTabContent',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('new_all_bet', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('new_all_bet', this._onStoreChange);
  },
  render: function() {
    return el.div(null,
      el.div(
        {className: 'panel panel-default'},
        el.div(
          {className: 'panel-body'},
          el.span({className: 'h6 col-xs-12 col-lg-2'},'Filter New Bets By:'),
          el.div(
            {className:'well well-sm col-xs-12 col-lg-10',style:{marginBottom:'-5px',marginTop:'-10'}},
            React.createElement(FilterUserInput, null),
            React.createElement(FilterWagerInput, null),
            React.createElement(FilterProfitInput, null),
            React.createElement(GameFilterSelect, null)
          )
        )
      ),
      el.table(
        {className: 'table', style: {marginTop: '-15px'}},
        el.thead(null,
          el.tr(null,
            el.th(null, 'ID'),
            el.th(null, 'Time'),
            el.th(null, 'User'),
            el.th(null, 'Wager'),
            el.th({className: 'text-right'}, 'Target'),
            el.th(null, 'Outcome'),
            el.th(
              {
                style: {paddingLeft: '50px'}
              },
              'Profit'
            )
          )
        ),
        el.tbody(null,
          worldStore.state.allBets.toArray().map(function(bet) {
            return el.tr(
             { key: bet.id},
              // bet id
              el.td(null,
                el.a(
                  {
                    href: config.mp_browser_uri + '/bets/' + (bet.bet_id || bet.id),
                    target: '_blank'
                  },
                  bet.id
                )
              ),
              // Time
              el.td(null,
                helpers.formatDateToTime(bet.created_at)
              ),
              // User
              el.td(null,
                el.a(
                  {
                    href: config.mp_browser_uri + '/users/' + bet.uname,
                    target: '_blank'
                  },
                  bet.uname
                )
              ),
              // Wager
              el.td(null,
                helpers.convNumtoStr(bet.wager) + ' ' + worldStore.state.coin_type
              ),
              // Target
              el.td(
                {
                  className: 'text-right',
                  style: {fontFamily: 'monospace'}
                },
                //bet.kind == 'DICE' ? bet.cond + bet.target : bet.kind
                bet.kind == 'DICE' ? bet.cond + bet.target.toFixed(4) : bet.kind
              ),
              // Visual
              el.td(
                {
                  style: {fontFamily: 'monospace'}
                },
                // progress bar container
                el.div(
                  {
                    className: 'progress',
                    style: {
                      minWidth: '100px',
                      position: 'relative',
                      marginBottom: 0,
                      // make it thinner than default prog bar
                      height: '10px'
                    }
                  },
                  el.div(
                    {
                      className: 'progress-bar ' +
                        (bet.profit >= 0 ?
                         'progress-bar-success' : 'progress-bar-grey') ,
                      style: {
                        float: bet.cond === '<' ? 'left' : 'right',
                        width: bet.cond === '<' ?
                          bet.target.toString() + '%' :
                          (100 - bet.target).toString() + '%'
                      }
                    }
                  ),
                  el.div(
                    {
                      style: {
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: bet.kind == 'DICE' ? bet.outcome.toString() + '%' : '99.99%',
                        borderRight: '3px solid #333',
                        height: '100%'
                      }
                    }
                  )
                ),
                // arrow container
                el.div(
                  {
                    style: {
                      position: 'relative',
                      width: '100%',
                      height: '15px'
                    }
                  },
                  // arrow
                  el.div(
                    {
                      style: {
                        position: 'absolute',
                        top: 0,
                        left: bet.kind == 'DICE' ? (bet.outcome - 1).toString() + '%' : '98%'
                      }
                    },
                    el.div(
                      {
                        style: {
                          width: '5em',
                          marginLeft: '-10px'
                        }
                      },
                      el.span(
                        {style: {fontFamily: 'monospace'}},
                        '' + bet.kind == 'DICE' ? bet.outcome : ''
                      )
                    )
                  )
                )
              ),
              // Profit
              el.td(
                {style: {color: bet.profit > 0 ? 'green' : 'red',paddingLeft: '50px'}},
                bet.profit > 0 ? '+' + helpers.convNumtoStr(bet.profit):helpers.convNumtoStr(bet.profit),
                ' ' + worldStore.state.coin_type
              )
            );
          }).reverse()
        )
      )
    );
  }
});

////////////////////////////////////////////////////////////////////////////////

function rand(min, max, num) {
          var rtn = [];
          while (rtn.length < num) {
            rtn.push((Math.random() * (max - min)) + min);
          }
          return rtn;
  }

function basefill(num) {
            var rtn = [];
            rtn.push(0);
            while (rtn.length < num) {
              rtn.push(100);
            }
            return rtn;
  }

function labelfill(num){
     var rtn = [];
     while (rtn.length < num){
       rtn.push(' ');
     }
     return rtn;
   }


function getuserbets(num){
  var runningprofit = worldStore.state.user.betted_profit;
  var add;
  var rtn = [];

  //list_user_bets
  var params = {
    uname: worldStore.state.user.uname
  }
  socket.emit('list_user_bets', params, function(err, bets) {
    if (err) {
      console.log('Error list_user_bets:', err);
      return;
    }
    console.log('Successfully loaded list_user_bets:', bets);
    var betsreversed = bets;
    console.log('[Loaded bets for chart]:', bets);
    for (add = 0; add < num; add++)
      {
        if (bets[add]){
          runningprofit = runningprofit - bets[add].profit;
        }else{break;}
      }
    for (add = 0; add < num; add++)
      {
        if (betsreversed[add]){
          runningprofit += betsreversed[add].profit;
          rtn.push(helpers.convSatstoCointype(runningprofit));
        }else{break;}
      }
    Dispatcher.sendAction('UPDATE_HISTORY');
  });

  return rtn;
  }

  var data1 = {
      labels: labelfill(50),//labelfill(config.bet_buffer_size),//['a','b','c','d'],
      datasets: [ {
              label: "dataset1",
              fillColor: "rgba(220,220,220,0.2)",
              strokeColor: "rgba(119,179,0, 0.8)",//"rgba(220,220,220,1)",
              pointColor: "rgba(119,179,0, 0.8)",//"rgba(220,220,220,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: basefill(50)//rand(-32, 1000, 50)
            } ]
  };


var HistoryChart = React.createClass({
  displayName:'HistoryChart',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('bet_history_change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('bet_history_change', this._onStoreChange);
  },

  _onClick: function() {
    //Load profit history
    Dispatcher.sendAction('LOAD_CHART_DATA');
  },
  _onClickLiveToggle: function(){
    Dispatcher.sendAction('LOAD_CHART_DATA');
    Dispatcher.sendAction('TOGGLE_LIVE_CHART');//worldStore.state.LiveGraph
  },

  render: function() {
    console.log('[NewGraph]');
    //check if graph rising
    if (Number(data1.datasets[0].data[data1.datasets[0].data.length - 1]) > Number(data1.datasets[0].data[0]))
      {
      data1.datasets[0].strokeColor = "rgba(119,179,0, 0.8)";
      data1.datasets[0].pointColor = "rgba(119,179,0, 0.8)";
      }else{
        data1.datasets[0].strokeColor = "rgba(153,51,204, 0.8)";
        data1.datasets[0].pointColor = "rgba(153,51,204, 0.8)";
      }

    var props = { data: data1};
    var factory = React.createFactory(Chart.React['Line']);
    var options = {
        options:{
          animation: false,
          pointDot : false,
          pointHitDetectionRadius : 5,
          responsive: true

          }
        };
    var _props = _.defaults({
      data: data1
    },options, props);

    var component = new factory(_props);

    return el.div(null,
              el.div({className:'col-xs-3'},
                el.button(
                    {
                      type: 'button',
                      className: 'btn btn-primary btn-md',
                      onClick: this._onClick
                    },
                    'Graph Last 50 Bets'
                  )
              ),
              el.div({className:'col-xs-3'},
                el.button(
                    {
                      type: 'button',
                      className: 'btn btn-info btn-md',
                      onClick: this._onClickLiveToggle
                    },
                    'Live Graph ',
                    worldStore.state.LiveGraph ?
                      el.span({className: 'label label-success'}, 'ENABLED') :
                      el.span({className: 'label label-default'}, 'DISABLED')
                  )
              ),
              el.div(null,
              component
              )
        );
    }

});


////////////////////////////////////////////////////////////////////////////////////

var MoneypotStats = React.createClass({
  displayName: 'MoneypotStats',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },

  render: function() {

    return el.div(
          null,
          el.div(
            null,
            el.span(
              {className: 'h6', style: { fontWeight: 'bold',marginTop: '-25px' }},
              'Moneypot'
            )
          ),
          el.div(
            {className: 'col-xs-9 well well-sm'},
            el.div(
              {className: 'col-xs-4'},
              el.span(
                {style: { fontWeight: 'bold',marginTop: '-25px' }},
                'Invested: ' + helpers.commafy(helpers.convSatstoCointype(worldStore.state.bankrollbalance).toString()) + ' ' + worldStore.state.coin_type
              )
            ),
            el.div(
              {className: 'col-xs-4'},
              el.span(
                {style: { fontWeight: 'bold',marginTop: '-25px' }},
                'Wagered: ' + helpers.commafy(helpers.convSatstoCointype(worldStore.state.bankrollwagered).toString()) + ' ' + worldStore.state.coin_type
              )
            ),
            el.div(
              {className: 'col-xs-4'},
              el.span(
                {style: { fontWeight: 'bold',marginTop: '-25px' }},
                'Profit: ' + helpers.commafy(helpers.convSatstoCointype((worldStore.state.bankrollbalance-worldStore.state.bankrollinvested)).toString()) + ' ' + worldStore.state.coin_type
              )
            )
          )
    );

  }
});

var UserStatsDisplay = React.createClass({
  displayName: 'UserStatsDisplay',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
    worldStore.on('new_user_bet', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
    worldStore.off('new_user_bet', this._onStoreChange);
  },

  render: function() {

    return el.div(
          null,
          el.div(
            null,
            el.span(
              {className: 'h6', style: { fontWeight: 'bold',marginTop: '-25px' }},
              'Stats For: ',// + worldStore.state.user.uname
              el.span(null,
                  el.a(
                  {
                    href: config.mp_browser_uri + '/users/' + worldStore.state.user.uname,
                    target: '_blank'
                  },
                  worldStore.state.user.uname
                )
              )
            )
          ),
          el.div(
            {className: 'col-xs-9 well well-sm'},
            el.div({className: 'row'},
              el.div(
                {className: 'col-xs-4'},
                el.span(
                  {style: { fontWeight: 'bold',marginTop: '-25px' }},
                  'Bets: ' + worldStore.state.user.betted_count//worldStore.state.userbetcount//worldStore.state.user.betted_count
                )
              ),
              el.div(
                {className: 'col-xs-4'},
                el.span(
                  {style: { fontWeight: 'bold',marginTop: '-25px' }},
                  'Wagered: ' + helpers.commafy(helpers.convSatstoCointype(worldStore.state.user.betted_wager).toString()) + ' ' + worldStore.state.coin_type
                )
              ),
              el.div(
                {className: 'col-xs-4'},
                el.span(
                  {style: { fontWeight: 'bold',marginTop: '-25px' }},
                  'Profit: ' + helpers.commafy(helpers.convSatstoCointype(worldStore.state.user.betted_profit).toString()) + ' ' + worldStore.state.coin_type
                )
              )
            ),
            el.div({className:'row'},
              el.div({className:'col-xs-4'},
                el.span(
                  {style: { fontWeight: 'bold',marginTop: '-25px' }},
                  'Largest Win: ',
                  el.a(
                    {
                      href: config.mp_browser_uri + '/bets/' + worldStore.state.user.largestwin.id,
                      target: '_blank'
                    },
                    worldStore.state.user.largestwin.id
                  )
                )
              ),
              el.div({className:'col-xs-4'},
                el.span(
                  {style: { fontWeight: 'bold',marginTop: '-25px' }},
                  'Profit: ' + helpers.commafy(helpers.convSatstoCointype(worldStore.state.user.largestwin.amt).toString()) + ' ' + worldStore.state.coin_type//worldStore.state.userbetcount//worldStore.state.user.betted_count
                )
              ),
              el.div({className:'col-xs-4'},
                el.span(
                  {style: { fontWeight: 'bold',marginTop: '-25px' }},
                  'Game: ' + worldStore.state.user.largestwin.game
                )
              )
            ),
            el.div({className:'row'},
              el.div({className:'col-xs-4'},
                el.span(
                  {style: { fontWeight: 'bold',marginTop: '-25px' }},
                  'Largest Loss: ',
                  el.a(
                    {
                      href: config.mp_browser_uri + '/bets/' + worldStore.state.user.largestloss.id,
                      target: '_blank'
                    },
                    worldStore.state.user.largestloss.id
                  )
                )
              ),
              el.div({className:'col-xs-4'},
                el.span(
                  {style: { fontWeight: 'bold',marginTop: '-25px' }},
                  'Loss: ' + helpers.commafy(helpers.convSatstoCointype(worldStore.state.user.largestloss.amt).toString()) + ' ' + worldStore.state.coin_type//worldStore.state.userbetcount//worldStore.state.user.betted_count
                )
              ),
              el.div({className:'col-xs-4'},
                el.span(
                  {style: { fontWeight: 'bold',marginTop: '-25px' }},
                  'Game: ' + worldStore.state.user.largestloss.game
                )
              )
            )

          )
    );

  }
});

////////////////////////////////////////////////////////////////////////////////////
var StatsTabContent = React.createClass({
  displayName: 'StatsTabContent',

  _onRefreshStat: function() {
    Dispatcher.sendAction('UPDATE_BANKROLL');
    Dispatcher.sendAction('UPDATE_USERSTATS');
    Dispatcher.sendAction('LOAD_CHART_DATA');
  },

  render: function() {


    return el.div(
      null,
      el.div(
      {className: 'panel panel-default'},
      el.div(
        {className:'panel-heading'},
        el.span(
          {className: 'h6'},
          'Statistics:'
        ),
        el.button(
          {
            className: 'btn btn-link',
            title: 'Refresh Stats',
            onClick: this._onRefreshStat
          },
          el.span(
            {className: 'glyphicon glyphicon-refresh'}
          )
        )
      ),
      el.div(
        {className: 'panel-body'},
        React.createElement(MoneypotStats, null),
        /////////////////////////////////////
        el.div(
          {className: 'row'},
          el.div(
            {className: 'col-xs-12',style: {marginTop: '-15px'}},
            el.hr(null)
          )
        ),
        /////////////////////////////////////
        React.createElement(UserStatsDisplay, null),
        /////////////////////////////////////////////////////
        el.div(
          {className: 'row'},
          el.div(
            {className: 'col-xs-12',style: {marginTop: '-15px'}},
            el.hr(null)
          )
        ),
        el.div( // FOR graph
          null, //{className: 'col-xs-12'},
          React.createElement(HistoryChart, null)
        )
        /////////////////////////////////////////////////////
      )
    )
  );
  }
});
//////////////////////////////////////////////////////
var provably_fair_box = React.createClass({
displayName: 'provably_fair_box',
_onStoreChange: function() {
  this.forceUpdate();
},
componentDidMount: function() {
  betStore.on('lastfair_change', this._onStoreChange);
},
componentWillUnmount: function() {
  betStore.off('lastfair_change', this._onStoreChange);
},

_onEnterHash: function(e) {
  var str = e.target.value;
  Dispatcher.sendAction('UPDATE_LAST_HASH', str);
},
_onEnterSalt: function(e) {
  var str = e.target.value;
  Dispatcher.sendAction('UPDATE_LAST_SALT', str);
},
_onEnterSecret: function(e) {
  var str = e.target.value;
  Dispatcher.sendAction('UPDATE_LAST_SECRET', str);
},
_onEnterSeed: function(e) {
  var str = e.target.value;
  Dispatcher.sendAction('UPDATE_LAST_SEED', str);
},

_CalcRawOut: function() {
  Dispatcher.sendAction('CALC_RAW_OUTCOME');
},
render: function() {
  return el.div(
    null,
    el.div({className:'h6'},'Provably Fair Calculator:'),
    el.div({className:'panel panel-default col-xs-12'},
      el.div({className: 'lead'},'Next Bet Hash: ',
        el.span({className: 'text', style:{fontWeight:'bold'}},betStore.state.nextHash ? betStore.state.nextHash : ' ')
        //betStore.state.lastid = id;
      ),
      el.div({className: 'lead',style:{ marginTop: '-10px'}},'Last Bet Hash: ',
        el.span(null, el.code(null,'SHA256(SECRET+SALT)'))
      ),
      el.div({className: 'form-group col-xs-12',style:{ marginTop: '-10px'}},
            el.span({className: 'input-group input-group-sm col-xs-12 col-md-8 col-lg-6'},
              el.input(
                {
                  value: betStore.state.lastHash,
                  type: 'text',
                  className: 'form-control input-sm',
                  style:{ fontWeight: 'bold'},
                  onChange: this._onEnterHash,
              //    disabled: !!worldStore.state.isLoading,
                  placeholder: 'hash'
                }
              ),
              betStore.state.lastHash ? el.span({className: 'input-group-addon'},
                CryptoJS.SHA256(betStore.state.lastSecret + '|' + betStore.state.lastSalt).toString() === betStore.state.lastHash ?
                  el.span({className: 'glyphicon glyphicon-ok',style: {color:'green'}}) : el.span({className: 'glyphicon glyphicon-remove',style: {color:'red'}})
                ) : ' '
            )
      ),
      el.div({className: 'lead',style:{ marginTop: '-10px'}},'Last Bet Salt:'),
      el.div({className: 'form-group col-xs-12',style:{ marginTop: '-10px'}},
            el.span({className: 'input-group input-group-sm col-xs-12 col-md-8 col-lg-6'},
              el.input(
                {
                  value: betStore.state.lastSalt,
                  type: 'text',
                  className: 'form-control input-sm',
                  style:{ fontWeight: 'bold'},
                  onChange: this._onEnterSalt,
              //    disabled: !!worldStore.state.isLoading,
                  placeholder: 'salt'
                }
              )
            )
      ),
      el.div({className: 'lead',style:{ marginTop: '-10px'}},'Last Bet Secret:'),
      el.div({className: 'form-group col-xs-12',style:{ marginTop: '-10px'}},
            el.span({className: 'input-group input-group-sm col-xs-12 col-md-8 col-lg-6'},
              el.input(
                {
                  value: betStore.state.lastSecret,
                  type: 'text',
                  className: 'form-control input-sm',
                  style:{ fontWeight: 'bold'},
                  onChange: this._onEnterSecret,
              //    disabled: !!worldStore.state.isLoading,
                  placeholder: 'secret'
                }
              )
            )
      ),
      el.div({className: 'lead',style:{ marginTop: '-10px'}},'Last Bet Client Seed:'),
      el.div({className: 'form-group col-xs-12',style:{ marginTop: '-10px'}},
            el.span({className: 'input-group input-group-sm col-xs-12 col-md-8 col-lg-6'},
              el.input(
                {
                  value: betStore.state.lastSeed,
                  type: 'text',
                  className: 'form-control input-sm',
                  style:{ fontWeight: 'bold'},
                  onChange: this._onEnterSeed,
              //    disabled: !!worldStore.state.isLoading,
                  placeholder: 'seed'
                }
              )
            )
      ),
      //final_outcome = (outcome + client_seed) % 4294967296
      el.div({className:'col-xs-12 col-md-8 col-lg-6'},
        el.button(
          { id: 'RT-CLEAR',
            type: 'button',
            className: 'btn btn-primary btn-md',
            style: { fontWeight: 'bold'},
            onClick: this._CalcRawOut
            //disabled: !!this.state.waitingForServer
           },
           'Calculate Raw Outcome'
        ),
        el.span(null,
          el.code(null,'(Secret + Client_Seed) % 2^32')
        )
      ),
      el.div({className: 'form-group col-xs-12'},
            el.span({className: 'input-group input-group-sm col-xs-12 col-md-8 col-lg-6'},
              el.input(
                {
                  value: betStore.state.raw_outcome,
                  type: 'text',
                  className: 'form-control input-sm',
                  style:{ fontWeight: 'bold'},
                  onChange: null,//this._onFilterUserChange,
              //    disabled: !!worldStore.state.isLoading,
                  placeholder: 'Raw Outcome'
                }
              )
            )
      )

    )
  );
}

});



var HelpTabContent = React.createClass({
  displayName: 'HelpTabContent',
   render: function() {

     return el.div(
       null,
       el.div(
         {className:'panel panel-primary'},
         el.div(
           {className:'panel-body'},
           el.div(
           {className: 'h4 text-center'},
           'Welcome To Bit-Exo'
           ),
            el.div(
              {className:'col-xs-12'},
              el.span({className: 'h6 text-left'},'Legal Disclaimer:'),
              el.div({className:'well well-sm col-xs-12'},
              el.p(null, 'Please ensure that gambling is legal in your jurisdiction, Bit-Exo is an Online Gaming site and may not be legal in all places. It is your responsibility to know your local laws.  By using this site you agree that it is legal to do so where you are.  Site bankrolls, user deposits/balances and bets are handled by the gaming company MoneyPot')
                )//end well
              ),
            el.div(
              {className:'col-xs-12'},
              el.span({className: 'h6 text-left'},'How do I play?'),
              el.div({className:'well well-sm col-xs-12'},
              el.p(null, 'After you have funded your Bit-Exo app you can then change the wager amount and the multiplier to an amount of your choosing.  By pressing Bet High or Bet Low you initiate the betting sequence.  The result is shown below under the All Bets tab and under the My Bets Tab.  If you wish you can change the seed to a custom number from 0-4294967295 or enable it to make a random seed for each bet.')
                )//end well
              ),
            el.div(
              {className:'col-xs-12'},
              el.span({className: 'h6 text-left'},'How do I fund my account?'),
              el.div({className:'well well-sm col-xs-12'},
              el.p(null, 'In order to play you will need a balance.  You can use the free faucet to try out some bets for free or you can fund your MoneyPot account.  You will need to sign-up for a free account with MoneyPot in order to play here.  After you have created an account you add the Bit-Exo casino app to you MoneyPot account.  There are two methods available to add funds at this point.  The more direct way is to deposit directly to your Bit-Exo account by clicking the deposit button at the top of the page and using the deposit address located there. The second is under your MoneyPot account page, you can find the deposit button to generate a new BTC deposit address.    Once your account is funded you can click on deposit from inside the app to bring coins over to play with.  Deposits are available to you after 1 confirmation.')
                )//end well
              ),
            el.div(
              {className:'col-xs-12'},
              el.span({className: 'h6 text-left'},'Can I play for free?'),
              el.div({className:'well well-sm col-xs-12'},
              el.p(null, 'Yes.  There is a free faucet available and can be used every 5 minutes to add a small amount of free coins to you account to play with.')
                )//end well
              ),
            el.div(
              {className:'col-xs-12'},
              el.span({className: 'h6 text-left'},'What if I can not stop?'),
              el.div({className:'well well-sm col-xs-12'},
              el.p(null, 'If you have a problem gambling there are various services available.  Please see ',
              el.span(null,
                  el.a(
                      {
                        href: 'http://www.gamblinghelp.org',
                        target: '_blank'
                      },'gamblinghelp.org'),
              el.span(null, ', ',
              el.span(null,
                  el.a(
                      {
                        href: 'http://www.ncpgambling.org',
                        target: '_blank'
                      },'ncpgambling.org'),
               el.span(null, ' and ',
               el.span(null,
                   el.a(
                       {
                         href: 'http://www.helpguide.org',
                         target: '_blank'
                       },'helpguide.org'),
               el.span(null, ' or search google for many more.  Remember you can lose when playing and only risk what you are willing to lose. Bit-Exo is not responsible for mistaken bets or funds lost with MoneyPot.'
             )))))))
                )//end well
              ),
            el.div(
              {className:'col-xs-12'},
              el.span({className: 'h6 text-left'},'Tipping users:'),
              el.div({className:'well well-sm col-xs-12'},
              el.p(null, 'If you wish to help someone out you can tip other users within Bit-Exo without having to withdraw your coins to Moneypot first.  Simply type /tip [username] [amount] [coin] (ex. /tip J_ROC 1000 BITS or /tip J_ROC 0.001 BTC) and the coins will be transferred instantly.  If the receiver wishes to see his balance update immediately they will have to click on the refresh balance button on top otherwise it will update automatically after 10 seconds. Optionally you may add "private" to the end of the tip and the tip will be sent silently in chat.  Please use caution when tipping users and do not loan coins to those you do not trust.'),
              el.p(null,'If you wish to help everyone out, you can Make it Rain!  Just type /rain amount type(eg. /rain 1000 bits) and the bot will tip everyone in chat a share of the amount you sent.')
              )//end well
            ),
            el.div(
              {className:'col-xs-12'},
              el.span({className: 'h6 text-left'},'Provable Fairness:'),
              el.div({className:'well well-sm col-xs-12'},
              el.p(null, 'Bets made are all provably fair.  How does this work? Before each bet is made a hash is generated by MoneyPot and is sent to the site, this is then combined with the bet+seed and sent back to the MoneyPot bet API and the result is then returned, win or lose to the casino.  A script on the casino verifies each bet to ensure that all bets are provably fair.'),
              React.createElement(provably_fair_box,null)
              ) //end well
            ),
            el.div(
              {className:'col-xs-12'},
              el.span({className: 'h6 text-left'},'Contact Info:'),
              el.div({className:'well well-sm col-xs-12'},
              el.p(null, 'If you need to get a hold of the site admins you can email us at:'),
              el.p(null, 'support@bit-exo.com or admin@bit-exo.com'),
              el.p(null, 'You can also leave us a message on our ',
                el.span(null,
                  el.a(
                      {
                        href: 'https://bitcointalk.org/index.php?topic=1359320.0',
                        target: '_blank'
                      },'thread')))
              ) //end well
            )
         )//end panel-body
       )
     );
   }
});

var JackpotTabContent = React.createClass({
  displayName: 'JackpotTabContent',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('app_info_update', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('app_info_update', this._onStoreChange);
  },
   render: function() {
     var jackpotsize;
     if (worldStore.state.jackpotlist.data[worldStore.state.jackpotlist.end] != null){
        jackpotsize = (worldStore.state.currentAppwager - worldStore.state.jackpotlist.data[worldStore.state.jackpotlist.end].sitewager) * 0.001;
      }else{
        jackpotsize = (worldStore.state.currentAppwager - (worldStore.state.currentAppwager - 2000000000)) * 0.001;;
      }
     return el.div(
       null,
       el.div({className:'panel panel-default'},
        el.div({className:'panel-body'},
          el.div({className:'well well-sm col-xs-12'},
            el.div({className: 'text-center h6'},'Jackpot Size: ',
              el.span(null,
                helpers.commafy(helpers.convSatstoCointype(jackpotsize).toString()) + ' ' + worldStore.state.coin_type
              )
            )
          ),
          el.div({className:'well well-sm col-xs-12'},
            el.div({className: 'text-center'},
              el.span({className: 'text-center h5', style:{fontWeight:'bold'}}, 'Previous Winners'),
              el.table(
                {className: 'table text-left text-small', style: {fontWeight:'normal',marginTop:'5px'}},
                el.thead(
                  null,
                  el.tr(
                    null,
                    el.th(null, 'Date'),
                    el.th(null, 'User'),
                    el.th(null, 'Game'),
                    el.th(null, 'Prize'),
                    el.th(null, 'ID')
                  )
                ),
                el.tbody(
                  null,
                  worldStore.state.jackpotlist.toArray().map(function(list) {
                    return el.tr(
                     { key: list.id},
                       // Time
                       el.td(
                         null,
                         list.created_at.substring(0,10)
                       ),
                       // User
                       el.td(
                         null,
                         el.a(
                           {
                             href: config.mp_browser_uri + '/users/' + list.uname,
                             target: '_blank'
                           },
                           list.uname
                         )
                       ),
                       // Game
                       el.td(
                         null,
                         list.kind
                       ),
                       // Prize
                       el.td(
                         null,
                         helpers.convNumtoStr(list.jprofit) + ' ' + worldStore.state.coin_type
                       ),
                      // bet id
                      el.td(
                        null,
                        el.a(
                          {
                            href: config.mp_browser_uri + '/bets/' + list.id,
                            target: '_blank'
                          },
                          list.id
                        )
                      )
                    );
                  }).reverse()
                )
              )

            )
          ),
          el.div({className:'well well-sm col-xs-12'},
            el.div({className: 'text-center'},
              el.span({className: 'text-center h5', style:{fontWeight:'bold'}}, 'Jackpot Rules'),
              el.p({className:'text-left'}, 'The Jackpot is available to any user betting on our casino and can be won on any game so you can continue to play your favorite game. The Jackpot amount is progressive based on the sites wager.  In order to qualify for the Jackpot your bets wager must be at least ',
                el.span(null,
                    helpers.convSatstoCointype(100).toString() + ' ' + worldStore.state.coin_type,
                    el.span(null,
                      '.  The winner is determined by the Raw_Outcome of the wager.  A winning bet is one that the Raw_Outcome is less than 4295 for bets ',
                      el.span(null,
                        helpers.convSatstoCointype(10000).toString() + ' ' + worldStore.state.coin_type,
                        el.span(null,
                          ' and above.  This works out to a chance of 1 in 1 Million Bets.  Bets less than ',
                          el.span(null,
                            helpers.convSatstoCointype(10000).toString() + ' ' + worldStore.state.coin_type,
                            el.span(null,
                              ' and above ',
                              el.span(null,
                                helpers.convSatstoCointype(100).toString() + ' ' + worldStore.state.coin_type,
                                el.span(null,
                                  ' can still win the jackpot but the lower your wager the more challenging it becomes with ',
                                  el.span(null,
                                    helpers.convSatstoCointype(100).toString() + ' ' + worldStore.state.coin_type,
                                    el.span(null,
                                      ' bets having 1% the chance a bet greater than or equal to ',
                                      el.span(null,
                                        helpers.convSatstoCointype(10000).toString() + ' ' + worldStore.state.coin_type,
                                        el.span(null,
                                            ' has. The winner of each round will be announced in chat and the prizes will be manually transferred within 8 hours.'
                                        )
                                      )
                                    )
                                  )
                                )
                              )
                            )
                          )
                        )
                      )
                     )
                  )
                )// end P
            )
          )
        )
       )
     );
   }
 });


 var BiggestTabContent = React.createClass({
   displayName: 'BiggestTabContent',
   _onStoreChange: function() {
     this.forceUpdate();
   },
   componentDidMount: function() {
     worldStore.on('biggest_info_update', this._onStoreChange);
   },
   componentWillUnmount: function() {
     worldStore.off('biggest_info_update', this._onStoreChange);
   },
    render: function() {
      return el.div(
        null,
        el.div({className:'panel panel-default'},
         el.div({className:'panel-body'},

           el.div({className:'well well-sm col-xs-12'},
             el.div({className: 'text-center'},
               el.span({className: 'text-center h5', style:{fontWeight:'bold'}}, 'Biggest Winning Bets'),
               el.table(
                 {className: 'table text-left text-small', style: {fontWeight:'normal',marginTop:'5px'}},
                 el.thead(
                   null,
                   el.tr(
                     null,
                     el.th(null, 'Time'),
                     el.th(null, 'User'),
                     el.th(null, 'Game'),
                     el.th(null, 'Wager'),
                     el.th(null, 'Profit'),
                     el.th(null, 'ID')
                   )
                 ),
                 el.tbody(
                   null,
                   worldStore.state.biggestwins.toArray().map(function(list) {
                     return el.tr(
                      { key: list.id},
                        // Time
                        el.td(
                          null,
                          helpers.formatDateToTime(list.created_at)//list.created_at.substring(0,10)
                        ),
                        // User
                        el.td(
                          null,
                          el.a(
                            {
                              href: config.mp_browser_uri + '/users/' + list.uname,
                              target: '_blank'
                            },
                            list.uname
                          )
                        ),
                        // Game
                        el.td(
                          null,
                          list.kind
                        ),
                        // Profit
                        el.td(
                          null,
                          helpers.convNumtoStr(list.wager) + ' ' + worldStore.state.coin_type
                        ),
                        // Profit
                        el.td(
                          null,
                          helpers.convNumtoStr(list.profit) + ' ' + worldStore.state.coin_type
                        ),
                       // bet id
                       el.td(
                         null,
                         el.a(
                           {
                             href: config.mp_browser_uri + '/bets/' + list.id,
                             target: '_blank'
                           },
                           list.id
                         )
                       )
                     );
                   }).reverse()
                 )
               )

             )
           ),
           el.div({className:'well well-sm col-xs-12'},
             el.div({className: 'text-center'},
               el.span({className: 'text-center h5', style:{fontWeight:'bold'}}, 'Biggest Losing Bets'),
               el.table(
                 {className: 'table text-left text-small', style: {fontWeight:'normal',marginTop:'5px'}},
                 el.thead(
                   null,
                   el.tr(
                     null,
                     el.th(null, 'Time'),
                     el.th(null, 'User'),
                     el.th(null, 'Game'),
                     el.th(null, 'Wager'),
                     el.th(null, 'Loss'),
                     el.th(null, 'ID')
                   )
                 ),
                 el.tbody(
                   null,
                   worldStore.state.biggestlosses.toArray().map(function(list) {
                     return el.tr(
                      { key: list.id},
                        // Time
                        el.td(
                          null,
                          helpers.formatDateToTime(list.created_at)//list.created_at.substring(0,10)
                        ),
                        // User
                        el.td(
                          null,
                          el.a(
                            {
                              href: config.mp_browser_uri + '/users/' + list.uname,
                              target: '_blank'
                            },
                            list.uname
                          )
                        ),
                        // Game
                        el.td(
                          null,
                          list.kind
                        ),
                        // Profit
                        el.td(
                          null,
                          helpers.convNumtoStr(list.wager) + ' ' + worldStore.state.coin_type
                        ),
                        // Profit
                        el.td(
                          null,
                          helpers.convNumtoStr(list.profit) + ' ' + worldStore.state.coin_type
                        ),
                       // bet id
                       el.td(
                         null,
                         el.a(
                           {
                             href: config.mp_browser_uri + '/bets/' + list.id,
                             target: '_blank'
                           },
                           list.id
                         )
                       )
                     );
                   }).reverse()
                 )
               )

             )
           ),
           el.div({className:'well well-sm col-xs-12'},
             el.div({className: 'text-center'},
               el.span({className: 'text-center h5', style:{fontWeight:'bold'}}, 'Biggest Wagered'),
               el.table(
                 {className: 'table text-left text-small', style: {fontWeight:'normal',marginTop:'5px'}},
                 el.thead(
                   null,
                   el.tr(
                     null,
                     el.th(null, 'User'),
                     el.th(null, 'Wagered'),
                     el.th(null, 'Profit')
                   )
                 ),
                 el.tbody(
                   null,
                   worldStore.state.biggestwagered.toArray().map(function(list) {
                     return el.tr(
                      { key: list.uname},
                        // User
                        el.td(
                          null,
                          el.a(
                            {
                              href: config.mp_browser_uri + '/users/' + list.uname,
                              target: '_blank'
                            },
                            list.uname
                          )
                        ),
                        // Wager
                        el.td(
                          null,
                          helpers.convNumtoStr(list.wager) + ' ' + worldStore.state.coin_type
                        ),
                        // Profit
                        el.td(
                          null,
                          helpers.convNumtoStr(list.profit) + ' ' + worldStore.state.coin_type
                        )
                     );
                   }).reverse()
                 )
               )

             )
           ),
           el.div({className:'well well-sm col-xs-12'},
             el.div({className: 'text-center'},
               el.span({className: 'text-center h5', style:{fontWeight:'bold'}}, 'Biggest Jackpot Wins'),
               el.table(
                 {className: 'table text-left text-small', style: {fontWeight:'normal',marginTop:'5px'}},
                 el.thead(
                   null,
                   el.tr(
                     null,
                     el.th(null, 'Date'),
                     el.th(null, 'User'),
                     el.th(null, 'Game'),
                     el.th(null, 'Prize'),
                     el.th(null, 'ID')
                   )
                 ),
                 el.tbody(
                   null,
                   worldStore.state.biggestjackpots.toArray().map(function(list) {
                     return el.tr(
                      { key: list.id},
                        // Time
                        el.td(
                          null,
                          list.created_at.substring(0,10)
                        ),
                        // User
                        el.td(
                          null,
                          el.a(
                            {
                              href: config.mp_browser_uri + '/users/' + list.uname,
                              target: '_blank'
                            },
                            list.uname
                          )
                        ),
                        // Game
                        el.td(
                          null,
                          list.kind
                        ),
                        // Prize
                        el.td(
                          null,
                          helpers.convNumtoStr(list.jprofit) + ' ' + worldStore.state.coin_type
                        ),
                       // bet id
                       el.td(
                         null,
                         el.a(
                           {
                             href: config.mp_browser_uri + '/bets/' + list.id,
                             target: '_blank'
                           },
                           list.id
                         )
                       )
                     );
                   }).reverse()
                 )
               )

             )
           ),
           el.div({className:'well well-sm col-xs-12'},
             el.div({className: 'text-center'},
               el.span({className: 'text-center h5', style:{fontWeight:'bold'}}, 'Biggest Profits All Time'),
               el.table(
                 {className: 'table text-left text-small', style: {fontWeight:'normal',marginTop:'5px'}},
                 el.thead(
                   null,
                   el.tr(
                     null,
                     el.th(null, 'User'),
                     el.th(null, 'Wagered'),
                     el.th(null, 'Profit')
                   )
                 ),
                 el.tbody(
                   null,
                   worldStore.state.biggestprofit.toArray().map(function(list) {
                     return el.tr(
                      { key: list.uname},
                        // User
                        el.td(
                          null,
                          el.a(
                            {
                              href: config.mp_browser_uri + '/users/' + list.uname,
                              target: '_blank'
                            },
                            list.uname
                          )
                        ),
                        // Wager
                        el.td(
                          null,
                          helpers.convNumtoStr(list.wager) + ' ' + worldStore.state.coin_type
                        ),
                        // Profit
                        el.td(
                          null,
                          helpers.convNumtoStr(list.profit) + ' ' + worldStore.state.coin_type
                        )
                     );
                   }).reverse()
                 )
               )

             )
           )
         )
        )
      );
    }
  });


var TabContent = React.createClass({
  displayName: 'TabContent',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change_tab', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change_tab', this._onStoreChange);
  },
  render: function() {
    switch(worldStore.state.currTab) {
      case 'FAUCET':
        return React.createElement(FaucetTabContent, null);
      case 'MY_BETS':
      ////////////
        if (worldStore.state.bets.data[worldStore.state.bets.end] == null){
          var params = {
            uname: worldStore.state.user.uname
          };
          socket.emit('list_user_bets', params, function(err, bets) {
            if (err) {
              console.log('[socket] list_user_bets failure:', err);
              return;
            }
            console.log('[socket] list_user_bets success:', bets);
            bets.map(function(bet){
              bet.meta = {
                cond: bet.kind == 'DICE' ? bet.cond : '<',
                number: bet.kind == 'DICE' ? bet.target : 99.99,
                hash: 0,//bet.hash,
                isFair: true//CryptoJS.SHA256(bet.secret + '|' + bet.salt).toString() === hash
              };

              if (bet.kind != 'DICE')
                {
                bet.outcome = '-';
                }
              bet.meta.kind = bet.kind;
            })
            Dispatcher.sendAction('INIT_USER_BETS', bets);
          });
          }
        //////////////////
        return React.createElement(MyBetsTabContent, null);
      case 'ALL_BETS':
        return React.createElement(AllBetsTabContent, null);
      case 'STATS':
        return React.createElement(StatsTabContent, null);
      case 'JACKPOT':
          Dispatcher.sendAction('UPDATE_APP_INFO');
        return React.createElement(JackpotTabContent, null);
      case 'HELP':
        return React.createElement(HelpTabContent,null);
      case 'BIGGEST':
          Dispatcher.sendAction('UPDATE_BIGGEST_INFO');
        return React.createElement(BiggestTabContent,null);
      default:
        alert('Unsupported currTab value: ', worldStore.state.currTab);
        break;
    }
  }
});

var Footer = React.createClass({
  displayName: 'Footer',
  render: function() {
    Dispatcher.sendAction('CHANGE_GAME_TAB', 'DICE_GAME');
    return el.div(
      {
        className: 'text-center text-muted',
        style: {
          marginTop: '200px'
        }
      },
      el.div({className:'link_list'},
          el.ul({className:'list-group'},
            el.li(null,
              el.a(
                {
                  href: 'https://bitcointalk.org/index.php?topic=1359320.0',
                  target: '_blank'
                },
                'Bitcointalk'
              )
            ),
            el.li(null,
            ' | Powered by ',
            el.a(
              {
                href: 'https://www.moneypot.com',
                target: '_blank'
              },
              'Moneypot'
            )
          )
        )
      ),
      el.div({className:'link_list'},
          el.ul({className:'list-group'},
            el.li(null,
              'Plinko based on ',
              el.a(
                {
                  href: 'https://classic.plinkopot.com',
                  target: '_blank'
                },
                'Classic Plinkopot'
              )
            ),
            el.li(null,
            ' | Roulette derived from ',
            el.a(
              {
                href: 'https://sat.oshi.xyz',
                target: '_blank'
              },
              'sat.oshi.xyz'
            )
          )
        )
      )
    );
  }
});


var App = React.createClass({
  displayName: 'App',
  render: function() {
    if (worldStore.state.accessToken)
      {Dispatcher.sendAction('UPDATE_BANKROLL');}

    return el.div(
      {className: 'container'},
      // Navbar
      React.createElement(Navbar, null),
      // Game Tabs
      el.div(
        {style: {marginTop: '50px'}},
        React.createElement(GameTabs, null)  //renamed from Tabs
      ),
      // Game Tab Contents
      React.createElement(GameTabContent, null), //ranamed from TabContent
      el.div(
        null,//  {style: {marginTop: '50px'}},
        React.createElement(ChatBox, null)
      ),
      // Tabs
      el.div(
        {style: {marginTop: '10px'}},
        React.createElement(Tabs, null)
      ),
      // Tab Contents
      React.createElement(TabContent, null),
      // Footer
      React.createElement(Footer, null)
    );
  }
});

ReactDOM.render(
  React.createElement(App, null),
  document.getElementById('app')
);

connectToChatServer();
////////////////////
//GETHASH
function gethashfromsocket(){
  var req_data = {
    auth_id: worldStore.state.auth_id
  };
  console.log('[socket] getting hash for: ' + worldStore.state.auth_id);
  socket.emit('get_hash', req_data, function(err, data) {
    if (err) {
      console.log('[socket] hash error:', err);
      return;
    }
    console.log('[socket] hash success:', data);
    Dispatcher.sendAction('SET_NEXT_HASH', data.hash);
  });
}
////////////////////////////////////////////////////////////
// Hook up to chat server
var lastbetID = 0;

function connectToChatServer() {
  console.log('Connecting to chat server. AccessToken:',
              worldStore.state.accessToken);

  socket = io(config.be_uri);

  socket.on('connect', function() {
    console.log('[socket] Connected');

    socket.on('disconnect', function() {
      console.log('[socket] Disconnected');
    });

    // When subscribed to DEPOSITS:

    socket.on('unconfirmed_balance_change', function(payload) {
      console.log('[socket] unconfirmed_balance_change:', payload);
      Dispatcher.sendAction('UPDATE_USER', {
        unconfirmed_balance: payload.balance
      });
    });

    socket.on('balance_change', function(payload) {
      console.log('[socket] (confirmed) balance_change:', payload);
      Dispatcher.sendAction('UPDATE_USER', {
        balance: payload.balance
      });
    });

    // message is { text: String, user: { role: String, uname: String} }
    socket.on('new_message', function(message) {
      console.log('[socket] Received chat message:', message);
      Dispatcher.sendAction('NEW_MESSAGE', message);
    });

    socket.on('user_joined', function(user) {
      console.log('[socket] User joined:', user);
      Dispatcher.sendAction('USER_JOINED', user);
    });

    // `user` is object { uname: String }
    socket.on('user_left', function(user) {
      console.log('[socket] User left:', user);
      Dispatcher.sendAction('USER_LEFT', user);
    });

    socket.on('new_all_bet', function(betarray) {
      //console.log('[socket] New All bet array:', betarray);
      Dispatcher.sendAction('NEW_ALL_BET', betarray);
    });

    // Received when your client doesn't comply with chat-server api
    socket.on('client_error', function(text) {
      console.warn('[socket] Client error:', text);
    });

    // Once we connect to chat server, we send an auth message to join
    // this app's lobby channel.

    var authPayload = {
      app_id: config.app_id,
      access_token: worldStore.state.accessToken,
      subscriptions: ['CHAT', 'DEPOSITS', 'BETS']
    };

    if((confidential_token) && (!worldStore.state.accessToken)) {
      var authPayload = {
        app_id: config.app_id,
        confidential_token: confidential_token
      };

      socket.emit('get_auth_id', authPayload, function(err, data) {
        if (err) {
          console.log('[socket] Auth failure:', err);
          return;
        }
        console.log('[socket] Auth success:', data);
        Dispatcher.sendAction('UPDATE_AUTH_ID',data);
        //Dispatcher.sendAction('INIT_CHAT', data);
      });

    }


    socket.emit('chat_init', authPayload, function(err, data) {
      if (err) {
        console.log('[socket] chat_init failure:', err);
        return;
      }
      console.log('[socket] chat_init success:', data);
      Dispatcher.sendAction('INIT_CHAT', data);
      if (data.user.uname)
        {
        Dispatcher.sendAction('INIT_USER', data);
        gethashfromsocket();
        }
      Dispatcher.sendAction('STOP_LOADING');
      Dispatcher.sendAction('UPDATE_APP_INFO');
    });

    socket.emit('list_all_bets', function(err, data) {
      if (err) {
        console.log('[socket] list_all_bets failure:', err);
        return;
      }
      console.log('[socket] list_all_bets success:', data);
      Dispatcher.sendAction('INIT_ALL_BETS', data);
    });


  });
}

// This function is passed to the recaptcha.js script and called when
// the script loads and exposes the window.grecaptcha object. We pass it
// as a prop into the faucet component so that the faucet can update when
// when grecaptcha is loaded.
function onRecaptchaLoad() {
  Dispatcher.sendAction('GRECAPTCHA_LOADED', grecaptcha);
}

$(document).on('keydown', function(e) {
  var H = 72, L = 76, C = 67, X = 88, A = 65, S = 83, D = 68, F = 70, G = 71, SPACE = 32, keyCode = e.which;

  // Bail is hotkeys aren't currently enabled to prevent accidental bets
  if (!worldStore.state.hotkeysEnabled) {
    return;
  }

  // Bail if it's not a key we care about
  if (keyCode !== H && keyCode !== L && keyCode !== X && keyCode !== C && keyCode !== A && keyCode !== S && keyCode !== D && keyCode !== F && keyCode !== G && keyCode !== SPACE) {
    return;
  }

  // TODO: Remind self which one I need and what they do ^_^;;
  e.stopPropagation();
  e.preventDefault();

  switch(keyCode) {
    case C:  // Increase wager
      if (((worldStore.state.currGameTab == 'PLINKO')||(worldStore.state.currGameTab == 'DICE_GAME')||(worldStore.state.currGameTab == 'BITSWEEP'))&&(betStore.state.BS_Game.state != 'RUNNING')){
      var n = worldStore.state.coin_type === 'BITS' ? (betStore.state.wager.num * 2).toFixed(2) : (betStore.state.wager.num * 2).toFixed(8);
      Dispatcher.sendAction('UPDATE_WAGER', { str: n.toString() });
      }else{
        $('#RT-DOUBLE').click();
      }
      break;
    case X:  // Decrease wager
      if (((worldStore.state.currGameTab == 'PLINKO')||(worldStore.state.currGameTab == 'DICE_GAME')||(worldStore.state.currGameTab == 'BITSWEEP'))&&(betStore.state.BS_Game.state != 'RUNNING')){
      var newWager = worldStore.state.coin_type === 'BITS' ? (betStore.state.wager.num / 2).toFixed(2) : (betStore.state.wager.num / 2).toFixed(8);
      Dispatcher.sendAction('UPDATE_WAGER', { str: newWager.toString() });
      }else{
        $('#RT-HALF').click();
      }
      break;
    case L:  // Bet lo
      $('#bet-lo').click();
      break;
    case H:  // Bet hi
      $('#bet-hi').click();
      break;
    case A:  // Bet ROW1
      $('#bet-ROW1').click();
      break;
    case S:  // Bet ROW2
      $('#bet-ROW2').click();
      break;
    case D:  // Bet ROW3
      $('#bet-ROW3').click();
      break;
    case F:  // Bet ROW4
      $('#bet-ROW4').click();
      break;
    case G:  // Bet ROW5
      $('#bet-ROW5').click();
      break;
    case SPACE: //SPIN ROULETTE
      if (worldStore.state.currGameTab == 'ROULETTE'){
      $('#RT-SPIN').click();
      }else if (worldStore.state.currGameTab == 'BITSWEEP'){
      $('#BS-START').click();
      }
      break;
    default:
      return;
  }
});

window.addEventListener('message', function(event) {
  if (event.origin === config.mp_browser_uri && event.data === 'UPDATE_BALANCE') {
    Dispatcher.sendAction('START_REFRESHING_USER');
  }
}, false);
window.setInterval(function(){
    if (worldStore.state.user){
    Dispatcher.sendAction('START_REFRESHING_USER');
    if (!betStore.state.nextHash){
        gethashfromsocket();
      }
    }
 }, 10000);

 window.setInterval(function(){Dispatcher.sendAction('UPDATE_APP_INFO');},60000);
