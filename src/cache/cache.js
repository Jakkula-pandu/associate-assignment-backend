const nodeCache = require('node-cache')
let cache = null;

/* To start the Cache server */
exports.start = function (done) {

    if (cache) return done();
    cache = new nodeCache();

}

/* To Create instance of the Cache server */
exports.instance = function () {
    return cache;
}

/* To fetch the data from cache based on key */

exports.get = function (key) {
    return cache[key];
}
