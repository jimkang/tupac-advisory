var test = require('tape');
var createBuildSentence = require('../build-sentence');
var callNextTick = require('call-next-tick');
var syllableCounter = require('../syllable-counter')();

var infoForWords = {
  sleep: {
    partsOfSpeech: ['noun']
  },
  get: {
    partsOfSpeech: ['verb']
  },
  some: {
    partsOfSpeech: ['adjective']
  }
}

var headsForPhrases = {
  sleep: ['some', 'little'],
  'some sleep': ['get', 'had']
};

test('Build sentence', function buildSentenceTest(t) {
  t.plan(2);

  function mockGetPartsOfSpeechForMultipleWords(words, done) {
    callNextTick(done, null, words.map(getPartsOfSpeechForWord));
  }

  function getPartsOfSpeechForWord(word) {
    return infoForWords[word].partsOfSpeech;
  }

  function mockFillPhraseHead(opts, done) {
    callNextTick(done, null, headsForPhrases[opts.phrase]);
  }

  function mockPickFromArray(array) {
    return array[0];
  }

  var buildSentence = createBuildSentence({
    getPartsOfSpeechForMultipleWords: mockGetPartsOfSpeechForMultipleWords,
    countSyllables: syllableCounter.countSyllables,
    fillPhraseHead: mockFillPhraseHead,
    pickFromArray: mockPickFromArray
  });

  buildSentence(
    {
      endWord: 'sleep',
      desiredSyllables: 3
    },
    checkSentence
  );

  function checkSentence(error, sentence) {
    t.ok(!error, 'No error while building sentence.');

    t.equal(sentence, 'get some sleep');

    syllableCounter.close();
  }
});
