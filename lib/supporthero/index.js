/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');

/**
 * Expose `SupportHero` integration.
 */

var SupportHero =  module.exports = integration('SupportHero')
  .assumesPageview()
  .global('supportHeroWidget')
  .option('token', '')
  .option('track', false)
  .tag('<script src="https://d29l98y0pmei9d.cloudfront.net/js/widget.min.js?k={{ token }}">');

/**
 * Initialize Support Hero.
 *
 * @param {Facade} page
 */

SupportHero.prototype.initialize = function(page){
  window.supportHeroWidget = {};
  window.supportHeroWidget.identify = window.supportHeroWidget.identify || function(){};
  this.load(this.ready);
};

/**
 * Has the Support Hero library been loaded yet?
 *
 * @return {Boolean}
 */

SupportHero.prototype.loaded = function(){
	return !! window.supportHeroWidget;
};

/**
 * Identify a user.
 *
 * @param {Facade} identify
 */

SupportHero.prototype.identify = function(identify){
	var id = identify.userId();
	var traits = identify.traits();
	if (id) {
		window.supportHeroWidget.identify(id, traits);
	} else {
		window.supportHeroWidget.identify(traits);
	}
};
