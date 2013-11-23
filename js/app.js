/**
 * @fileoverview A simple static blog with AJAX.
 * @author Jak Wings
 * @license The MIT License (MIT)
 * @preserve Copyright (c) 2013 Jak Wings
 */
'use strict';


/** Load dependencies. */
var MINI = require('minified');
var $, $$, EE, HH, _, yamlminus, marked;

MINI.$(function () {
  $ = MINI.$;
  $$ = MINI.$$;
  EE = MINI.EE;
  HH = MINI.HTML;
  _ = MINI._;
  yamlminus = require('yamlminus');
  marked = require('marked');

  var blog = require('blog');
  blog.init();
});
