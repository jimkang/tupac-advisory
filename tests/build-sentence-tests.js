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

test('Build sentence', function buildSentenceTest(t) {
  t.plan(3);

  var wordSyllableMap = createWordSyllableMap({
    dbLocation: __dirname + '/../data/word-syllable.db'
  });

  function mockGetPartsOfSpeechForMultipleWords(words, done) {
    callNextTick(done, null, words.map(getPartsOfSpeechForWord));
  }

  function getPartsOfSpeechForWord(word) {
    return infoForWords[word].partsOfSpeech;
  }

  function mockGetRandomWords(opts, done) {
    callNextTick(done, null, ['get', 'some']);
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

  createBuildSentence(
    {
      getPartsOfSpeechForMultipleWords: mockGetPartsOfSpeechForMultipleWords,
      countSyllables: countSyllables,
      getRandomWords: mockGetRandomWords
    },
    useBuilder
  );

  function useBuilder(error, buildSentence) {
    t.ok(!error, 'No error when creating builder.');

    buildSentence(
      {
        endWord: 'sleep',
        desiredSyllables: 3
      },
      checkSentence
    );
  }

  function checkSentence(error, sentence) {
    t.ok(!error, 'No error while building sentence.');

    t.equal(sentence, 'get some sleep');

    wordSyllableMap.close();
  }
});
