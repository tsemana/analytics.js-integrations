
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('segmentio/analytics.js-integration-tester@1.3.0');
var plugin = require('./');

describe('USERcycle', function(){
  var USERcycle = plugin.Integration;
  var usercycle;
  var analytics;
  var options = {
    key: 'x'
  };

  beforeEach(function(){
    analytics = new Analytics;
    usercycle = new USERcycle(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(usercycle);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
  });

  after(function(){
    usercycle.reset();
  });
  
  it('should have the right settings', function(){
    var Test = integration('USERcycle')
      .assumesPageview()
      .readyOnLoad()
      .global('_uc')
      .option('key', '');

    analytics.validate(USERcycle, Test);
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(usercycle, 'load');
    });

    afterEach(function(){
      usercycle.reset();
    });

    describe('#initialize', function(){
      it('should push a key onto window._uc', function(){
        analytics.initialize();
        analytics.page();
        analytics.deepEqual(window._uc[0], ['_key', options.key]);
      });

      it('should call #load', function(){
        analytics.initialize();
        analytics.page();
        analytics.called(usercycle.load);
      });
    });

    describe('#loaded', function(){
      it('should test window._uc.push', function(){
        window._uc = [];
        analytics.assert(!usercycle.loaded());
        window._uc.push = function(){};
        analytics.assert(usercycle.loaded());
      });
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(usercycle, done);
    });
  });

  describe('after loading', function(){
    beforeEach(function(done){
      analytics.once('ready', done);
      analytics.initialize();
      analytics.page();
    });

    describe('#identify', function(){
      beforeEach(function(){
        analytics.stub(window._uc, 'push');
      });

      it('should send an id', function(){
        analytics.identify('id');
        analytics.called(window._uc.push, ['uid', 'id']);
        analytics.called(window._uc.push, ['action', 'came_back', { id: 'id' }]);
      });

      it('should send traits', function(){
        analytics.identify(null, { trait: true });
        analytics.called(window._uc.push, ['action', 'came_back', {
          trait: true
        }]);
      });

      it('should send an id and traits', function(){
        analytics.identify('id', { trait: true });
        analytics.called(window._uc.push, ['uid', 'id']);
        analytics.called(window._uc.push, ['action', 'came_back', {
          trait: true,
          id: 'id'
        }]);
      });
    });

    describe('#track', function(){
      beforeEach(function(){
        analytics.stub(window._uc, 'push');
      });

      it('should send an event', function(){
        analytics.track('event');
        analytics.called(window._uc.push, ['action', 'event', {}]);
      });

      it('should send an event and properties', function(){
        analytics.track('event', { property: true });
        analytics.called(window._uc.push, ['action', 'event', {
          property: true
        }]);
      });

      it('should send revenue as revenue_amount', function(){
        analytics.track('event', { revenue: '$50' });
        analytics.called(window._uc.push, ['action', 'event', {
          revenue_amount: 50
        }]);
      });
    });
  });
});