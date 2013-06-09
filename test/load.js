
var runit = require('..'),
    assert = require('assert');
    
assert.ok(runit.load);
assert.equal(typeof runit.load, "function");

