/**
 * Module dependencies.
 */
var integration = require('analytics.js-integration');
var push = require('global-queue')('_iva');
var load = require('load-script');
var is = require('is');

/**
 * Expose plugin.
 */
module.exports = exports = function (analytics) {
  analytics.addIntegration(InsideVault);
};

/**
 * Expose `InsideVault` integration.
 */

var InsideVault = exports.Integration = integration('InsideVault')
  .readyOnLoad()
  .global('_iva')
  .option('clientId', '')
  .option('domain', '');

/**
 * Initialize.
 *
 * @param page
 */
InsideVault.prototype.initialize = function (page) {
  var opts = this.options;
  var domain = opts.domain;

  window._iva = window._iva || [];

  push('setClientId', opts.clientId);
  if (domain) push('setDomain', domain);

  this.load();
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */
InsideVault.prototype.loaded = function () {
  return !! (window._iva && window._iva.push !== Array.prototype.push);
};

/**
 * Load InsideVault script.
 *
 * @param {Function} callback
 */
InsideVault.prototype.load = function (callback) {
  load('//analytics.staticiv.com/iva.js', callback);
};

/**
 * Track.
 *
 * Tracks everything except 'sale' events.
 *
 * @param {Track} track
 */
InsideVault.prototype.track = function (track) {
  var event = track.event();
  var value = track.revenue() || track.value() || 0;
  var orderId = track.orderId() || '';

  // 'sale' is a special event that will be routed to a table that is deprecated on our end.
  // We don't want a generic 'sale' event to go to our deprecated table.
  if (event != 'sale') {
    push('trackEvent', event, value, orderId);
  }
};
