
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('segmentio/analytics.js-integration-tester@1.3.0');
var plugin = require('./');

describe('Perfect Audience', function(){
  var PerfectAudience = plugin.Integration;
  var pa;
  var analytics;
  var options = {
    siteId: '4ff6ade4361ed500020000a5'
  };

  beforeEach(function(){
    analytics = new Analytics;
    pa = new PerfectAudience(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(pa);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
  });

  after(function(){
    pa.reset();
  });

  it('should have the right settings', function(){
    analytics.validate(PerfectAudience, integration('Perfect Audience')
      .assumesPageview()
      .readyOnLoad()
      .global('_pa')
      .option('siteId', ''));
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(pa, 'load');
    });

    afterEach(function(){
      pa.reset();
    });

    describe('#initialize', function(){
      it('should create the window._pa object', function(){
        analytics.assert(!window._pa);
        analytics.initialize();
        analytics.page();
        analytics.assert(window._pa);
      });

      it('should call #load', function(){
        analytics.initialize();
        analytics.page();
        analytics.called(pa.load);
      });
    });

    describe('#loaded', function(){
      it('should test window._pa.track', function(){
        window._pa = [];
        analytics.assert(!pa.loaded());
        window._pa.track = function(){};
        analytics.assert(pa.loaded());
      });
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(pa, done);
    });
  });

  describe('after loading', function(){
    beforeEach(function(done){
      analytics.once('ready', done);
      analytics.initialize();
      analytics.page();
    });

    describe('#track', function(){
      beforeEach(function(){
        analytics.stub(window._pa, 'track');
      });

      it('should send an event', function(){
        analytics.track('event');
        analytics.called(window._pa.track, 'event', {});
      });

      it('should send an event and properties', function(){
        analytics.track('event', { property: true });
        analytics.called(window._pa.track, 'event', { property: true });
      });
    });
  });
});