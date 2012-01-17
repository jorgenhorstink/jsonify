(function ($) {

    "use strict";

    var getters = {
        "default" : function () {
            if (this.is('input[type="checkbox"],input[type="radio"]')) {
                return this.is(':checked');
            } else if (this.is('select')) {
                return this.val() === '' ? null : this.val();
            } else {
                return this.val();
            }
        }
    };
    
    function jsonify(element, options) {

        var json, root, getPath, getValue, getCastedValue;

        root = json = {};

        getPath = (function () {
            // Performance tuning: If there is no descendent with data-jsonify-array attribute, we can just return the simple jsonify-name
            if (element.find('[data-jsonify-array]').length > 0) {

                // Usefull for repeatable UI components
                return function (item) {
                    var parts = [item.data('jsonify-name')], i, parents;

                    parents = item.parents('[data-jsonify-array-item],[data-jsonify-array]').each(function () {

                        var $this = $(this), item = $this.data('jsonify-array-item'), array = $this.data('jsonify-array');

                        if (item !== undefined) {
                            i = $this.prevAll('[data-jsonify-array-item]').length;
                        } else if (array !== undefined) {
                            parts.push(array + '[' + i + ']');
                        }
                    });

                    return parts.reverse().join('.');
                };
            } else {
                return function (item) {
                    return item.data('jsonify-name');
                };
            }
        }());

        getValue = function (item) {
            var getter, type, value;
            
            if (item.data('jsonify-getter')) {
                
                var parts = item.data('jsonify-getter').split(':');
                
                getter = parts[0] === "" ? "default" : parts[0];
                type = parts[1] || null;

            } else {
                getter = "default";
            }
            
            if (getters[getter]) {
                value = getters[getter].apply(item)
            } else { 
                options.getters[getter].apply(item);
            }

            if (type !== null) {
                value = getCastedValue(type, value);
            }
            
            return value;
        };

        getCastedValue = function (type, value) {
            if (type === 'int') {
                return parseInt(value, 10); // radix paramenter = 10
            } else if (type === 'float') {
                return parseFloat(value, 10); // radix paramenter = 10
            } else if (type === 'boolean' || type === 'bool') {
                return value === 1 || value === "1" || value === true || value === "true" || value === "yes";
            } else {
                return value;
            }
        };

        element.find('[data-jsonify-name]').each(function () {

            var path = getPath($(this)), parts = path.split('.'), i = 0, l = parts.length, part, name, ai, value;

            json = root;

            for (i; i < l; i += 1) {
                part = parts[i];

                if (i === l - 1) {
                    value = getValue($(this));
                } else {
                    value = {};
                }

                if (part.substr(-1) === ']') {
                    // array

                    name = part.split('[')[0];
                    // array index
                    ai = part.match(/([0-9]+)\]$/)[1];

                    // create the empty array if it does not exist yet
                    if (!json[name]) {
                        json[name] = [];
                    }

                    // create the array index if it does not exist yet
                    if (!json[name][ai]) {
                        json[name][ai] = value;
                    }

                    json = json[name][ai];
                } else {
                    // no array

                    name = part;

                    if (!json[name]) {
                        json[name] = value;
                    }

                    json = json[name];
                }
            }
        });

        return root;
    }

    $.fn.jsonify = function (options) {
        var ret = null;

        this.each(function () {
            ret = jsonify($(this), options);
        });

        return ret;
    };

    $.jsonify = function (options) {
        $.extend(getters, options.getters || {});
    };

}(window.jQuery));