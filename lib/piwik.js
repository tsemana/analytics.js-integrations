var integration = require('integration'),
    load = require('load-script'),
    push = require('global-queue')('_paq');

/**
 * Expose plugin
 */
module.exports = exports = function (analytics) {
  analytics.addIntegration(Piwik);
};

/**
 * Expose `Piwik` integration.
 */

var Piwik = exports.Integration = integration('Piwik')
  .global('_paq')
  .option('url', null)
  .option('id', '')
  .assumesPageview()
  .readyOnLoad();

/**
 * Initialize.
 *
 * http://piwik.org/docs/javascript-tracking/#toc-asynchronous-tracking
 */

Piwik.prototype.initialize = function () {

  window._paq = window._paq || [];
  push('setSiteId', this.options.id);

  push('setTrackerUrl', this.options.url + '/piwik.php'); 
  push('trackPageView'); 
  push('enableLinkTracking');

  this.load();
};

/**
 * Load the Piwik Analytics library.
 */

Piwik.prototype.load = function (callback) {
  load(this.options.url + "/piwik.js", callback);
};

/**
 * Check if Piwik is loaded
 */

Piwik.prototype.loaded = function () {
  return !! (window._paq && window._paq.push !== Array.prototype.push);
};

/**
 * Page
 *
 * @param {Page} page
 */

Piwik.prototype.page = function (page) {
  push('trackPageView');
};