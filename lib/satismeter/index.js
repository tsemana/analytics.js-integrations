
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');
var when = require('when');

/**
 * Expose `SatisMeter` integration.
 */

var SatisMeter = module.exports = integration('SatisMeter')
  .global('satismeter')
  .option('token', '')
  .tag('<script src="https://app.satismeter.com/satismeter.js">');

/**
 * Initialize.
 *
 * @param {Object} page
 */

SatisMeter.prototype.initialize = function(page){
  var self = this;
  this.load(function(){
    when(function(){ return self.loaded(); }, self.ready);
  });
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

SatisMeter.prototype.loaded = function(){
  return !!window.satismeter;
};

/**
 * Identify.
 *
 * @param {Identify} identify
 */

SatisMeter.prototype.identify = function(identify){
  var user = {
    id: identify.userId()
  };
  if (identify.name()) {
    user.name = identify.name();
  }
  if (identify.email()) {
    user.email = identify.email();
  }
  if (identify.created()) {
    user.signUpDate = identify.created().toISOString();
  }
  window.satismeter({
    token: this.options.token,
    user: user
  });
};
