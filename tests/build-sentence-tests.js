var test = require('tape');
var createBuildSentence = require('../build-sentence');
var callNextTick = require('call-next-tick');
var createWordSyllableMap = require('word-syllable-map').createWordSyllableMap;

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

  var wordSyllableMap = createWordSyllableMap({
    dbLocation: __dirname + '/../data/word-syllable.db'
  });

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

  function countSyllables(word, done) {
    wordSyllableMap.syllablesForWord(word, getCount);
    function getCount(error, syllables) {
      if (error) {
        done(error);
      }
      else {
        console.log(syllables);
        done(error, syllables.length);
      }
    }
  }

  var buildSentence = createBuildSentence({
    getPartsOfSpeechForMultipleWords: mockGetPartsOfSpeechForMultipleWords,
    countSyllables: countSyllables,
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

    wordSyllableMap.close();
  }
});
