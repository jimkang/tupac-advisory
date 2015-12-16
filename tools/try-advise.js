var createAdvise = require('../advise');
var createRime = require('rime');
var seedrandom = require('seedrandom');
var createProbable = require('probable').createProbable;
var createBuildSentence = require('../build-sentence');
var createWordnok = require('wordnok').createWordnok;
var syllableCounter = require('../syllable-counter')();
var createFillPhraseHead = require('../fill-phrase-head');
var jsonfile = require('jsonfile');
var callNextTick = require('call-next-tick');
var config = require('../config.js');

var seed = (new Date()).toISOString();
console.log('seed:', seed);

var random = seedrandom(seed);

var probable = createProbable({
  random: random
});

var wordnok = createWordnok({
  apiKey: config.wordnikAPIKey
});

var fillPhraseHead = createFillPhraseHead({});

var unusablePhraseStarters = jsonfile.readFileSync(
  __dirname + '/../data/unusable-phrase-starters.json'
);

var buildSentence = createBuildSentence({
  getPartsOfSpeechForMultipleWords: wordnok.getPartsOfSpeechForMultipleWords,
  countSyllables: syllableCounter.countSyllables,
  fillPhraseHead: fillPhraseHead,
  pickFromArray: probable.pickFromArray,
  getPresentTenseOfVerb: mockGetPresentTenseOfVerb
});

function mockGetPresentTenseOfVerb(verb, done) {
  callNextTick(done, null, verb);
  }

createRime(
  {
    random: random
  },
  useRime
);

function useRime(error, rime) {
  debugger;
  if (error) {
    console.log(error);
  }
  else {
    createAdvise(
      {
        getRhymes: rime.getRhymes,
        buildSentence: buildSentence,
        shuffle: probable.shuffle
      },
      useAdvise
    );
  }
}

function useAdvise(error, advise) {
  debugger;
  if (error) {
    console.log(error);
  }
  else {
    advise(
      {
        base: 'stock'
      },
      logAdvice  
    );
  }
}

function logAdvice(error, advice) {
  if (error) {
    console.log(error);
  }
  else {
    console.log(advice);
  }
}
