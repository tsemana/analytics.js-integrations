
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('analytics.js-integration-tester');
var plugin = require('./');
var sandbox = require('clear-env');

describe('Get Satisfaction', function(){
  var GetSatisfaction = plugin;
  var gs;
  var analytics;
  var options = {
    widgetId: 5005
  };

  beforeEach(function(){
    analytics = new Analytics;
    gs = new GetSatisfaction(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(gs);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
    gs.reset();
    sandbox();
  });

  it('should have the right settings', function(){
    analytics.compare(GetSatisfaction, integration('Get Satisfaction')
      .assumesPageview()
      .global('GSFN')
      .option('widgetId', ''));
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(gs, 'load');
    });

    describe('#initialize', function(){
      it('should add the get satisfaction widget to the dom', function(){
        analytics.initialize();
        analytics.page();
        analytics.assert(document.getElementById('getsat-widget-' + options.widgetId));
      });
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(gs, done);
    });
  });
});
