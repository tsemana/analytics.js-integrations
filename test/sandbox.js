
/**
 * Module dependencies.
 */

var clearTimeouts = require('clear-timeouts');
var clearIntervals = require('clear-intervals');
var clearListeners = require('./clear-listeners');
var clearGlobals = require('./clear-globals');

/**
 * Reset initial state.
 */

module.exports = function(){
  clearTimeouts();
  clearIntervals();
  clearListeners();
  clearGlobals();
};