
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('segmentio/analytics.js-integration-tester@1.3.0');
var plugin = require('./');

describe('MouseStats', function(){
  var MouseStats = plugin.Integration;
  var mousestats;
  var analytics;
  var options = {
    accountNumber: '5532375730335616295'
  };

  beforeEach(function(){
    analytics = new Analytics;
    mousestats = new MouseStats(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(mousestats);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
  });

  after(function(){
    mousestats.reset();
  });

  it('should have the right settings', function(){
    var Test = integration('MouseStats')
      .assumesPageview()
      .readyOnLoad()
      .global('msaa')
      .global('MouseStatsVisitorPlaybacks')
      .option('accountNumber', '');

    analytics.validate(MouseStats, Test);
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(mousestats, 'load');
    });

    afterEach(function(){
      mousestats.reset();
    });

    describe('#initialize', function(){
      it('should call #load', function(){
        analytics.initialize();
        analytics.page();
        analytics.called(mousestats.load);
      });
    });

    describe('#loaded', function(){
      it('should test window.MouseStatsVisitorPlaybacks', function(){
        analytics.assert(!mousestats.loaded());
        window.MouseStatsVisitorPlaybacks = document.createElement('div');
        analytics.assert(!mousestats.loaded());
        window.MouseStatsVisitorPlaybacks = [];
        analytics.assert(mousestats.loaded());
      });
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(mousestats, done);
    });
  });
});