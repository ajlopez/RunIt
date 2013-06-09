
module.exports.setrunit = function (args, runit, options, cb) {
    runit.model[args[0]] = args[1];
    
    if (cb)
        cb(null, args[1]);
};