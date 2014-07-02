
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('segmentio/analytics.js-integration-tester@1.3.0');
var plugin = require('./');

describe('Frontleaf', function(){
  var Frontleaf = plugin.Integration;
  var frontleaf;
  var analytics;
  var options = {
    baseUrl: 'https://demo.frontleaf.com',
    token: 'alHTmBjMiewZnPLycFeBQxaidbBeouXG',
    stream: 'segment.io'
  };

  beforeEach(function(){
    analytics = new Analytics;
    frontleaf = new Frontleaf(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(frontleaf);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
  });

  after(function(){
    frontleaf.reset();
  });

  it('should have the right settings', function(){
    analytics.compare(Frontleaf, integration('Frontleaf')
      .assumesPageview()
      .readyOnLoad()
      .global('_fl')
      .global('_flBaseUrl')
      .option('token', '')
      .option('stream', ''));
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(frontleaf, 'load');
    });

    afterEach(function(){
      frontleaf.reset();
    });

    describe('#initialize', function(){
      it('should create window._fl', function(){
        analytics.assert(!window._fl);
        analytics.initialize();
        analytics.page();
        analytics.assert(window._fl);
      });

      it('should create window._flBaseUrl', function(){
        analytics.assert(!window._flBaseUrl);
        analytics.initialize();
        analytics.page();
        analytics.equal(window._flBaseUrl, options.baseUrl);
      });

      it('should call #load', function(){
        analytics.initialize();
        analytics.page();
        analytics.called(frontleaf.load);
      });
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(frontleaf, done);
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
        analytics.stub(frontleaf, '_push');
      });

      it('should send an id', function(){
        analytics.identify('id');
        analytics.called(frontleaf._push, 'setUser', {
          id: 'id',
          name: undefined,
          data: {}
        });
      });

      it('should send traits', function(){
        analytics.identify('id', { trait: true });
        analytics.called(frontleaf._push, 'setUser', {
          id: 'id',
          name: undefined,
          data: { trait: true }
        });
      });

      it('should send a name', function(){
        analytics.identify('id', { name: 'name' });
        analytics.called(frontleaf._push, 'setUser', {
          id: 'id',
          name: 'name',
          data: {}
        });
      });

      it('should send a username', function(){
        analytics.identify('id', { username: 'username' });
        analytics.called(frontleaf._push, 'setUser', {
          id: 'id',
          name: 'username',
          data: { username: 'username' }
        });
      });
    });

    describe('#group', function(){
      beforeEach(function(){
        analytics.stub(frontleaf, '_push');
      });

      it('should not send without an id', function(){
        analytics.group();
        analytics.didNotCall(frontleaf._push);
      });

      it('should send an id', function(){
        analytics.group('id');
        analytics.called(frontleaf._push, 'setAccount', {
          id: 'id',
          name: undefined,
          data: {}
        });
      });

      it('should send traits', function(){
        analytics.group('id', { trait: true });
        analytics.called(frontleaf._push, 'setAccount', {
          id: 'id',
          name: undefined,
          data: { trait: true }
        });
      });

      it('should send a name', function(){
        analytics.group('id', { name: 'name' });
        analytics.called(frontleaf._push, 'setAccount', {
          id: 'id',
          name: 'name',
          data: {}
        });
      });
    });

    describe('#track', function(){
      beforeEach(function(){
        analytics.stub(frontleaf, '_push');
      });

      it('should send an event', function(){
        analytics.track('login');
        analytics.called(frontleaf._push, 'event', 'login');
      });

      it('should send properties', function(){
        analytics.track('login', { property: true });
        analytics.called(frontleaf._push, 'event', 'login', { property: true });
      });
    });
  });
});
