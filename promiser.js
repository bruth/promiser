/*
 * promiser.js - 0.1
 * (c) 2013 Byron Ruth
 * promiser.js may be freely distributed under the BSD license
 */

(function(root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory(exports.jQuery);
    } else if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        var _promiser = root.promiser,
            promiser = root.promiser = factory(root.jQuery);

        root.promiser.noConflict = function() {
            if (_promiser == undefined) {
                delete root.promiser;
            } else {
                root.promiser = _promiser;
            }
            return promiser;
        }
    }
}(this, function($) {

    var _slice = [].slice;

    // Gets or creates a deferred object for `name` and adds it to
    // the `deferreds` object.
    function _deferred(name, reset) {
        var deferred;
        if (!(deferred = this._deferreds[name])) {
            deferred = this._deferreds[name] = $.Deferred();
        } else if (reset) {
            if (deferred.state() == 'pending') {
                throw new Error('Cannot reset a deferred when pending');
            }
            deferred = this._deferreds[name] = $.Deferred();
        }
        return deferred;
    }
    
    // Proxies promise-based methods to promiser. Also takes an object
    // of name/handler pairs. The latter invocation does not return a
    // promise while the former does.
    function _proxy(method, name) {
        if (typeof name == 'object') {
            var key;
            for (key in name) {
                _proxy.call(this, method, key, name[key]);
            }
        } else {
            var _args = _slice.call(arguments, 2),
                _ref = _deferred.call(this, name);
            return _ref[method].apply(_ref, _args).promise();
        }
    }

    function promiser(object) {
        // Called with new
        if (this.constructor === promiser) {
            this._deferreds = {};
        } else {
            object = object || {};
            object._deferreds = {};
            $.extend(object, promiser.prototype);
            return object;
        }
    }

    promiser.prototype = {

        constructor: promiser,

        has: function(name) {
            return !!this._deferreds[name];
        },

        state: function(name) {
            if (!this.has(name)) return;
            var args = _slice.call(arguments, 1);
            return _deferred.call(this, name).state.apply(this, args);
        },

        isPending: function(name) {
            return this.state(name) == 'pending';
        },

        isResolved: function(name) {
            return this.state(name) == 'resolved';
        },

        isRejected: function(name) {
            return this.state(name) == 'rejected';
        },

        done: function() {
            var args = ['done'].concat(_slice.call(arguments));
            return _proxy.apply(this, args);
        },

        then: function() {
            var args = ['then'].concat(_slice.call(arguments));
            return _proxy.apply(this, args);
        },

        fail: function() {
            var args = ['fail'].concat(_slice.call(arguments));
            return _proxy.apply(this, args);
        },

        always: function() {
            var args = ['always'].concat(_slice.call(arguments));
            return _proxy.apply(this, args);
        },

        pipe: function() {
            var args = ['pipe'].concat(_slice.call(arguments));
            return _proxy.apply(this, args);
        },

        progress: function() {
            var args = ['progress'].concat(_slice.call(arguments));
            return _proxy.apply(this, args);
        },

        resolve: function(name) {
            if (!this.has(name)) return;
            var args = _slice.call(arguments, 1);
            _deferred.call(this, name).resolve.apply(this, args);
            return this;
        },

        resolveWith: function(name) {
            if (!this.has(name)) return;
            var args = _slice.call(arguments, 1);
            _deferred.call(this, name).resolveWith.apply(this, args);
            return this;
        },

        reject: function(name) {
            if (!this.has(name)) return;
            var args = _slice.call(arguments, 1);
            _deferred.call(this, name).reject.apply(this, args);
            return this;
        },

        rejectWith: function(name) {
            if (!this.has(name)) return;
            var args = _slice.call(arguments, 1);
            _deferred.call(this, name).rejectWith.apply(this, args);
            return this;
        },

        notify: function(name) {
            if (!this.has(name)) return;
            var args = _slice.call(arguments, 1);
            _deferred.call(this, name).notify.apply(this, args);
            return this;
        },

        notifyWith: function(name) {
            if (!this.has(name)) return;
            var args = _slice.call(arguments, 1);
            _deferred.call(this, name).notifyWith.apply(this, args);
            return this;
        },

        promise: function(name) {
            var args = _slice.call(arguments, 1);
            return _deferred.call(this, name).promise.apply(this, args);
        },

        when: function() {
            var i, deferreds = [];
            for (i = 0; i < arguments.length; i++) {
                deferreds.push(_deferred.call(this, arguments[i]));
            }
            return jQuery.when.apply(this, deferreds);
        },

        reset: function(name) {
            _deferred.call(this, name, true);
            return this;
        }

    };

    return promiser(promiser);

}));
