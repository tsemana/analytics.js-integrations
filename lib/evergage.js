
var alias = require('alias');
var each = require('each');
var integration = require('integration');
var load = require('load-script');
var push = require('global-queue')('_aaq');


/**
 * Expose plugin.
 */

module.exports = exports = function (analytics) {
  analytics.addIntegration(Evergage);
};


/**
 * Expose `Evergage` integration.integration.
 */

var Evergage = exports.Integration = integration('Evergage')
  .assumesPageview()
  .readyOnInitialize()
  .global('_aaq')
  .option('account', '')
  .option('dataset', '');


/**
 * Initialize.
 *
 * @param {Object} page
 */

Evergage.prototype.initialize = function (page) {
  var account = this.options.account;
  var dataset = this.options.dataset;

  window._aaq = window._aaq || [];
  push('setEvergageAccount', account);
  push('setDataset', dataset);
  push('setUseSiteConfig', true);

  this.load();
};


/**
 * Loaded?
 *
 * @return {Boolean}
 */

Evergage.prototype.loaded = function () {
  return !! (window._aaq && window._aaq.push !== Array.prototype.push);
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Evergage.prototype.load = function (callback) {
  var account = this.options.account;
  var dataset = this.options.dataset;
  var url = '//cdn.evergage.com/beacon/' + account + '/' + dataset + '/scripts/evergage.min.js';
  load(url, callback);
};


/**
 * Page.
 *
 * @param {Page} page
 */

Evergage.prototype.page = function (page) {
  var props = page.properties();
  var name = page.name();

  if (name) push('namePage', name);

  each(props, function(key, value) {
    push('setCustomField', key, value, 'page');
  });

  window.Evergage.init(true);
};

/**
 * Trait aliases.
 */

var traitAliases = {
  name: 'userName',
  email: 'userEmail'
};


/**
 * Identify.
 *
 * @param {Identify} identify
 */

Evergage.prototype.identify = function (identify) {
  var id = identify.userId();

  if (!id) return;

  push('setUser', id);
  traits = identify.traits();
  traits.userEmail = identify.email();
  traits.userName = identify.name();

  each(traits, function (key, value) {
    push('setUserField', key, value, 'page');
  });
};


/**
 * Group.
 *
 * @param {Group} group
 */

Evergage.prototype.group = function (group) {
  var props = group.traits();
  var id = group.groupId();

  if (!id) return;

  push('setCompany', id);
  each(props, function(key, value) {
    push('setAccountField', key, value, 'page');
  });
};


/**
 * Track.
 *
 * @param {Track} track
 */

Evergage.prototype.track = function (track) {
  var properties = track.properties();
  var event = track.event();
  push('trackAction', event, properties);
};
