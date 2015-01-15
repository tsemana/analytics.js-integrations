'use strict';

/**
* Module dependencies.
*/

var bind = require('bind');
var each = require('each');
var integration = require('analytics.js-integration');
var formatConversionParams = require('./extole/formatConversionParams');
var createConversionTag = require('./extole/createConversionTag');

/**
* Expose `Extole` integration.
*/

var Extole = module.exports = integration('Extole')
  .global('extole')
  .option('clientId', '')
  .mapping('events')
  .tag('main', '<script src="//tags.extole.com/{{ clientId }}/core.js">');

/**
* Initialize.
*
* @param {Object} page
*/

Extole.prototype.initialize = function(){
  if (this.loaded()) return this.ready();
  this.load('main', bind(this, this.ready));
};

/**
* Loaded?
*
* @return {Boolean}
*/

Extole.prototype.loaded = function(){
  return !!window.extole;
};

/**
* Track.
*
* @param {Track} track
*/

Extole.prototype.track = function(track){
  var user = this.analytics.user();
  var traits = user.traits();
  var userId = user.id();
  var email = traits.email;

  if (!userId && !email) {
    return this.debug('User must be identified before `#track` calls');
  }

  var event = track.event();
  var extoleEvents = this.events(event);

  if (!extoleEvents.length) {
    return this.debug('No events found for %s', event);
  }

  each(extoleEvents, bind(this, function(extoleEvent){
    this._registerConversion(createConversionTag({
      type: extoleEvent,
      params: formatConversionParams(event, email, userId, track.properties())
    }));
  }));
};

/**
 * Register a conversion to Extole.
 *
 * @api private
 * @param {HTMLElement} conversionTag An Extole conversion tag.
 */

// TODO: If I understand Extole's lib correctly, this is sometimes async,
// sometimes sync. Should probably refactor this into more predictable/sane
// behavior
Extole.prototype._registerConversion = function(conversionTag){
  if (window.extole.main && window.extole.main.fireConversion) {
    return window.extole.main.fireConversion(conversionTag);
  }

  if (window.extole.initializeGo) {
    window.extole.initializeGo().andWhenItsReady(function(){
      window.extole.main.fireConversion(conversionTag);
    });
  }
};
