/**
 * @fileoverview A simple static blog with AJAX.
 * @author Jak Wings
 * @license The MIT License (MIT)
 * @preserve Copyright (c) 2013 Jak Wings
 */
'use strict';


/** Load dependencies. */
var MINI = require('minified');

MINI.$(function () {
  var blog = require('blog');
  blog.init();
});
