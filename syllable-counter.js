var createWordSyllableMap = require('word-syllable-map').createWordSyllableMap;

function createSyllableCounter() {
  var wordSyllableMap = createWordSyllableMap({
    dbLocation: __dirname + '/data/word-syllable.db'
  });

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

  return {
    countSyllables: countSyllables,
    close: wordSyllableMap.close
  };
}

module.exports = createSyllableCounter;
