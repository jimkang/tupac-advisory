var getNgrams = require('ngram-getter');
var callNextTick = require('call-next-tick');

// If necessary, alternate between differen ngram microservices instead of using
// ngram-getter directly.

function createFillPhraseHead(createOpts) {
  function fillPhraseHead(opts, done) {
    var phrase;
    var headPOS;

    if (opts) {
      phrase = opts.phrase;
      headPOS = opts.headPOS;
    }

    if (!phrase) {
      callNextTick(done, new Error('No phrase passed to fillPhraseHead.'));
      return;
    }

    var ngramOpts = {
      phrases: termForPOS(headPOS) + ' ' + phrase
    };

    getNgrams(ngramOpts, distillNgramResults);

    function distillNgramResults(error, ngramsGroups) {
      console.log('Got ngram results for ', ngramOpts.phrases);
      debugger;
      if (error) {
        done(error);
      }
      else {
        done(error, ngramsGroups.map(getFillFromNgrams));
      }
    }
  }

  return fillPhraseHead;
}

var termsForPOS = {
  noun: '*_NOUN',
  verb: '*_VERB',
  adjective: '*_ADJ',
  adverb: '*_ADV',
  pronoun: '*_PRON_',
  article: '*_DET',
  postposition: '*_ADP',
  numeral: '*_NUM',
  conjunction: '*_CONJ',
  particle: '*_PRT'
};

function termForPOS(pos) {
  var term = termsForPOS[pos];
  if (!term) {
    term = '*';
  }
  return term;
}

function getFillFromNgrams(ngrams) {
  var fill;

  if (ngrams.length > 0) {
    fill = ngrams[0].word;
  }

  return fill;
}

module.exports = createFillPhraseHead;
