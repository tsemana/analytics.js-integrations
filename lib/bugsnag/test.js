
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('segmentio/analytics.js-integration-tester@1.3.0');
var plugin = require('./');

describe('Bugsnag', function(){
  var Bugsnag = plugin.Integration;
  var bugsnag;
  var analytics;
  var options = {
    apiKey: 'x'
  };

  beforeEach(function(){
    analytics = new Analytics;
    bugsnag = new Bugsnag(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(bugsnag);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
  });

  after(function(){
    bugsnag.reset();
  });

  it('should have the right settings', function(){
    analytics.validate(Bugsnag, integration('Bugsnag')
      .readyOnLoad()
      .global('Bugsnag')
      .option('apiKey', ''));
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(bugsnag, 'load');
    });

    afterEach(function(){
      bugsnag.reset();
    });

    describe('#initialize', function(){
      it('should call #load', function(){
        analytics.initialize();
        analytics.called(bugsnag.load);
      });
    });
  });

  describe('loading', function(){
    it('should load and set an onerror handler', function(done){
      var onerror = window.onerror;
      analytics.load(bugsnag, function(err){
        if (err) return done(err);
        analytics.notEqual(window.onerror, onerror);
        analytics.equal('function', typeof window.onerror);
        done();
      });
    });
  });

  describe('after loading', function(){
    beforeEach(function(done){
      analytics.once('ready', done);
      analytics.initialize();
      analytics.page();
    });

    describe('#identify', function(){
      it('should set metadata', function(){
        analytics.identify('id', { trait: true });
        analytics.deepEqual(window.Bugsnag.metaData, {
          id: 'id',
          trait: true
        });
      });
    });
  });
});
