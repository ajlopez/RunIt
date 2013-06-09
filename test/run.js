
var runit = require('..'),
    fs = require('fs'),
    path = require('path');
    
exports['Run function defined'] = function (test) {
    test.ok(runit.run);
    test.equal(typeof runit.run, "function");
    test.done();
};

exports['Run local runit test setglobal'] = function (test) {
    global.model = { };
    
    runit.run('test', 'setglobal', ['name', 'Adam']);
    
    test.ok(global.model.name);
    test.equal(global.model.name, 'Adam');
    test.done();
};

exports['Run local runit test setrunit'] = function (test) {
    runit.model = { };
    
    runit.run('test', 'setrunit', ['name', 'Adam']);
    
    test.ok(runit.model.name);
    test.equal(runit.model.name, 'Adam');
    test.done();
};

exports['Run local module test setglobal'] = function (test) {
    global.model = { };
    
    runit.run('npmtest', 'setglobal', ['name', 'Adam']);
    
    test.ok(global.model.name);
    test.equal(global.model.name, 'Adam');
    test.done();
};

exports['Run local module test setrunit'] = function (test) {
    runit.model = { };
    
    runit.run('npmtest', 'setrunit', ['name', 'Adam']);
    
    test.ok(runit.model.name);
    test.equal(runit.model.name, 'Adam');
    test.done();
};

exports['Install and run local module test setglobal'] = function (test) {
    global.model = { };
    
    removeModule('npmtest');
        
    test.expect(3);
    
    runit.run('npmtest', 'setglobal', ['name', 'Adam'], function (err, result) {    
        test.equal(err, null);
        test.ok(global.model.name);
        test.equal(global.model.name, 'Adam');
        test.done();
    });
};

exports['Install and run local module test setrunit'] = function (test) {
    runit.model = { };
    
    removeModule('npmtest');
    
    test.expect(3);
    
    runit.run('npmtest', 'setrunit', ['name', 'Adam'], function (err, result) {    
        test.equal(err, null);
        test.ok(runit.model.name);
        test.equal(runit.model.name, 'Adam');
        test.done();
    });
};

function removeModule(name) {
    var directory = getModuleDirectory(name);
    
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

function getModuleDirectory(name) {
    return path.join(__dirname, '..', 'node_modules', 'runit-' + name);
}