
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('analytics.js-integration-tester');
var plugin = require('./');
var sandbox = require('clear-env');

describe('SupportHero', function(){
  var SupportHero = plugin;
  var supportHero;
  var analytics;
  var options = {
    token: 'Y2xpZW50SWQ9MjYmaG9zdE5hbWU9dGVzdC5zdXBwb3J0aGVyby5pbw=='
  };

  beforeEach(function(){
    analytics = new Analytics;
    supportHero = new SupportHero(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(supportHero);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
    supportHero.reset();
    sandbox();
  });

  it('should have the right settings', function(){
    analytics.compare(SupportHero, integration('SupportHero')
      .assumesPageview()
      .global('supportHeroWidget')
      .option('token', '')
      .option('track', false));
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(supportHero, 'load');
    });

    afterEach(function(){
      supportHero.reset();
    });

    describe('#initialize', function(){
      it('should set up the window.supportHeroWidget identify variable', function(){
        analytics.initialize();
        analytics.page();
        analytics.assert(window.supportHeroWidget.identify);
      });

      it('should call #load', function(){
        analytics.initialize();
        analytics.page();
        analytics.called(supportHero.load);
      });
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(supportHero, done);
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
		analytics.stub(window.supportHeroWidget, 'identify');
      });

      it('should send an id', function(){
        analytics.identify('id');
        analytics.called(window.supportHeroWidget.identify, 'id', { id: 'id' });
      });

      it('should send traits', function(){
        analytics.identify({ trait: true });
        analytics.called(window.supportHeroWidget.identify, { trait: true });
      });

      it('should send an id and traits', function(){
        analytics.identify('id', { trait: true });
        analytics.called(window.supportHeroWidget.identify, 'id', { trait: true, id: 'id' });
      });
    });

  });
});