var callNextTick = require('call-next-tick');
var SentenceNotPossibleError = require('./sentence-not-possible-error');

function createAdvise(opts, createDone) {
  var getRhymes;
  var buildSentence;
  var shuffle;

  if (opts) {
    getRhymes = opts.getRhymes;
    buildSentence = opts.buildSentence;
    shuffle = opts.shuffle;
  }

  if (!getRhymes) {
    callNextTick(createDone, new Error('getRhymes missing from opts.'));
    return;
  }
  if (!buildSentence) {
    callNextTick(createDone, new Error('buildSentence missing from opts.'));
    return;
  }
  if (!shuffle) {
    callNextTick(createDone, new Error('shuffle missing from opts.'));
    return;
  }

  callNextTick(createDone, null, advise);

  function advise(opts, done) {
    getRhymes(
      {
        base: opts.base
      },
      shuffleRhymes
    );

    function shuffleRhymes(error, rhymes) {
      if (error) {
        done(error);
      }
      if (rhymes.length < 1) {
        done(new Error('No rhymes available with which to build sentence.'));
      }
      else {
        buildSentenceWithRhymes(shuffle(rhymes));
      }
    }

    function buildSentenceWithRhymes(rhymes) {
      var rhyme = rhymes[0];
      buildSentence(
        {
          endWord: rhyme
        },
        useSentence
      );

      function useSentence(error, sentence) {
        if (error) {
          if (error instanceof SentenceNotPossibleError) {
            if (rhymes.length > 1) {
              callNextTick(buildSentenceWithRhymes, rhymes.slice(1));
            }
            else {
              done(new SentenceNotPossibleError(
                'Could not create sentence with any of the given rhymes.'
              ));
            }
          }
          else {
            done(error);
          }
        }
        else {
          done(error, sentence);
        }
      }
    }
  }
}

module.exports = createAdvise;
