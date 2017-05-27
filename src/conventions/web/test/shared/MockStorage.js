"use strict";

const MockStorage = (function() {
    let storage = {};
    return {
        setItem: function(key, value) {
            storage[key] = value || "";
        },
        getItem: function(key) {
            return storage[key];
        },
        removeItem: function(key) {
            delete storage[key];
        },
        get length() {
            return Object.keys(storage).length;
        },
        key: function(i) {
            let keys = Object.keys(storage);
            return keys[i] || null;
        }
    };
})();
Object.defineProperty(window, "localStorage", {value: MockStorage});
Object.defineProperty(window, "sessionStorage", {value: MockStorage});


// Exports
module.exports = MockStorage;
