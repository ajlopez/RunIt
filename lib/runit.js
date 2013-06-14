
var path = require('path'),
    exec = require('child_process').exec,
    fs = require('fs');
    
function requireFile() {
    var filename = path.join.apply(path, arguments);

    if (!fs.existsSync(filename))
        return null;
        
    return require(path.resolve(filename));
}

function load(name, verb, options, cb) {
    if (!cb && typeof options === 'function') {
        cb = options;
        options = {};
    };
    
    options = options || {};    
    
    var namespace = options.namespace ? options.namespace : 'runit';
    
    var filename;
    
    if (options.directory) {
        rmodule = requireFile(options.directory, namespace, 'modules', name, verb + '.js')
        
        if (rmodule) {
            if (cb) {
                cb(null, rmodule);
                return;
            }
            else   
                return rmodule;
        }

        rmodule = requireFile(options.directory, namespace, 'modules', name, 'index.js');
        
        if (rmodule) {
            if (typeof rmodule[verb] == "function")
                if (cb) {
                    cb(null, rmodule[verb]);
                    return;
                }
                else   
                    return rmodule[verb];
        }
    }
    
    rmodule = requireFile('.', namespace, 'modules', name, verb + '.js');
    
    if (rmodule) {
        if (cb) {
            cb(null, rmodule);
            return;
        }
        else
            return rmodule;
    }
    
    rmodule = requireFile('.', namespace, 'modules', name, 'index.js');
    
    if (rmodule) {
        if (typeof rmodule[verb] == "function")
            if (cb) {
                cb(null, rmodule[verb]);
                return;
            }
            else
                return rmodule[verb];
    }
    
    try {
        var rmodule = require(namespace + '-' + name + '/' + verb);
    }
    catch (ex) {
    }

    if (rmodule)
        if (cb) {
            cb(null, rmodule);
            return;
        }
        else
            return rmodule;
    
    rmodule = null;
    
    try {
        var rmodule = require(namespace + '-' + name);
    }
    catch (ex) {
    }

    if (rmodule)
        if (typeof rmodule[verb] == "function")
            if (cb) {
                cb(null, rmodule[verb]);
                return;
            }
            else
                return rmodule[verb];
    
    rmodule = null;
    
    if (!cb)
        throw 'cannot load rmodule ' + name + ' verb ' + verb;
        
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
            var rmodule = require(path.resolve(filename));
            if (cb) {
                cb(null, rmodule);
                return;
            }
            else
                return rmodule;
        }
        
        filename = path.join('.', 'node_modules', namespace + '-' + name, 'index.js');

        if (fs.existsSync(filename)) {
            var rmodule = require(path.resolve(filename));
            
            if (typeof rmodule[verb] == "function")
                if (cb) {
                    cb(null, rmodule[verb]);
                    return;
                }
                else
                    return rmodule[verb];
        }
        try {
            var rmodule = require(namespace + '-' + name + '/' + verb);
        }
        catch (ex) {
        }
        
        if (rmodule) {
            cb(null, rmodule);
            return;
        }
        
        try {
            var rmodule = require(namespace + '-' + name);
        }
        catch (ex) {
        }

        if (rmodule)
            if (typeof rmodule[verb] == "function") {
                cb(null, rmodule[verb]);
                return;
            }
    
        cb('cannot load rmodule ' + name + ' verb ' + verb);
    });
};

function run(name, verb, args, options, cb) {
    if (!cb && typeof options === 'function') {
        cb = options;
        options = {};
    };
    
    options = options || {};
    
    var rmodule;

    if (cb) {
        load(name, verb, options, function (err, rmodule) {
            if (err) {
                cb(err);
                return;
            }
            
            rmodule(args, runit, options, cb);
        });
    }
    else {
        rmodule = load(name, verb, options);        
        rmodule(args, runit, options);
    }
};

var runit = {
    run: run,
    load: load
};

module.exports = runit;