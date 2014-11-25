
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');
var is = require('is');
var extend = require('extend');
var onError = require('on-error');

/**
 * UMD
 */

var umd = 'function' == typeof define && define.amd;

/**
 * Source.
 */

var src = '//www.atatus.com/atatus.js';

/**
 * Expose `Atatus` integration.
 */

var Atatus = module.exports = integration('Atatus')
  .global('atatus')
  .option('apiKey', '')
  .tag('<script src="' + src + '">');

/**
 * Initialize.
 *
 * https://www.atatus.com/docs.html
 *
 * @param {Object} page
 */

Atatus.prototype.initialize = function(page){
  var self = this;

  if (umd) {
    window.require([src], function(atatus){
      atatus.init(self.options.apiKey).attach();
      window.atatus = atatus;
      self.ready();
    });
    return;
  }

  this.load(function(){
    window.atatus.init(self.options.apiKey).attach();
    self.ready();
  });
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Atatus.prototype.loaded = function(){
  return is.object(window.atatus);
};

/**
 * Identify.
 *
 * @param {Identify} identify
 */

Atatus.prototype.identify = function(identify){
  var traits = identify.traits();
  window.atatus.setCustomData({ person: traits });
};
