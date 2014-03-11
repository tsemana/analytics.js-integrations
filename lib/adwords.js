
var onbody = require('on-body');
var integration = require('integration');

/**
 * Expose plugin
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(AdWords);
};

/**
 * HOP
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Expose `AdWords`
 */

var AdWords = exports.Integration = integration('AdWords')
  .readyOnLoad()
  .option('conversionId', '')
  .option('events', {});

/**
 * Load
 *
 * @param {Function} fn
 * @api public
 */

AdWords.prototype.load = function(fn){
  onbody(fn);
};

/**
 * Loaded.
 *
 * @return {Boolean}
 * @api public
 */

AdWords.prototype.loaded = function(){
  return !! document.body;
};

/**
 * Track.
 *
 * @param {Track}
 * @api public
 */

AdWords.prototype.track = function(track){
  var id = this.options.conversionId;
  var events = this.options.events;
  var event = track.event();
  if (!has.call(events, event)) return;
  return conversion({
    value: track.revenue() || 0,
    label: events[event],
    conversionId: id,
  });
};

/**
 * Add an iframe that will send conversions.
 * We do this because adwords depends on `document.write`.
 *
 * TODO: move to a separate repo.
 * TODO: cleanup
 *
 * @param {Object} globals
 * @return {Iframe}
 * @api private
 */

function conversion(globals){
  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.height = 0;
  iframe.width = 0;
  document.body.appendChild(iframe);
  var doc = iframe.contentDocument || iframe.contentWindow.document;
  var body = doc.body || doc.getElementsByTagName('body')[0];
  var js = doc.createElement('script');
  js.type = 'text/javascript';
  js.innerText =
  js.textContent = vars(globals);
  body.appendChild(js);
  js = doc.createElement('script');
  js.type = 'text/javascript';
  js.src = '//www.googleadservices.com/pagead/conversion.js';
  body.appendChild(js);
  return iframe;
}

/**
 * Stringify the given `obj` to variables.
 *
 * TODO: cleanup
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function vars(obj){
  return ''
    + 'google_conversion_id = "' + obj.conversionId + '";'
    + 'google_conversion_language = "en";'
    + 'google_conversion_format = "3";' // g site stats
    + 'google_conversion_color = "ffffff";' // doesn't matter bc ^
    + 'google_conversion_label = "' + obj.label + '";'
    + 'google_conversion_value = ' + obj.value + ';'
    + 'google_remarketing_only = false;'
}
