
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
        cb(null, rmodule);
        return;
    }
    
    rmodule = requireFile('.', namespace, 'modules', name, 'index.js');
    
    if (rmodule) {
        if (typeof rmodule[verb] == "function") {
            cb(null, rmodule[verb]);
            return;
        }
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
    
    rmodule = null;
    
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
    
    rmodule = null;
    
    var command = 'npm install ' + namespace + '-' + name;
    
    if (options.global)
        command += ' -g';
    
    exec(command, function(err, stdout, stderr) {
        if (err) {
            cb(err);
            return;
        }
        
        rmodule = requireFile('.', 'node_modules', namespace + '-' + name, verb + '.js');

        if (rmodule) {
            cb(null, rmodule);
            return;
        }
        
        rmodule = requireFile('.', 'node_modules', namespace + '-' + name, 'index.js');

        if (rmodule) {
            if (typeof rmodule[verb] == "function") {
                cb(null, rmodule[verb]);
                return;
            }
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

    load(name, verb, options, function (err, rmodule) {
        if (err) {
            cb(err);
            return;
        }
        
        rmodule(args, runit, options, cb);
    });
};

var runit = {
    run: run,
    load: load
};

module.exports = runit;