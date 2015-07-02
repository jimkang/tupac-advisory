var test = require('tape');
var createBuildSentence = require('../build-sentence');
var callNextTick = require('call-next-tick');

var infoForWords = {
  sleep: {
    partsOfSpeech: ['noun'],
    syllableCount: 1
  },
  get: {
    partsOfSpeech: ['verb'],
    syllableCount: 1
  },
  some: {
    partsOfSpeech: ['adjective'],
    syllableCount: 1
  }
}

test('Build sentence', function buildSentenceTest(t) {
  t.plan(3);

  function mockGetPartsOfSpeechForMultipleWords(words, done) {
    callNextTick(done, null, words.map(getPartsOfSpeechForWord));
  }

  function getPartsOfSpeechForWord(word) {
    return infoForWords[word].partsOfSpeech;
  }

  function mockGetRandomWords(opts, done) {
    callNextTick(done, null, ['get', 'some']);
  }

  function mockCountSyllables(word, done) {
    callNextTick(done, null, infoForWords[word].syllableCount);
  }

  createBuildSentence(
    {
      getPartsOfSpeechForMultipleWords: mockGetPartsOfSpeechForMultipleWords,
      countSyllables: mockCountSyllables,
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
    t.equal(sentence, 'Get some sleep');
  }

});
