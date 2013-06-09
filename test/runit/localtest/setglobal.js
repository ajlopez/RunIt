
module.exports = function (args, runit, options, cb) {
    global.model[args[0]] = args[1];
};