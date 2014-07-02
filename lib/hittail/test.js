
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('segmentio/analytics.js-integration-tester@1.3.0');
var plugin = require('./');

describe('HitTail', function(){
  var HitTail = plugin.Integration;
  var hittail;
  var analytics;
  var options = {
    siteId: 'x'
  };

  beforeEach(function(){
    analytics = new Analytics;
    hittail = new HitTail(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(hittail);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
  });

  after(function(){
    hittail.reset();
  });
  
  it('should have the right settings', function(){
    var Test = integration('HitTail')
      .assumesPageview()
      .readyOnLoad()
      .global('htk')
      .option('siteId', '');

    analytics.validate(HitTail, Test);
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(hittail, 'load');
    });

    afterEach(function(){
      hittail.reset();
    });

    describe('#initialize', function(){
      it('should call #load', function(){
        analytics.initialize();
        analytics.page();
        analytics.called(hittail.load);
      });
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(hittail, done);
    });
  });
});