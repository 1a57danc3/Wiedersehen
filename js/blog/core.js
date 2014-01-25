/**
 * @fileoverview Blog utilities for routing.
 * @author Jak Wings
 * @license The MIT License (MIT)
 * @preserve Copyright (c) 2013 Jak Wings
 */
'use strict';


(function (window) {
  // only available for browser which supports specified history APIs
  var isBrowser = typeof window !== 'undefined' && window.document;
  if (!isBrowser || !window.history || !window.history.replaceState) {
    define('blog', function () {
      return {init: function () {}};
    });
    return;
  }

  /**
   * @constructor
   * @return {Object}
   */
  var Blog = function () {
    // sets constants
    this.window = window;
    this.document = window.document;
    this.BASE_URL = this.window.location.origin +
        this.window.location.pathname.replace(/\/*$/, '/');
    this.HASH_CAP = '#!/';  // prefix for pages hash tags
  };
  /**
   * Initiates and starts rendering. It can be called only once.
   * @public
   * @param {boolean=} opt_debug opens debug mode?
   * @return {void}
   */
  Blog.prototype.init = function (opt_debug) {
    /**
     * Opens debug mode?
     * @private
     * @type {boolean}
     */
    this.DEBUG = !!opt_debug;
    /**
     * Configurations
     * @public
     * @constant {Object.<string, *>}
     */
    this.config = require('blog.config');
    [].slice.call(this.document.querySelectorAll('#-article-list li')).
        forEach((function (li) {
          var item = {
            url: li.getAttribute('data-url').trim(),
            file: li.getAttribute('data-file').trim(),
            title: li.textContent.trim(),
          };
          this.push(item);
        }).bind(this.config.articles));
    /**
     * Templates
     * @private
     * @constant {Object.<string, string>}
     */
    this.templates_ = require('blog.templates');
    /**
     * Render function (needs blog.templates)
     * @private
     * @type {function(this:Blog, string, string)}
     */
    this.render_ = require('blog.render');

    // registers router on HashChangeEvent
    this.window.addEventListener('hashchange', this.route_.bind(this), false);
    this.route_(this.window.location.hash);

    // destroys the initiator
    this.init = function () {};
  };
  /**
   * Listens and routes URLs (with hash tags).
   * @private
   * @param {(Object|string)} evt HashChangeEvent or hash tag
   * @return {void}
   */
  Blog.prototype.route_ = function (evt) {
    var oldHash;
    var newHash;
    // gets old hash tag and new hash tag
    if (typeof evt !== 'undefined' && evt instanceof Event) {
      var newMatch = evt.newURL.match(/#.*$/);
      var oldMatch = evt.oldURL.match(/#.*$/);
      // empty hash '' will be mapped to HASH_CAP
      newHash = newMatch ? newMatch[0] : this.HASH_CAP;
      oldHash = oldMatch ? oldMatch[0] : this.HASH_CAP;
    } else {
      var window = this.window;
      var queryTag = (window.location.search.match(/\bhtag=([^&\/]+)/) || [])[1];
      if (queryTag) {  // with query string
                       // for compatibility with some comment systems
        oldHash = newHash = this.HASH_CAP + decodeURIComponent(queryTag);
        window.history.replaceState(window.history.state, window.document.title,
            this.BASE_URL + newHash);
      } else {
        newHash = evt || this.HASH_CAP;
        oldHash = window.location.hash || this.HASH_CAP;
      }
    }
    this.DEBUG && console.log(queryTag, oldHash, newHash);
    // wraps the environment (not cloning)
    var env = {};
    for (var k in this) {
      if (!(this[k] instanceof Function)) {
        env[k] = this[k];
      }
    }
    // routes url by hash tags to collect information for rendering
    this.render_.call(env, oldHash, newHash);
  };
  define('blog', function () {
    return new Blog();
  });
})(this);
