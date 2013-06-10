
var runit = require('..'),
    fs = require('fs'),
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
    var result = runit.load('test', 'setrunit');

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
    var result = runit.load('localtest', 'setglobal', { directory: __dirname });

    test.ok(result);
    test.equal(result, setglobal);
    test.done();
};

exports['Load test directory runit module function'] = function (test) {
    var localtest = require(path.join(__dirname, 'runit', 'localtest'));
    var result = runit.load('localtest', 'setrunit', { directory: __dirname });

    test.ok(result);
    test.equal(result, localtest.setrunit);
    test.done();
};

exports['Load test directory ajgenesis module'] = function (test) {
    var setglobal = require(path.join(__dirname, 'ajgenesis', 'localtest', 'setglobal.js'));
    var result = runit.load('localtest', 'setglobal', { directory: __dirname, namespace: 'ajgenesis' });

    test.ok(result);
    test.equal(result, setglobal);
    test.done();
};

exports['Load test directory ajgenesis module function'] = function (test) {
    var localtest = require(path.join(__dirname, 'ajgenesis', 'localtest'));
    var result = runit.load('localtest', 'setrunit', { directory: __dirname, namespace: 'ajgenesis' });

    test.ok(result);
    test.equal(result, localtest.setrunit);
    test.done();
};

exports['Load module'] = function (test) {
    var result = runit.load('npmtest', 'setglobal');

    test.ok(result);
    var setglobal = require('runit-npmtest/setglobal');    
    test.equal(result, setglobal);
    test.done();
};

exports['Load module function'] = function (test) {
    var result = runit.load('npmtest', 'setrunit');

    test.ok(result);
    var npmtest = require('runit-npmtest');    
    test.equal(result, npmtest.setrunit);
    test.done();
};

exports['Install and Load AjGenesis module'] = function (test) {
    test.expect(2);
    
    var result = runit.load('hello', 'generate', { namespace: 'ajgenesisnode' }, function (err, result) {
        test.equal(err, null);
        test.ok(result);
        test.done();
    });
};

exports['Install from npm and Load module'] = function (test) {
    removeModule('npmtest');
    
    test.expect(4);
    
    var directory = getModuleDirectory('npmtest');
    test.ok(!fs.existsSync(directory));
    
    runit.load('npmtest', 'setglobal', function(err, result) {
        test.equal(err, null);
        test.ok(result);
        var setglobal = require('runit-npmtest/setglobal');
        test.equal(result, setglobal);
        test.done();
    });
};

exports['Install from npm and Load module function'] = function (test) {
    removeModule('npmtest');
    
    test.expect(4);
    
    var directory = getModuleDirectory('npmtest');
    test.ok(!fs.existsSync(directory));
    
    runit.load('npmtest', 'setrunit', function(err, result) {
        test.equal(err, null);
        test.ok(result);
        var npmtest = require('runit-npmtest');
        test.equal(result, npmtest.setrunit);
        test.done();
    });
};

function removeModule(name, namespace) {
    var directory = getModuleDirectory(name, namespace);
    
    if (fs.existsSync(directory)) {
        fs.unlinkSync(path.join(directory, 'package.json'));
        fs.unlinkSync(path.join(directory, 'index.js'));
        fs.unlinkSync(path.join(directory, 'setglobal.js'));
        fs.rmdirSync(directory);
    }
    
    Object.keys(require.cache).forEach(function (name) {
        delete require.cache[name];
    });
}

function getModuleDirectory(name, namespace) {
    namespace = namespace || 'runit';
    return path.join(__dirname, '..', 'node_modules', namespace + '-' + name);
}