
var runit = require('..');
    
exports['Load function defined'] = function (test) {
    test.ok(runit.load);
    test.equal(typeof runit.load, "function");
    test.done();
};

exports['Load local runit module'] = function (test) {
    var setglobal = require('../runit/test/setglobal.js');
    var result = runit.load('test','setglobal');

    test.ok(result);
    test.equal(result, setglobal);
    test.done();
};

