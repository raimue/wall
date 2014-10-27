/*
 * Wall
 */

var wall = wall || {};
wall.util = wall.util || {};
(function(ns) {

/* ==== EventTarget ==== */

ns.EventTarget = function() {
    this._eventListeners = {};
};

/**
 * Event target.
 *
 * Inspired by the DOM specification (see
 * http://dom.spec.whatwg.org/#interface-eventtarget ).
 */
ns.EventTarget.prototype = Object.create(Object.prototype, {
    addEventListener: {value: function(type, listener) {
        if (!this._eventListeners.hasOwnProperty(type)) {
            this._eventListeners[type] = [];
        }
        var listeners = this._eventListeners[type];
        if (listeners.indexOf(listener) === -1) {
            listeners.push(listener);
        }
    }},

    removeEventListener: {value: function(type, listener) {
        var listeners = this._eventListeners[type] || [];
        var index = listeners.indexOf(listener);
        if (index === -1) {
            throw new Error("listener_unknown");
        }
        listeners.splice(index, 1);
    }},

    dispatchEvent: {value: function(event) {
        event.target = this;
        var listeners = this._eventListeners[event.type] || [];
        for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i];
            listener.call(this, event);
        }
    }}
});

/* ==== Event ==== */

ns.Event = function(type, args) {
    args = args || {};
    this.type = type;
    this.target = null;
    this.args = args;
};

/* ==== ConfigurationError ==== */

ns.ConfigurationError = function(message) {
    this.message = message || null;
};

ns.ConfigurationError.prototype = Object.create(Error.prototype);

/* ==== */

ns.cloneChildNodes = function(node) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < node.childNodes.length; i++) {
        fragment.appendChild(node.childNodes[i].cloneNode(true));
    }
    return fragment;
};

/**
 * TODO: document
 */
ns.send = function(request, data) {
    var data = data || null;
    return new Promise(function(resolve, reject) {
        request.onload = function() {
            resolve(request);
        };
        request.onerror = function() {
            reject(request);
        }
        request.send(data);
    });
};

ns.isArray = function(value, itemType) {
    return value instanceof Array &&
        value.every(function(i) { return typeof i === itemType });
};

ns.createSet = function(array) {
    var set = new Set();
    for (var i = 0; i < array.length; i++) {
        set.add(array[i]);
    }
    return set;
};

}(wall.util));
