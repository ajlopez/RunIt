
var path = require('path'),
    fs = require('fs');

function load(name, verb, options) {
    var filename = path.join('.', 'runit', name, verb + '.js');
    
    if (fs.existsSync(filename))
        return require(path.resolve(filename));
    
    filename = path.join('.', 'runit', name, 'index.js');
    
    if (fs.existsSync(filename)) {
        var module = require(path.resolve(filename));
        if (typeof module[verb] == "function")
            return module[verb];
    }
};

function run(name, verb, args, options, cb) {
    var module = load(name, verb, options);
    module(args, runit, options, cb);
};

var runit = {
    run: run,
    load: load
};

module.exports = runit;