
var runit = require('..'),
    assert = require('assert');
    
assert.ok(runit.run);
assert.equal(typeof runit.run, "function");

