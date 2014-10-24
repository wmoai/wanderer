var fs = require('fs')
  , csv = require('csv')
;

fs.readFile('./map.csv', {encoding: 'utf8'}, function(err, data) {
  csv.parse(data, function(err, data) {
    module.exports.array = data;
  });
});


