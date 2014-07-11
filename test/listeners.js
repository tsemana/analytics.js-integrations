
/**
 * Window event listeners.
 */

var listeners = [];

/**
 * Original window functions.
 */

var addEventListener = window.addEventListener;
var removeEventListener = window.removeEventListener;

/**
 * Clear event listeners.
 */

exports = module.exports = function(){
  var i = listeners.length;
  while (i--) window.removeEventListener.apply(window, listeners[i]);
  listeners.length = 0;
};

/**
 * Wrap window.addEventListener and window.removeEventListener
 * to be able to cleanup all event listeners for testing.
 */

exports.bind = function(){
  window.addEventListener = function(name, listener, useCapture){
    listeners.push(arguments);
    return addEventListener.apply(window, arguments);
  };

  window.removeEventListener = function(name, listener, useCapture){
    for (var i = 0, n = listeners.length; i < n; i++) {
      if (name !== listeners[i][0]) continue;
      if (listener !== listeners[i][1]) continue;
      if (arguments.length > 2 && useCapture !== listeners[i][2]) continue;
      listeners.splice(i, 1);
      break;
    }
    return removeEventListener.apply(window, arguments);
  };
};

/**
 * Reset window back to normal.
 */

exports.unbind = function(){
  listeners.length = 0;
  window.addEventListener = addEventListener;
  window.removeEventListener = removeEventListener;
};