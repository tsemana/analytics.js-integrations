
var callback = require('callback');
var integration = require('integration');
var load = require('load-script');
var facade = require('facade');
var Track = facade.Track;


/**
 * Expose plugin.
 */

module.exports = exports = function (analytics) {
  analytics.addIntegration(Amplitude);
};


/**
 * Expose `Amplitude` integration.
 */

var Amplitude = exports.Integration = integration('Amplitude')
  .assumesPageview()
  .readyOnInitialize()
  .global('amplitude')
  .option('apiKey', '')
  .option('trackAllPages', false)
  .option('trackNamedPages', true)
  .option('trackCategorizedPages', true);


/**
 * Initialize.
 *
 * https://github.com/amplitude/Amplitude-Javascript
 *
 * @param {Object} page
 */

Amplitude.prototype.initialize = function (page) {
  (function(e,t){var r=e.amplitude||{}; r._q=[];function i(e){r[e]=function(){r._q.push([e].concat(Array.prototype.slice.call(arguments,0)));};} var s=["init","logEvent","setUserId","setGlobalUserProperties","setVersionName"]; for(var c=0;c<s.length;c++){i(s[c]);}e.amplitude=r;})(window,document);
  window.amplitude.init(this.options.apiKey);
  this.load();
};


/**
 * Loaded?
 *
 * @return {Boolean}
 */

Amplitude.prototype.loaded = function () {
  return !! (window.amplitude && window.amplitude.options);
};


/**
 * Load the Amplitude library.
 *
 * @param {Function} callback
 */

Amplitude.prototype.load = function (callback) {
  load('https://d24n15hnbwhuhn.cloudfront.net/libs/amplitude-1.0-min.js', callback);
};


/**
 * Page.
 *
 * @param {Page} page
 */

Amplitude.prototype.page = function (page) {
  var properties = page.properties() || {};
  var category = page.category();
  var name = page.name();
  var opts = this.options;

  // all pages
  if (opts.trackAllPages) {
    this.track(new Track({
      event: 'Loaded a Page',
      properties: properties
    }));
  }

  // categorized pages
  if (category && opts.trackCategorizedPages) {
    this.track(new Track({
      event: 'Viewed ' + category + ' Page',
      properties: properties
    }));
  }

  // named pages
  if (name && opts.trackNamedPages) {
    if (name && category) name = category + ' ' + name;
    this.track(new Track({
      event: 'Viewed ' + name + ' Page',
      properties: properties
    }));
  }
};


/**
 * Identify.
 *
 * @param {Facade} identify
 */

Amplitude.prototype.identify = function (identify) {
  var id = identify.userId();
  var traits = identify.traits();
  if (id) window.amplitude.setUserId(id);
  if (traits) window.amplitude.setGlobalUserProperties(traits);
};


/**
 * Track.
 *
 * @param {Track} event
 */

Amplitude.prototype.track = function (track) {
  var props = track.properties();
  var event = track.event();
  window.amplitude.logEvent(event, props);
};
