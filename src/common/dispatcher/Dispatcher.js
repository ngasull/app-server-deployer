var Promise = require('es6-promise').Promise;
var assign = require('object-assign');

var callbacks = [];

var Dispatcher = function () {
};
Dispatcher.prototype = assign({}, Dispatcher.prototype, {

    /**
     * Register a Store's callback so that it may be invoked by an action.
     * @param {function} callback The callback to be registered.
     * @return {number} The index of the callback within the callbacks array.
     */
    register: function (callback) {
        callbacks.push(callback);
        return callbacks.length - 1; // index
    },

    unregister: function (index) {
        delete callbacks[index];
    },

    /**
     * dispatch
     * @param  {object} payload The data from the action.
     */
    dispatch: function (payload) {
        // First create array of promises for callbacks to reference.
        var resolves = [];
        var rejects = [];

        var promises = callbacks.map(function (callback, i) {

            return new Promise(function (resolve, reject) {
                resolves[i] = resolve;
                rejects[i] = reject;
            });
        });

        // Dispatch to callbacks and resolve/reject promises.
        callbacks.forEach(function (callback, i) {

            // Callback can return an obj, to resolve, or a promise, to chain.
            // See waitFor() for why this might be useful.
            try {
                Promise.resolve(callback(payload)).then(function () {
                    resolves[i](payload);
                }, function (err) {
                    rejects[i](err);
                });
            } catch (err) {
                rejects[i](err);
            }
        });

        return Promise.all(promises);
    }
});

module.exports = Dispatcher;
