var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('analytics.js-integration-tester');
var plugin = require('./');
var sandbox = require('clear-env');

describe('Nudgespot', function(){
  var Nudgespot = plugin;
  var nudgespot;
  var analytics;
  var options = {
    apiKey: 'test'
  };

  beforeEach(function(){
    analytics = new Analytics;
    nudgespot = new Nudgespot(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(nudgespot);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
    nudgespot.reset();
    sandbox();
  });

  it('should have the right settings', function(){
    analytics.compare(Nudgespot, integration('Nudgespot')
      .assumesPageview()
      .global('nudgespot')
      .option('apiKey',  ''))
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(nudgespot, 'load');
    });

    afterEach(function(){
      nudgespot.reset();
    });

    describe('#initialize', function(){
      it('should create the window.nudgespot object', function(){
        analytics.assert(!window.nudgespot);
        analytics.initialize();
        analytics.page();
        analytics.assert(window.nudgespot);
      });

      it('should call #load', function(){
        analytics.initialize();
        analytics.page();
        analytics.called(nudgespot.load);
      });
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(nudgespot, done);
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
        analytics.stub(window.nudgespot, 'identify');
      });

      it('should send an id', function(){
        analytics.identify('id');
        analytics.called(window.nudgespot.identify, 'id',{ id: 'id' });
      });

      it('should not send only traits', function(){
        analytics.identify({ trait: true });
        analytics.didNotCall(window.nudgespot.identify);
      });

      it('should send an id and traits', function(){
        analytics.identify('id', { trait: true });
        analytics.called(window.nudgespot.identify, 'id',{ id: 'id', trait: true });
      });

      it('should alias created to created_at', function(){
        var date = new Date();
        analytics.identify('id', { created: date });
        analytics.called(window.nudgespot.identify, 'id',{
          id: 'id',
          created_at: date
        });
      });
    });

    describe('#track', function(){
      beforeEach(function(){
        analytics.stub(window.nudgespot, 'track');
      });

      it('should send an event', function(){
        analytics.track('event');
        analytics.called(window.nudgespot.track, 'event');
      });

      it('should send an event and properties', function(){
        analytics.track('event', { property: true });
        analytics.called(window.nudgespot.track, 'event', { property: true });
      });
    });
  });
});
