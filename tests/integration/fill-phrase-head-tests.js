var test = require('tape');
var createFillPhraseHead = require('../../fill-phrase-head');

test('Get determiners for a word', function getDeterminersTest(t) {
  t.plan(3);

  var fillPhraseHead = createFillPhraseHead({

  });

  var opts = {
    phrase: ' cat',
    headPOS: 'determiner'
  };

  fillPhraseHead(opts, checkDeterminers);

  function checkDeterminers(error, determiners) {
    t.ok(!error, 'No error while getting determiners.');
    t.ok(determiners.length > 0, 'At least one determiner is returned.');
    t.ok(determiners.every(determinerIsValid), 'Every determiner is valid.');
    // console.log(determiners);
  }

  function determinerIsValid(determiner) {
    return typeof determiner === 'string' && determiner.length > 0;
  }
});
