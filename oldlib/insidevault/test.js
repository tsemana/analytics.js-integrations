
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('analytics.js-integration-tester');
var plugin = require('./');
var sandbox = require('clear-env');

describe('InsideVault', function(){
  var InsideVault = plugin;
  var iv;
  var analytics;
  var options = {
    clientId: 'test17',
    domain: 'testdomain.com',
    events: {
      'sign up': 'event1',
      'completed order': 'event2'
    }
  };

  beforeEach(function(){
    analytics = new Analytics;
    iv = new InsideVault(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(iv);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
    iv.reset();
    sandbox();
  });

  it('should have the right settings', function(){
    analytics.compare(InsideVault, integration('InsideVault')
      .global('_iva')
      .option('clientId', '')
      .option('domain', ''));
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(iv, 'load');
    });

    describe('#initialize', function(){
      it('should create window._iva and call load', function(){
        analytics.initialize();
        analytics.page();
        analytics.assert(window._iva instanceof Array);
        analytics.called(iv.load);
      });

      it('should pass in clientId', function(){
        window._iva = [];
        analytics.stub(window._iva, 'push');
        analytics.initialize();
        analytics.page();
        analytics.called(window._iva.push, ['setClientId', iv.options.clientId]);
      });

      it('should pass in userId', function(){
        window._iva = [];
        analytics.stub(window._iva, 'push');
        analytics.identify('user-id');
        analytics.initialize();
        analytics.page();
        analytics.called(window._iva.push, ['setUserId', 'user-id']);
      });

      it('should pass in domain if present', function(){
        window._iva = [];
        analytics.stub(window._iva, 'push');
        analytics.initialize();
        analytics.page();
        analytics.called(window._iva.push, ['setDomain', iv.options.domain]);
      });

      it('should not pass in domain if blank', function(){
        window._iva = [];
        iv.options.domain = null;
        analytics.stub(window._iva, 'push');
        analytics.initialize();
        analytics.page();
        analytics.didNotCall(window._iva.push, ['setDomain', iv.options.domain]);
      });
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(iv, done);
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
        analytics.stub(window._iva, 'push');
      });

      it('should send "click" event', function(){
        analytics.page();
        analytics.called(window._iva.push, ['trackEvent', 'click']);
      });
    });

    describe('#track', function(){
      beforeEach(function(){
        analytics.stub(window._iva, 'push');
      });

      it('should track an event', function(){
        analytics.track('sign up');
        analytics.called(window._iva.push, ['trackEvent', 'event1', 0, '']);
      });

      it('should track an event with revenue', function(){
        analytics.track('completed order', { revenue: '0.75' });
        analytics.called(window._iva.push, ['trackEvent', 'event2', 0.75, '']);
      });

      it('should track an event with value', function(){
        analytics.track('completed order', { value: 1.23 });
        analytics.called(window._iva.push, ['trackEvent', 'event2', 1.23, '']);
      });

      it('should track an event with revenue and order id', function(){
        analytics.track('completed order', { revenue: '89.7', orderId: 'abc123' });
        analytics.called(window._iva.push, ['trackEvent', 'event2', 89.7, 'abc123']);
      });

      it('should track an event with userId and orderId, using orderId', function(){
        analytics.identify('id');
        analytics.track('completed order', { orderId: 'abc123' });
        analytics.called(window._iva.push, ['trackEvent', 'event2', 0, 'abc123']);
      });

      it('should fall back to userId if no orderId', function(){
        analytics.identify('id');
        analytics.track('sign up');
        analytics.called(window._iva.push, ['trackEvent', 'event1', 0, 'id']);
      });

      it('should track multiple events', function(){
        iv.options.events = [
          { key: 'completed order', value: 'event1' },
          { key: 'completed order', value: 'event2' }
        ];

        window._iva = [];
        analytics.track('completed order', { orderId: 'id', revenue: 9.99 });
        analytics.assert.deepEqual(window._iva, [
          ['trackEvent', 'event1', 9.99, 'id'],
          ['trackEvent', 'event2', 9.99, 'id']
        ]);
      });

      it('should not track a "sale" event', function(){
        analytics.track('sale');
        analytics.didNotCall(window._iva.push);
      });

      it('should not track unmapped event', function(){
        analytics.track('event');
        analytics.didNotCall(window._iva.push);
      });
    });
  });
});
