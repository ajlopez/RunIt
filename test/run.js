
var runit = require('..');
    
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