
describe('AdWords', function(){

  var AdWords = require('integrations/lib/adwords');
  var test = require('integration-tester');
  var analytics = require('analytics');
  var assert = require('assert');
  var sinon = require('sinon');

  var settings = {
    events: {
      signup: 0,
      login: 1,
      play: 2
    }
  };

  beforeEach(function(){
    analytics.use(AdWords);
    adwords = new AdWords.Integration(settings);
  })

  it('should have the correct settings', function(){
    test(adwords)
      .name('AdWords')
      .readyOnInitialize()
      .option('events', {});
  })

  describe('#track', function(){
    before(function(){
      sinon.spy(AdWords, 'load');
    })

    afterEach(function(){
      AdWords.load.reset();
    })

    it('should not send if event is not defined', function(){
      test(adwords).track('toString', {});
      assert(!AdWords.load.called);
    })

    it('should send if event is found', function(){
      test(adwords)
        .track('signup', {})
        .called(AdWords.load)
        .with({ value: 0, label: 'signup', script: 0}, { id: 0 });
    })

    it('should send revenue', function(){
      test(adwords)
        .track('login', { revenue: '$50' })
        .called(AdWords.load)
        .with({ value: 50, label: 'login', script: 0 }, { id: 1 });
    })

    it('should send correctly', function(){
      test(adwords).track('play', { revenue: 90 });
      var img = AdWords.load.returnValues[0];
      assert(img);
      assert('http://www.googleadservices.com/pagead/conversion/2?value=90&label=play&script=0' == img.src)
    })
  })
})
