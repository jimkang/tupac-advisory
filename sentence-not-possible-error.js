var VError = require('verror');
var util = require('util');

util.inherits(SentenceNotPossibleError, VError);

function SentenceNotPossibleError() {
  var args = Array.prototype.slice.call(arguments, 0);
  SentenceNotPossibleError.super_.apply(this, arguments);
}

module.exports = SentenceNotPossibleError;
