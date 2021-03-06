var test = require('tape');
var createBuildSentence = require('../build-sentence');
var callNextTick = require('call-next-tick');
var syllableCounter = require('../syllable-counter')();
var queue = require('queue-async');
var jsonfile = require('jsonfile');

var infoForWords = {
  sleep: {
    partsOfSpeech: ['noun']
  },
  get: {
    partsOfSpeech: ['verb']
  },
  some: {
    partsOfSpeech: ['adjective']
  },
  chip: {
    partsOfSpeech: ['noun', 'verb']
  },
  is: {
    partsOfSpeech: ['verb']
  },
  remove: {
    partsOfSpeech: ['verb']
  },
  dip: {
    partsOfSpeech: ['verb', 'noun']
  },
  every: {
    partsOfSpeech: ['determiner']
  },
  the: {
    partsOfSpeech: ['determiner']
  },
  following: {
    partsOfSpeech: ['noun', 'verb']
  },
  called: {
    partsOfSpeech: ['verb']
  },
  determining: {
    partsOfSpeech: ['adjective']
  }
}

var headsForPhrases = {
  sleep: ['some', 'little'],
  'some sleep': ['get', 'had'],
  chip: ['the'],
  'the chip': ['is', 'remove'],
  dip: ['every', 'the'],
  'the dip': ['following', 'called', 'determining'],
  'every dip': ['knew']
};

var presentTensesOfVerbs = {
  knew: 'know'
};

var unusablePhraseStarters = jsonfile.readFileSync(
  __dirname + '/../data/unusable-phrase-starters.json'
);

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

function mockGetPresentTenseOfVerb(verb, done) {
  var presentTense = presentTensesOfVerbs[verb];
  if (!presentTense) {
    presentTense = verb;
  }
  callNextTick(done, null, presentTense);
}

var testCases = [
  {
    opts: {
      endWord: 'sleep',
      desiredSyllables: 3
    },
    expected: 'get some sleep'
  },
  {
    opts: {
      endWord: 'chip',
      desiredSyllables: 3
    },
    expected: 'remove the chip'
  },
  {
    opts: {
      endWord: 'dip',
      desiredSyllables: 3
    },
    expected: 'know every dip'
  }
];

test('Build sentences', function buildSentencesTests(t) {
  t.plan(2 * testCases.length);

  testCases.forEach(runTest);

  function runTest(testCase) {
    var buildSentence = createBuildSentence({
      getPartsOfSpeechForMultipleWords: mockGetPartsOfSpeechForMultipleWords,
      countSyllables: syllableCounter.countSyllables,
      fillPhraseHead: mockFillPhraseHead,
      pickFromArray: mockPickFromArray,
      unusablePhraseStarters: unusablePhraseStarters,
      getPresentTenseOfVerb: mockGetPresentTenseOfVerb
    });

    buildSentence(testCase.opts, checkSentence);

    function checkSentence(error, sentence) {
      // console.log(sentence);
      if (error) {
        console.log(error);
      }
      t.ok(!error, 'No error while building sentence.');
      t.equal(sentence, testCase.expected);
    }
  }
});
