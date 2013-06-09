
var runit = require('..'),
    path = require('path');
    
exports['Load function defined'] = function (test) {
    test.ok(runit.load);
    test.equal(typeof runit.load, "function");
    test.done();
};

exports['Load local runit module file'] = function (test) {
    var setglobal = require('../runit/test/setglobal.js');
    var result = runit.load('test','setglobal');

    test.ok(result);
    test.equal(result, setglobal);
    test.done();
};

exports['Load local runit module function'] = function (test) {
    var setrunit = require('../runit/test/index.js').setrunit;
    var result = runit.load('test','setrunit');

    test.ok(result);
    test.equal(result, setrunit);
    test.done();
};

exports['Load unknown module fails'] = function (test) {
    test.expect(1);
    runit.load('unknown', 'unknown', function (err, result) {
        test.ok(err);
        test.done();
    });
};

exports['Load test directory runit module'] = function (test) {
    var setglobal = require(path.join(__dirname, 'runit', 'localtest', 'setglobal.js'));
    var result = runit.load('localtest','setglobal', { directory: __dirname });

    test.ok(result);
    test.equal(result, setglobal);
    test.done();
};