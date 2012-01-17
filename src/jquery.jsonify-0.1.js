(function($, undefined) {

    "use strict";

    var getters = {};

    function jsonify(element, options) {

        var json, root, getPath, getValue, getFormattedValue;

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
            if (item.data('jsonify-getter')) {
                return getters[item.data('jsonify-getter')].apply(item) || options.getters[item.data('jsonify-getter')].apply(item);
            } else if (item.is('input[type="checkbox"],input[type="radio"]')) {
                return item.is(':checked');
            } else if (item.is('select')) {
                return item.val() == '' ? null : item.val();
            } else {
                return item.val();
            }
        };
        
        getFormattedValue = function (item) {
            var value = getValue(item);
            
            if (item.data('type-int') !== undefined) {
                return parseInt(value);
            } else if (item.data('type-boolean') !== undefined) {
                return value === 1 || value === "1" || value === true || value === "true" || value === "yes";
            } else {
                return value;   
            }
        }

        element.find('[data-jsonify-name]').each(function () {

            var path = getPath($(this)), parts = path.split('.'), i = 0, l = parts.length, part, name, ai, value;

            json = root;

            for (i; i < l; i += 1) {
                part = parts[i];

                if (i === l - 1) {
                    value = getFormattedValue($(this));
                } else {
                    value = {};
                }

                if (part.substr(-1) === ']') {
                    name = part.split('[')[0];
                    // array index
                    ai = part.match(/([0-9]+)\]$/)[1];
                } else {
                    name = part;
                    ai = null;
                }

                if (ai === null) {
                    // no array

                    if (!json[name]) {
                        json[name] = value;
                    }

                    json = json[name];

                } else {
                    // array

                    if (!json[name]) {
                        json[name] = [];
                    }
                    if (!json[name][ai]) {
                        json[name][ai] = value;
                    }

                    json = json[name][ai];
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