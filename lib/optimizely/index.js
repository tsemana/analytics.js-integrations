
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');
var push = require('global-queue')('optimizely');
var callback = require('callback');
var tick = require('next-tick');
var bind = require('bind');
var each = require('each');
var isEmpty = require('is-empty');

/**
 * Expose `Optimizely` integration.
 */

var Optimizely = module.exports = integration('Optimizely')
  .option('variations', true)
  .option('listen', false)
  .option('trackNamedPages', true)
  .option('trackCategorizedPages', true);

/**
 * The context for this integration.
 */

var integration = {
  name: 'optimizely',
  version: '1.0.0'
};

/**
 * Initialize.
 *
 * https://www.optimizely.com/docs/api#function-calls
 */

Optimizely.prototype.initialize = function(){
  if (this.options.variations) {
    var self = this;
    tick(function(){
      self.replay();
    });
  }
  if (this.options.listen) {
    var self = this;
    tick(function(){
      self.sendRoots();
    });
  }
  this.ready();
};

/**
 * Track.
 *
 * https://www.optimizely.com/docs/api#track-event
 *
 * @param {Track} track
 */

Optimizely.prototype.track = function(track){
  var props = track.properties();
  if (props.revenue) props.revenue *= 100;
  push('trackEvent', track.event(), props);
};

/**
 * Page.
 *
 * https://www.optimizely.com/docs/api#track-event
 *
 * @param {Page} page
 */

Optimizely.prototype.page = function(page){
  var category = page.category();
  var name = page.fullName();
  var opts = this.options;

  // categorized pages
  if (category && opts.trackCategorizedPages) {
    this.track(page.track(category));
  }

  // named pages
  if (name && opts.trackNamedPages) {
    this.track(page.track(name));
  }
};

/**
 * Send experiment data as a track event to other integrations
 * This only sends active experiment data
 *
 * https://www.optimizely.com/docs/api#data-object
 */

Optimizely.prototype.sendRoots = function(){
  if (!window.optimizely) return; // in case the snippet isnt on the page

  var data = window.optimizely.data;
  var activeExperiments = data.state.activeExperiments; // list of experiment Id's.
  var allExperiments = data.experiments;

  if (!data || !data.state || !allExperiments) return;

  var variationNamesMap = data.state.variationNamesMap;
  var variationIdsMap = data.state.variationIdsMap;

  // for each active experiment send a track event
  var self = this;
  activeExperiments.forEach(function(experimentId){

    var experimentObj = allExperiments[experimentId];
    if (experimentObj){
      var experimentName = experimentObj.name;
      var variationName = variationNamesMap[experimentId];
      var variationId = variationIdsMap[experimentId];

      self.analytics.track(
        'Experiment Viewed',
        { experimentId: experimentId,
          experimentName: experimentName,
          variationId: variationId,
          variationName: variationName },
        { context: { integration: integration }}
      );
    }
  });
};

/**
 * Replay experiment data as traits to other enabled providers.
 *
 * https://www.optimizely.com/docs/api#data-object
 */

Optimizely.prototype.replay = function(){
  if (!window.optimizely) return; // in case the snippet isnt on the page

  var data = window.optimizely.data;
  if (!data || !data.experiments || !data.state) return;

  var experiments = data.experiments;
  var map = data.state.variationNamesMap;
  var traits = {};

  each(map, function(experimentId, variation){
    var experiment = experiments[experimentId].name;
    traits['Experiment: ' + experiment] = variation;
  });

  this.analytics.identify(traits);
};
