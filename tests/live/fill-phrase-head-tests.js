var test = require('tape');
var createFillPhraseHead = require('../../fill-phrase-head');

var testCases = [
  {
    testName: 'Get determiners for a word',
    opts: {
      phrase: 'cat',
      headPOS: 'determiner'
    }
  },
  {
    testName: 'Get verb for a phrase',
    opts: {
      phrase: 'a cat',
      headPOS: 'verb'
    }
  }
];

function runTest(testCase) {
  test(testCase.testName, function fillPhraseTest(t) {
    t.plan(3);

    var fillPhraseHead = createFillPhraseHead({
    });

    fillPhraseHead(testCase.opts, checkFills);

    function checkFills(error, fills) {
      t.ok(!error, 'No error while getting fills.');
      t.ok(fills.length > 0, 'At least one fill is returned.');
      t.ok(fills.every(fillIsValid), 'Every fill is valid.');
      console.log(fills);
    }

    function fillIsValid(fill) {
      return typeof fill === 'string';
    }
  });
}

testCases.forEach(runTest);
