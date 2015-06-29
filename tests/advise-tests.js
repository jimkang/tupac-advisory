var test = require('tape');
var createAdvise = require('../advise');
var callNextTick = require('call-next-tick');
var SentenceNotPossibleError = require('../sentence-not-possible-error');

test('Basic test', function basicTest(t) {
  t.plan(7);
  // useAdvisor x1, getRhymes x1, buildSentence x3, checkAdvice x1 (2 asserts)

  function getRhymes(opts, done) {
    t.equal(opts.base, 'Tupac', 'Base is passed to getRhymes function.');
    callNextTick(done, null, ['ROCKS', 'BACH', 'BOP', 'BLOT']);
  }

  var buildSentenceCallCount = 0;

  function buildSentence(opts, done) {
    t.ok(
      opts.endWord.length > 0,  'A rhyme is passed as endWord to buildSentence.'
    );

    var error;
    var sentence;

    // On the first two calls, say that this function couldn't build a sentence.
    // On the third, succeed.
    if (buildSentenceCallCount > 1) {
      sentence = 'Play some ' + opts.endWord;
    }
    else {
      error = new SentenceNotPossibleError(
        'Could not build sentence with ' + opts.endWord
      );
    }

    buildSentenceCallCount += 1;
    callNextTick(done, error, sentence);
  }

  function mockShuffle(array) {
    return [array[2], array[0], array[1], array[4]];
  }
 
  createAdvise(
    {
      getRhymes: getRhymes,
      buildSentence: buildSentence,
      shuffle: mockShuffle
    },
    useAdvise
  );

  function useAdvise(error, advise) {
    t.ok(!error, 'No error while creating advisor.');
    advise(
      {
        base: 'Tupac'
      },
      checkAdvice
    );

    function checkAdvice(error, advice) {
      t.ok(!error, 'No error while advising.');
      t.equal(advice, 'Play some BACH');
    }
  }
});
