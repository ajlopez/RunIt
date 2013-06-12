
var path = require('path'),
    exec = require('child_process').exec,
    fs = require('fs');

function load(name, verb, options, cb) {
    if (!cb && typeof options === 'function') {
        cb = options;
        options = {};
    };
    
    options = options || {};
    
    var namespace = options.namespace ? options.namespace : 'runit';
    
    var filename;
    
    if (options.directory) {
        filename = path.join(options.directory, namespace, name, verb + '.js');
        
        if (fs.existsSync(filename)) {
            var mod = require(path.resolve(filename));
            
            if (cb) {
                cb(null, mod);
                return;
            }
            else   
                return mod;
        }

        filename = path.join(options.directory, namespace, name, 'index.js');
        
        if (fs.existsSync(filename)) {
            var mod = require(path.resolve(filename));
            
            if (typeof mod[verb] == "function")
                if (cb) {
                    cb(null, mod[verb]);
                    return;
                }
                else   
                    return mod[verb];
        }
    }
    
    filename = path.join('.', namespace, name, verb + '.js');
    
    if (fs.existsSync(filename))
        if (cb) {
            cb(null, require(path.resolve(filename)));
            return;
        }
        else
            return require(path.resolve(filename));
    
    filename = path.join('.', namespace, name, 'index.js');
    
    if (fs.existsSync(filename)) {
        var mod = require(path.resolve(filename));
        if (typeof mod[verb] == "function")
            if (cb) {
                cb(null, mod[verb]);
                return;
            }
            else
                return mod[verb];
    }
    
    filename = path.join('.', 'node_modules', namespace + '-' + name, verb + '.js');

    if (fs.existsSync(filename)) {
        var mod = require(path.resolve(filename));
        if (cb) {
            cb(null, mod);
            return;
        }
        else
            return mod;
    }
    
    filename = path.join('.', 'node_modules', namespace + '-' + name, 'index.js');

    if (fs.existsSync(filename)) {
        var mod = require(path.resolve(filename));
        
        if (typeof mod[verb] == "function")
            if (cb) {
                cb(null, mod[verb]);
                return;
            }
            else
                return mod[verb];
    }
    
    try {
        var mod = require(namespace + '-' + name + '/' + verb);
    }
    catch (ex) {
    }

    if (mod)
        if (cb) {
            cb(null, mod);
            return;
        }
        else
            return mod;
    
    mod = null;
    
    try {
        var mod = require(namespace + '-' + name);
    }
    catch (ex) {
    }

    if (mod)
        if (typeof mod[verb] == "function")
            if (cb) {
                cb(null, mod[verb]);
                return;
            }
            else
                return mod[verb];
    
    mod = null;
    
    if (!cb)
        throw 'cannot load mod ' + name + ' verb ' + verb;
        
    var command = 'npm install ' + namespace + '-' + name;
    
    if (options.global)
        command += ' -g';
    
    exec(command, function(err, stdout, stderr) {
        if (err) {
            cb(err);
            return;
        }
        
        filename = path.join('.', 'node_modules', namespace + '-' + name, verb + '.js');

        if (fs.existsSync(filename)) {
            var mod = require(path.resolve(filename));
            if (cb) {
                cb(null, mod);
                return;
            }
            else
                return mod;
        }
        
        filename = path.join('.', 'node_modules', namespace + '-' + name, 'index.js');

        if (fs.existsSync(filename)) {
            var mod = require(path.resolve(filename));
            
            if (typeof mod[verb] == "function")
                if (cb) {
                    cb(null, mod[verb]);
                    return;
                }
                else
                    return mod[verb];
        }

        try {
            var mod = require(path.join('..', '..', namespace + '-' + name + '/' + verb));
        }
        catch (ex) {
        }
        
        if (mod) {
            cb(null, mod);
            return;
        }
        
        mod = null;

        try {
            var mod = require(path.join('..', '..', namespace + '-' + name));
        }
        catch (ex) {
        }

        if (mod)
            if (typeof mod[verb] == "function") {
                cb(null, mod[verb]);
                return;
            }
            
        mod = null;

        try {
            var mod = require(namespace + '-' + name + '/' + verb);
        }
        catch (ex) {
        }
        
        if (mod) {
            cb(null, mod);
            return;
        }
        
        try {
            var mod = require(namespace + '-' + name);
        }
        catch (ex) {
        }

        if (mod)
            if (typeof mod[verb] == "function") {
                cb(null, mod[verb]);
                return;
            }
    
        cb('cannot load mod ' + name + ' verb ' + verb);
    });
};

function run(name, verb, args, options, cb) {
    if (!cb && typeof options === 'function') {
        cb = options;
        options = {};
    };
    
    options = options || {};
    
    var mod;

    if (cb) {
        load(name, verb, options, function (err, mod) {
            if (err) {
                cb(err);
                return;
            }
            
            mod(args, runit, options, cb);
        });
    }
    else {
        mod = load(name, verb, options);        
        mod(args, runit, options);
    }
};

var runit = {
    run: run,
    load: load
};

module.exports = runit;