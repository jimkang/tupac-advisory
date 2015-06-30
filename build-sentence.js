var callNextTick = require('call-next-tick');

function createBuildSentence(createOpts, createDone) {
  var getPartsOfSpeech;
  var countSyllables;

  if (createOpts) {
    getPartsOfSpeech = createOpts.getPartsOfSpeech;
    countSyllables = createOpts.countSyllables;
  }

  function buildSentence(opts, done) {
    callNextTick(done, null, 'whut');
  }

  callNextTick(createDone, null, buildSentence);
}

module.exports = createBuildSentence;
