
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('segmentio/analytics.js-integration-tester@1.3.0');
var plugin = require('./');

describe('Sentry', function(){
  var Sentry = plugin.Integration;
  var sentry;
  var analytics;
  var options = {
    config: 'x'
  };

  beforeEach(function(){
    analytics = new Analytics;
    sentry = new Sentry(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(sentry);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
  });

  after(function(){
    sentry.reset();
  });
  
  it('should have the right settings', function(){
    var Test = integration('Sentry')
      .readyOnLoad()
      .global('Raven')
      .option('config', '');

    analytics.validate(Sentry, Test);
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(sentry, 'load');
    });

    afterEach(function(){
      sentry.reset();
    });

    describe('#initialize', function(){
      it('should call #load', function(){
        analytics.initialize();
        analytics.page();
        analytics.called(sentry.load);
      });
    });

    describe('#loaded', function(){
      it('should test window.Raven', function(){
        analytics.assert(!sentry.loaded());
        window.Raven = document.createElement('div');
        analytics.assert(!sentry.loaded());
        window.Raven = {};
        analytics.assert(sentry.loaded());
      });
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(sentry, done);
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
        analytics.stub(window.Raven, 'setUser');
      });

      it('should send an id', function(){
        analytics.identify('id');
        analytics.called(window.Raven.setUser, { id: 'id' });
      });

      it('should send traits', function(){
        analytics.identify(null, { trait: true });
        analytics.called(window.Raven.setUser, { trait: true });
      });

      it('should send an id and traits', function(){
        analytics.identify('id', { trait: true });
        analytics.called(window.Raven.setUser, { id: 'id', trait: true });
      });
    });
  });
});