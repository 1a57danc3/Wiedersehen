/**
 * @fileoverview Weakened YAML Parser ;-)
 * @author Jak Wings
 * @license The MIT License (MIT)
 * @preserve Copyright (c) 2013 Jak Wings
 */
'use strict';


(function () {
  /**
   * Parses text into string (default), number (float), boolean or Array.
   * @param {string} value
   * @return {(string|number|boolean|Array)}
   */
  var parseText = function (text) {
    var text = text.replace(/(^\s*|\s*$)/g, '');
    var match;
    if (match = text.match(/^"(.*)"$/)) {
      return match[1];
    } else if (match = text.match(/^(\d+(?:\.\d+)?(?:e\d+)?)$/i)) {
      return parseFloat(match[1]);
    } else if (match = text.match(/^(true|false)$/i)) {
      return /^t/.test(match[1]);
    } else if (match = text.match(/^\[\s*(.*)\s*\]$/)) {
      return match[1].split(/\s*,\s*/).map(parseText);
    } else {
      return text;
    }
  };
  /**
   * Parses multiline text content. It will ignore invalid data.
   * @param {string} text
   * @return {Object}
   */
  var parseFunc = function (text) {
    var matches = text.split(/[\r\n]+/).map(function (line) {
      return line.match(/^\s*(\w+)\s*:(.+)$/);
    });
    var result = {};
    for (var i = 0, l = matches.length; i < l; i++) {
      var info = matches[i];
      if (!info) {
        continue;
      }
      var name = info[1];
      var value = parseText(info[2]);
      result[name] = value;
    }
    return result;
  };
  if (typeof define !== 'undefined' && define instanceof Function) {
    define('yamlminus', function () {
      return {parse: parseFunc};
    });
  } else {
    this.yamlminus = {parse: parseFunc};
  }
})();
