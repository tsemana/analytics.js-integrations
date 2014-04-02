
var integration = require('integration');
var load = require('load-script');
var push = require('global-queue')('_qevents', { wrap: false });


/**
 * User reference.
 */

var user;


/**
 * Expose plugin.
 */

module.exports = exports = function (analytics) {
  analytics.addIntegration(Quantcast);
  user = analytics.user(); // store for later
};


/**
 * Expose `Quantcast` integration.
 */

var Quantcast = exports.Integration = integration('Quantcast')
  .assumesPageview()
  .readyOnInitialize()
  .global('_qevents')
  .global('__qc')
  .option('pCode', null)
  .option('labelPages', false);


/**
 * Initialize.
 *
 * https://www.quantcast.com/learning-center/guides/using-the-quantcast-asynchronous-tag/
 * https://www.quantcast.com/help/cross-platform-audience-measurement-guide/
 *
 * @param {Object} page
 */

Quantcast.prototype.initialize = function (page) {
  page = page || {};
  window._qevents = window._qevents || [];

  var opts = this.options;
  var settings = { qacct: opts.pCode };
  if (user.id()) settings.uid = user.id();
  push(settings);

  this.load();
};


/**
 * Loaded?
 *
 * @return {Boolean}
 */

Quantcast.prototype.loaded = function () {
  return !! window.__qc;
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Quantcast.prototype.load = function (callback) {
  load({
    http: 'http://edge.quantserve.com/quant.js',
    https: 'https://secure.quantserve.com/quant.js'
  }, callback);
};


/**
 * Page.
 *
 * https://cloudup.com/cBRRFAfq6mf
 *
 * @param {Page} page
 */

Quantcast.prototype.page = function (page) {
  var category = page.category();
  var name = page.fullName();
  var settings = {
    event: 'refresh',
    labels: labels(category, name),
    qacct: this.options.pCode,
  };
  if (user.id()) settings.uid = user.id();
  push(settings);
};


/**
 * Identify.
 *
 * https://www.quantcast.com/help/cross-platform-audience-measurement-guide/
 *
 * @param {String} id (optional)
 */

Quantcast.prototype.identify = function (identify) {
  // edit the initial quantcast settings
  var id = identify.userId();
  if (id) window._qevents[0].uid = id;
};


/**
 * Track.
 *
 * https://cloudup.com/cBRRFAfq6mf
 *
 * @param {Track} track
 */

Quantcast.prototype.track = function (track) {
  var name = track.event();
  var revenue = track.revenue();
  var settings = {
    event: 'click',
    labels: labels(name),
    qacct: this.options.pCode
  };
  if (revenue !== null) settings.revenue = ''+revenue;
  if (user.id()) settings.uid = user.id();
  push(settings);
};


/**
 * Completed Order.
 * 
 * @param {Track} track
 * @api private
 */

Quantcast.prototype.completedOrder = function(track){
  var name = track.event();
  var settings = {
    event: 'refresh', // the example Quantcast sent has completed order send refresh not click
    labels: labels(name),
    revenue: track.total(),
    orderid: track.orderId(),
    qacct: this.options.pCode
  };
  push(settings);
};


/**
 * Generate a comma separated string of labels in Quantcast's style.
 *
 * @param {String} label 
 * @param {String} label2
 * ....
 */

function labels() {
  if (arguments.length === 0) return '';
  return arguments.join(',');
}
