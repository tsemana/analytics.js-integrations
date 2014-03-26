
describe('Rollbar', function() {

  var analytics = require('analytics');
  var assert = require('assert');
  var equal = require('equals');
  var noop = function(){};
  var Rollbar = require('integrations/lib/rollbar');
  var sinon = require('sinon');
  var test = require('integration-tester');

  var rollbar;
  var settings = {
    accessToken: 'e1674422cbe9419987eb2e7f98adc5ec',
    environment: 'testenvironment',
  };

  beforeEach(function() {
    analytics.use(Rollbar);
    rollbar = new Rollbar.Integration(settings);
  });

  afterEach(function() {
    rollbar.reset();
  });

  it('should have the right settings', function() {
    test(rollbar)
      .name('Rollbar')
      .readyOnInitialize()
      .global('Rollbar')
      .option('accessToken', '')
      .option('identify', true);
  });

  describe('#initialize', function() {
    beforeEach(function () {
      sinon.stub(rollbar, 'load');
    });

    it('should call #load', function () {
      rollbar.initialize();
      assert(rollbar.load.called);
    });
  });

  describe('#loaded', function() {
    it('should be loaded after initialize', function() {
      assert(!rollbar.loaded());
      rollbar.initialize();
      assert(rollbar.loaded());
    });
  });

  describe('#load', function() {
    beforeEach(function() {
      rollbar.reset();
    });

    it('should set an onerror handler', function (done) {
      var handler = window.onerror;
      rollbar.load(function(err) {
        if (err) return done(err);
        assert(handler !== window.onerror);
        assert('function' === typeof window.onerror);
        done();
      });
    });

    it('should add global Rollbar notifier', function(done) {
      rollbar.load(function(err) {
        assert(window.Rollbar);
        assert(window.Rollbar.debug);
        assert(window.Rollbar.info);
        assert(window.Rollbar.warning);
        assert(window.Rollbar.error);
        assert(window.Rollbar.critical);
        assert(window.Rollbar.configure);
        assert(window.Rollbar.scope);
        done();
      });
    });
  });

  describe('#identify', function() {
    var configure;
    beforeEach(function() {
      rollbar.initialize();
      configure = sinon.stub(window.Rollbar, 'configure');
    });

    it('should add an id to metadata', function() {
      test(rollbar).identify('user-id');
      var firstCall = window.Rollbar.configure.firstCall;
      args = firstCall.args;
      assert(args[0].payload.person.id === 'user-id');
    });

    it('should add traits to person data', function() {
      test(rollbar).identify(null, {trait: true});
      var firstCall = window.Rollbar.configure.firstCall;
      args = firstCall.args;
      assert(args[0].payload.person.id === null);
      assert(args[0].payload.person.trait === true);
    });

    it('should add an id and traits to person data', function() {
      test(rollbar).identify('user-id', {trait: true});
      var firstCall = window.Rollbar.configure.firstCall;
      args = firstCall.args;
      assert(args[0].payload.person.id === 'user-id');
      assert(args[0].payload.person.trait === true);
    });

    it('should not add to person data when identify option is false', function() {
      rollbar.options.identify = false;
      test(rollbar).identify('user-id');
      assert(!window.Rollbar.configure.called);
    });
  });
});

