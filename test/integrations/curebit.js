
describe('Curebit', function(){

  var Curebit = require('integrations/lib/curebit');
  var test = require('integration-tester');
  var analytics = require('analytics');
  var assert = require('assert');
  var equals = require('equals');
  var sinon = require('sinon');
  var timeouts = require('clear-timeouts');
  var intervals = require('clear-intervals');

  var curebit;
  var settings = {
    siteId: 'curebit-87ab995d-736b-45ba-ac41-71f4dbb5c74a',
    server: ''
  };

  beforeEach(function(){
    analytics.use(Curebit);
    curebit = new Curebit.Integration(settings);
  })

  afterEach(function(){
    timeouts();
    intervals();
    curebit.reset();
  })

  it('should have the correct settings', function(){
    test(curebit)
      .name('Curebit')
      .readyOnInitialize()
      .global('_curebitq')
      .global('curebit')
      .option('siteId', '')
      .option('server', '');
  })

  describe('#initialize', function(){
    beforeEach(function(){
      curebit.load = sinon.spy();
    })

    it('should push settings', function(){
      test(curebit)
        .initialize()
        .changed(window._curebitq[0])
        .to(['init', {
          site_id: settings.siteId,
          server: ''
        }]);
    })

    it('should call #load', function(){
      test(curebit)
        .initialize()
        .called(curebit.load);
    })
  })

  describe('#loaded', function(){
    it('should test window.curebit', function(){
      assert(!curebit.loaded());
      window.curebit = {};
      assert(curebit.loaded());
    })
  })

  describe('#load', function(){
    beforeEach(function(){
      sinon.stub(curebit, 'load');
      curebit.initialize();
      curebit.load.restore();
    })

    it('should change the loaded state', function(done){
      if (curebit.loaded()) return done(new Error('curebit already loaded'));
      curebit.load(function(err){
        if (err) return done(err);
        assert(curebit.loaded());
        done();
      })
    })
  })
})
