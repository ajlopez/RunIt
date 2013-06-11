
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
            var module = require(path.resolve(filename));
            
            if (cb) {
                cb(null, module);
                return;
            }
            else   
                return module;
        }

        filename = path.join(options.directory, namespace, name, 'index.js');
        
        if (fs.existsSync(filename)) {
            var module = require(path.resolve(filename));
            
            if (typeof module[verb] == "function")
                if (cb) {
                    cb(null, module[verb]);
                    return;
                }
                else   
                    return module[verb];
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
        var module = require(path.resolve(filename));
        if (typeof module[verb] == "function")
            if (cb) {
                cb(null, module[verb]);
                return;
            }
            else
                return module[verb];
    }
    
    filename = path.join('.', 'node_modules', namespace + '-' + name, verb + '.js');

    if (fs.existsSync(filename)) {
        var module = require(path.resolve(filename));
        if (cb) {
            cb(null, module);
            return;
        }
        else
            return module;
    }
    
    filename = path.join('.', 'node_modules', namespace + '-' + name, 'index.js');

    if (fs.existsSync(filename)) {
        var module = require(path.resolve(filename));
        
        if (typeof module[verb] == "function")
            if (cb) {
                cb(null, module[verb]);
                return;
            }
            else
                return module[verb];
    }
    
    try {
        var module = require(namespace + '-' + name + '/' + verb);
        if (cb) {
            cb(null, module);
            return;
        }
        else
            return module;
    }
    catch (ex) {
    }
    
    try {
        var module = require(namespace + '-' + name);
        
        if (typeof module[verb] == "function")
            if (cb) {
                cb(null, module[verb]);
                return;
            }
            else
                return module[verb];
    }
    catch (ex) {
    }
    
    if (!cb)
        throw 'cannot load module ' + name + ' verb ' + verb;
        
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
            var module = require(path.resolve(filename));
            if (cb) {
                cb(null, module);
                return;
            }
            else
                return module;
        }
        
        filename = path.join('.', 'node_modules', namespace + '-' + name, 'index.js');

        if (fs.existsSync(filename)) {
            var module = require(path.resolve(filename));
            
            if (typeof module[verb] == "function")
                if (cb) {
                    cb(null, module[verb]);
                    return;
                }
                else
                    return module[verb];
        }

        try {
            var module = require(path.join('..', '..', namespace + '-' + name + '/' + verb));
            cb(null, module);
            return;
        }
        catch (ex) {
        }

        try {
            var module = require(path.join('..', '..', namespace + '-' + name));
            
            if (typeof module[verb] == "function") {
                cb(null, module[verb]);
                return;
            }
        }
        catch (ex) {
        }

        try {
            var module = require(namespace + '-' + name + '/' + verb);
            cb(null, module);
            return;
        }
        catch (ex) {
        }

        try {
            var module = require(namespace + '-' + name);
            
            if (typeof module[verb] == "function") {
                cb(null, module[verb]);
                return;
            }
        }
        catch (ex) {
        }
    
        cb('cannot load module ' + name + ' verb ' + verb);
    });
};

function run(name, verb, args, options, cb) {
    if (!cb && typeof options === 'function') {
        cb = options;
        options = {};
    };
    
    options = options || {};
    
    var module;

    if (cb) {
        load(name, verb, options, function (err, module) {
            if (err) {
                cb(err);
                return;
            }
            
            module(args, runit, options, cb);
        });
    }
    else {
        module = load(name, verb, options);        
        module(args, runit, options);
    }
};

var runit = {
    run: run,
    load: load
};

module.exports = runit;