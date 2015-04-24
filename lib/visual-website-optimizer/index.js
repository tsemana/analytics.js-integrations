
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');
var tick = require('next-tick');
var each = require('each');

/**
 * Expose `VWO` integration.
 */

var VWO = module.exports = integration('Visual Website Optimizer')
  .option('replay', true)
  .option('listen', false);

/**
 * The context for this integration.
 */

var integration = {
  name: 'visual-website-optimizer',
  version: '1.0.0'
};

/**
 * Initialize.
 *
 * http://v2.visualwebsiteoptimizer.com/tools/get_tracking_code.php
 */

VWO.prototype.initialize = function(){
   if (this.options.replay) {
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
 * Completed Purchase.
 *
 * https://vwo.com/knowledge/vwo-revenue-tracking-goal
 */

VWO.prototype.completedOrder = function(track){
  var total = track.total() || track.revenue() || 0;
  enqueue(function(){
    _vis_opt_revenue_conversion(total);
  });
};

/**
 * Replay the experiments the user has seen as traits to all other integrations.
 * Wait for the next tick to replay so that the `analytics` object and all of
 * the integrations are fully initialized.
 */

VWO.prototype.replay = function(){
  var analytics = this.analytics;

  experiments(function(err, traits){
    if (traits) analytics.identify(traits);
  });
};

/**
 * Replay the experiments the user has seen as traits to all other integrations.
 * Wait for the next tick to replay so that the `analytics` object and all of
 * the integrations are fully initialized.
 */

VWO.prototype.sendRoots = function(){
  var analytics = this.analytics;

  rootExperiments(function(err, data){
    each(data, function(expId, varName){
      analytics.track(
        'Experiment Viewed',
        {
          experimentId: expId,
          variationName: varName
        },
        { context: { integration: integration }}
      );
    });
  });
};

/**
 * Get dictionary of experiment keys and variations.
 *
 * http://visualwebsiteoptimizer.com/knowledge/integration-of-vwo-with-kissmetrics/
 *
 * @param {Function} fn
 * @return {Object}
 */

function rootExperiments(fn){
  enqueue(function(){
    var data = {};
    var expIds = window._vwo_exp_ids;
    if (!expIds) return fn();
    each(expIds, function(expId){
      var varName = variation(expId);
      if (varName) data[expId] = varName;
    });
    fn(null, data);
  });
}

/**
 * Get dictionary of experiment keys and variations.
 *
 * http://visualwebsiteoptimizer.com/knowledge/integration-of-vwo-with-kissmetrics/
 *
 * @param {Function} fn
 * @return {Object}
 */

function experiments(fn){
  enqueue(function(){
    var data = {};
    var ids = window._vwo_exp_ids;
    if (!ids) return fn();
    each(ids, function(id){
      var name = variation(id);
      if (name) data['Experiment: ' + id] = name;
    });
    fn(null, data);
  });
}

/**
 * Add a `fn` to the VWO queue, creating one if it doesn't exist.
 *
 * @param {Function} fn
 */

function enqueue(fn){
  window._vis_opt_queue = window._vis_opt_queue || [];
  window._vis_opt_queue.push(fn);
}

/**
 * Get the chosen variation's name from an experiment `id`.
 *
 * http://visualwebsiteoptimizer.com/knowledge/integration-of-vwo-with-kissmetrics/
 *
 * @param {String} id
 * @return {String}
 */

function variation(id){
  var experiments = window._vwo_exp;
  if (!experiments) return null;
  var experiment = experiments[id];
  var variationId = experiment.combination_chosen;
  return variationId ? experiment.comb_n[variationId] : null;
}