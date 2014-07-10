
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('analytics.js-integration-tester');
var tick = require('next-tick');
var plugin = require('./');

describe('Visual Website Optimizer', function(){
  var VWO = plugin.Integration;
  var vwo;
  var analytics;
  var options = {};

  beforeEach(function(){
    analytics = new Analytics;
    vwo = new VWO(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(vwo);

    // set up fake VWO data to simulate the replay
    window._vwo_exp_ids = [1];
    window._vwo_exp = { 1: { comb_n: { 1: 'Variation' }, combination_chosen: 1 } };
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
  });

  after(function(){
    vwo.reset();
  });

  it('should have the right settings', function(){
    analytics.compare(VWO, integration('Visual Website Optimizer')
      .option('replay', true));
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(vwo, 'replay');
    });

    afterEach(function(){
      vwo.reset();
    });

    describe('#initialize', function(){
      it('should call replay', function(){
        analytics.initialize();
        analytics.page();
        analytics.called(vwo.replay);
      });
    });

    describe('#replay', function(){
      it('should replay variation data');
    });
  });
});