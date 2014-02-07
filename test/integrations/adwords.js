
describe('AdWords', function(){

  var AdWords = require('integrations/lib/adwords');
  var test = require('integration-tester');
  var analytics = require('analytics');
  var assert = require('assert');
  var sinon = require('sinon');

  var settings = {
    conversionId: 983265867,
    events: {
      signup: '7c8fc3c1',
      login: '49aa6e21',
      play: 'b91fc77f'
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
        .with({ value: 0, label: '7c8fc3c1', script: 0}, { id: 983265867 });
    })

    it('should send revenue', function(){
      test(adwords)
        .track('login', { revenue: '$50' })
        .called(AdWords.load)
        .with({ value: 50, label: '49aa6e21', script: 0 }, { id: 983265867 });
    })

    it('should send correctly', function(){
      test(adwords).track('play', { revenue: 90 });
      var img = AdWords.load.returnValues[0];
      assert(img);
      assert('http://www.googleadservices.com/pagead/conversion/983265867?value=90&label=b91fc77f&script=0' == img.src)
    })
  })
})
