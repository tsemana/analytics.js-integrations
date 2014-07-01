
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('segmentio/analytics.js-integration-tester@1.3.0');
var plugin = require('./');

describe('Alexa', function(){
  var Alexa = plugin.Integration;
  var alexa;
  var analytics;
  var options = {
    account: 'h5Gaj1a4ZP000h',
    domain: 'mydomain.com',
    dynamic: true
  };

  beforeEach(function(){
    analytics = new Analytics;
    alexa = new Alexa(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(alexa);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
    alexa.reset();
  });

  it('should have the right settings', function(){
    analytics.validate(Alexa, integration('Alexa')
      .assumesPageview()
      .readyOnLoad()
      .global('_atrk_opts')
      .option('account', null)
      .option('domain', '')
      .option('dynamic', true));
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(alexa, 'load');
    });

    describe('#initialize', function(){
      it('should create window._atrk_opts', function(){
        analytics.initialize();
        analytics.page();
        analytics.deepEqual(window._atrk_opts, {
          atrk_acct: options.account,
          domain: options.domain,
          dynamic: options.dynamic
        });
      });

      it('should call #load', function(){
        analytics.initialize();
        analytics.page();
        analytics.called(alexa.load);
      });
    });

    describe('#loaded', function(){
      it('should test window.atrk', function(){
        analytics.assert(!alexa.loaded());
        window.atrk = function(){};
        analytics.assert(alexa.loaded());
        window.atrk = null;
      });
    });
  });

  describe('loading', function(){
    describe('#load', function(){
      it('should change loaded state', function(done){
        analytics.assert(!alexa.loaded());
        alexa.load(function(err){
          if (err) return done(err);
          analytics.assert(alexa.loaded());
          done();
        });
      });
    });
  });
});