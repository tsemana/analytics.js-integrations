
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');
var push = require('global-queue')('_iva');
var Track = require('facade').Track;
var each = require('each');
var is = require('is');

/**
 * HOP.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Expose `InsideVault` integration.
 */

var InsideVault = module.exports = integration('InsideVault')
  .global('_iva')
  .option('clientId', '')
  .option('domain', '')
  .tag('<script src="//analytics.staticiv.com/iva.js">')
  .mapping('events');

/**
 * Initialize.
 *
 * @param page
 */

InsideVault.prototype.initialize = function(page){
  var domain = this.options.domain;
  window._iva = window._iva || [];
  push('setClientId', this.options.clientId);
  var userId = this.analytics.user().id();
  if (userId) push('setUserId', userId);
  if (domain) push('setDomain', domain);
  this.load(this.ready);
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

InsideVault.prototype.loaded = function(){
  return !! (window._iva && window._iva.push !== Array.prototype.push);
};

/**
 * Identify.
 *
 * @param {Identify} identify
 */

InsideVault.prototype.identify = function(identify){
  push('setUserId', identify.userId());
};

/**
 * Page.
 *
 * @param {Page} page
 */

InsideVault.prototype.page = function(page){
  // they want every landing page to send a "click" event.
  push('trackEvent', 'click');
};

/**
 * Track.
 *
 * Tracks everything except 'sale' events.
 *
 * @param {Track} track
 */

InsideVault.prototype.track = function(track){
  var user = this.analytics.user();
  var events = this.events(track.event());
  var value = track.revenue() || track.value() || 0;
  var eventId = track.orderId() || user.id() || '';
  each(events, function(event){
    // 'sale' is a special event that will be routed to a table that is deprecated on InsideVault's end.
    // They don't want a generic 'sale' event to go to their deprecated table.
    if (event != 'sale') {
      push('trackEvent', event, value, eventId);
    }
  });
};
