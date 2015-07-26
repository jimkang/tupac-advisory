var createBuildSentence = require('../build-sentence');
var createFillPhraseHead = require('../fill-phrase-head');
var createProbable = require('probable').createProbable;
var createWordnok = require('wordnok').createWordnok;
var seedrandom = require('seedrandom');
var config = require('../config');

var syllableCounter = require('../syllable-counter')();

if (process.argv.length < 3) {
  console.log('Usage: node run-build-sentence.js <end word of sentence>');
  process.exit();
}

var endWord = process.argv[2];


var seed = (new Date()).toISOString();
console.log('Seed:', seed);

var probable = createProbable({
  random: seedrandom(seed)
});

var wordnok = createWordnok({
  apiKey: config.wordnikAPIKey,
  logger: {
    log: function noOp() {}
  }
});

var fillPhraseHead = createFillPhraseHead();

var buildSentence = createBuildSentence({
  getPartsOfSpeechForMultipleWords: wordnok.getPartsOfSpeechForMultipleWords,
  countSyllables: syllableCounter.countSyllables,
  fillPhraseHead: fillPhraseHead,
  pickFromArray: probable.pickFromArray
});

buildSentence(
  {
    endWord: endWord,
    desiredSyllables: 3
  },
  showSentence
);

function showSentence(error, sentence) {
  if (error) {
    console.log(error);
  }
  else {
    console.log(sentence);
  }
}
