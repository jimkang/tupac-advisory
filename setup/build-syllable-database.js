var setUpDatabase = require('word-syllable-map').setUpDatabase;

setUpDatabase(
  {
    dbLocation: __dirname + '/../data/word-syllable.db'
  },
  done
);

function done(error) {
  if (error) {
    console.log(error)
  }
  else {
    console.log('Successfully set up database.');
  }
}
