var callNextTick = require('call-next-tick');
var async = require('async');

function createBuildSentence(createOpts, createDone) {
  var getPartsOfSpeechForMultipleWords;
  var countSyllables;
  var getRandomWords;

  if (createOpts) {
    getPartsOfSpeechForMultipleWords =
      createOpts.getPartsOfSpeechForMultipleWords;

    countSyllables = createOpts.countSyllables;
    getRandomWords = createOpts.getRandomWords;
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
      getPartsOfSpeechForMultipleWords([endWord], getActingWordForPOS);
    }

    // If the ending word is a noun, then we can act on it with a verb.
    // We don't know what to do with anything else – yet.
    // Maybe we can find a verb for an adverb? But then, the article would be 
    // skippped.
    function getActingWordForPOS(error, partsOfSpeech) {
      if (error) {
        buildDone(error);
      }
      else if (partsOfSpeech.length < 1 ||
        partsOfSpeech[0].indexOf('noun') === -1) {

        buildDone(error, endWord);
      }
      else {
        getRandomWords(
          {
            customParams: {
              includePartOfSpeech: 'verb'              
            }
          },
          pickActingWordFromRandomWords
        );
      }
    }

    function pickActingWordFromRandomWords(error, words) {
      if (error) {
        buildDone(error);
      }
      else {
        getPartsOfSpeechForMultipleWords(words, pickFromVerbs);
      }

      function pickFromVerbs(error, partsOfSpeech) {
        if (error) {
          buildDone(error);
        }
        else {
          // TODO: Pick at random instead of just the first one.
          var verb;
          for (var i = 0; i < partsOfSpeech.length; ++i) {
            if (partsOfSpeech[i].indexOf('verb') !== -1) {
              verb = words[i];
              break;
            }
          }

          if (!verb) {
            buildDone(error, endWord);
          }
          else {
            buildWithActionWord(verb);
          }
        }
      }
    }

    function buildWithActionWord(actionWord) {
      // TODO: Find a "joiner" word, e.g. "actionWord joiner endWord".
      buildDone(null, actionWord + ' ' + endWord);
    }
  }

  callNextTick(createDone, null, buildSentence);
}

module.exports = createBuildSentence;
