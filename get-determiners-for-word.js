var getNgrams = require('ngram-getter');

function createGetDeterminersForWord(opts) {
  function getDeterminersForWord(word, done) {
    var ngramOpts = {
      phrases: '*_DET ' + word
    };

    getNgrams(ngramOpts, distillNgramResults);

    function distillNgramResults(error, ngramsGroups) {
      if (error) {
        done(error);
      }
      else {
        done(error, ngramsGroups.map(getDeterminerFromNgrams));
      }
    }
  }

  return getDeterminersForWord;
}


function getDeterminerFromNgrams(ngrams) {
  var determiner;

  if (ngrams.length > 0) {
    determiner = ngrams[0].word;
  }

  return determiner;
}

module.exports = createGetDeterminersForWord;
