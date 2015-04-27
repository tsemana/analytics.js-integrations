
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('analytics.js-integration-tester');
var plugin = require('./');
var sandbox = require('clear-env');

describe('Gauges', function(){
  var Gauges = plugin;
  var gauges;
  var analytics;
  var options = {
    siteId: 'x'
  };

  beforeEach(function(){
    analytics = new Analytics;
    gauges = new Gauges(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(gauges);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
    gauges.reset();
    sandbox();
  });

  it('should have the right settings', function(){
    analytics.compare(Gauges, integration('Gauges')
      .assumesPageview()
      .global('_gauges')
      .option('siteId', ''));
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(gauges, 'load');
    });

    describe('#initialize', function(){
      it('should create the gauges queue', function(){
        analytics.assert(!window._gauges);
        analytics.initialize();
        analytics.page();
        analytics.assert(window._gauges instanceof Array);
      });
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(gauges, done);
    });
  });

  describe('after loading', function(){
    beforeEach(function(done){
      analytics.once('ready', done);
      analytics.initialize();
      analytics.page();
    });

    describe('#page', function(){
      beforeEach(function(){
        analytics.stub(window._gauges, 'push');
      });

      it('should send a page view', function(){
        analytics.page();
        analytics.called(window._gauges.push);
      });
    });
  });
});
