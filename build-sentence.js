var callNextTick = require('call-next-tick');
var async = require('async');

function createBuildSentence(createOpts) {
  var getPartsOfSpeechForMultipleWords;
  var countSyllables;
  var fillPhraseHead;
  var pickFromArray;

  if (createOpts) {
    getPartsOfSpeechForMultipleWords =
      createOpts.getPartsOfSpeechForMultipleWords;

    countSyllables = createOpts.countSyllables;
    fillPhraseHead = createOpts.fillPhraseHead;
    pickFromArray = createOpts.pickFromArray;
  }

  function buildSentence(opts, buildDone) {
    var endWord;
    var desiredSyllables;

    if (opts) {
      endWord = opts.endWord;
      desiredSyllables = opts.desiredSyllables;
    }

    if (!desiredSyllables) {
      desiredSyllables = 3;
    }
    if (!endWord) {
      callNextTick(
        buildDone, new Error('endWord not provided to buildSentence.')
      );
      return;
    }

    countSyllables(endWord.toUpperCase(), evaluateSyllableSituation);

    function evaluateSyllableSituation(error, count) {
      if (error) {
        buildDone(error);
      }
      else {
        var syllablesNeeded = desiredSyllables - count;
        if (syllablesNeeded < 1) {
          buildDone(error, endWord);
        }
        else {
          fillInSentence(count);
        }
      }
    }

    function fillInSentence(count) {
      getPartsOfSpeechForMultipleWords([endWord], fillMiddleWordForPOS);
    }

    // If the ending word is a noun, then we can act on it with a verb.
    // If it's a verb, then that alone is fine.
    // We don't know what to do with anything else – yet.
    // Maybe we can find a verb for an adverb? But then, the article would be 
    // skippped.
    function fillMiddleWordForPOS(error, partsOfSpeechLists) {
      if (error) {
        buildDone(error);
      }
      else if (partsOfSpeechLists.length < 1 ||
        (partsOfSpeechLists[0].indexOf('noun') === -1 &&
        partsOfSpeechLists[0].indexOf('verb') !== -1)) {

        buildDone(error, endWord);
      }
      else {
        var fillMiddleOpts = {
          phrase: endWord,
          headPOS: 'determiner'
        };
        fillPhraseHead(fillMiddleOpts, fillStartWord);
      }
    }

    function fillStartWord(error, determiners) {
      var determiner;

      if (error) {
        buildDone(error);
      }
      else {
        determiner = pickFromArray(determiners);
        var fillStartOpts = {
          phrase: determiner + ' ' + endWord,
          headPOS: 'verb'
        };
        fillPhraseHead(fillStartOpts, assemblePhrase);
      }

      function assemblePhrase(error, startWords) {
        if (error) {
          buildDone(error);
        }
        else {
          var startWord = pickFromArray(startWords);
          buildDone(error, startWord + ' ' + determiner + ' ' + endWord);
        }
      }
    }
  }

  return buildSentence;
}

module.exports = createBuildSentence;
