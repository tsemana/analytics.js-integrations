
describe('Bronto', function(){

  var Bronto = require('integrations/lib/bronto');
  var test = require('integration-tester');
  var analytics = require('analytics');
  var assert = require('assert');
  var sinon = require('sinon');
  var bronto;

  var settings = {
    siteId: '123'
  };

  beforeEach(function(){
    analytics.use(Bronto);
    bronto = new Bronto.Integration(settings);
    bronto.initialize();
  })

  afterEach(function(){
    bronto.reset();
  })

  it('should have the correct settings', function(){
    test(bronto)
      .name('Bronto')
      .readyOnLoad()
      .option('siteId', '')
      .option('host', '');
  })

  describe('#initialize', function(){
    beforeEach(function(){
      bronto.load = sinon.spy();
    })

    it('should call #load', function(){
      test(bronto)
        .initialize()
        .called(bronto.load);
    })
  })

  describe('#loaded', function(){
    it('should test bronto.bta', function(){
      assert(!bronto.loaded());
      bronto.bta = {};
      assert(bronto.loaded());
    })
  })

  describe('#load', function(){
    beforeEach(function(){
      sinon.stub(bronto, 'load');
      bronto.initialize();
      bronto.load.restore();
    })

    it('should change the loaded state', function(done){
      test(bronto).loads(done);
    })
  })

  describe('#track', function(){
    beforeEach(function(){
      bronto.bta = {
        addConversionLegacy: sinon.spy()
      };
      bronto.initialize();
    })

    it('should send event', function(){
      test(bronto)
        .track('some-event')
        .called(bronto.bta.addConversionLegacy)
        .with('t', 'some-event', undefined);
    })

    it('should send $ if revenue is ok', function(){
      test(bronto)
        .track('some-event', { revenue: 50 })
        .called(bronto.bta.addConversionLegacy)
        .with('$', 'some-event', 50);
    })
  })

})
