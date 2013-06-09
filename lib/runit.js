
var path = require('path'),
    fs = require('fs');

function load(name, verb, options) {
    var filename = path.join('.', 'runit', name, verb + '.js');
    if (fs.existsSync(filename))
        return require(path.resolve(filename));
};

function run(name, verb, args, options, cb) {
};

module.exports = {
    run: run,
    load: load
};