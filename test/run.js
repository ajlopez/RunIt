
var runit = require('..');
    
exports['Run function defined'] = function (test) {
    test.ok(runit.run);
    test.equal(typeof runit.run, "function");
    test.done();
};
