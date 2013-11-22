/**
 * @fileoverview Blog renderer.
 * @author Jak Wings
 * @license The MIT License (MIT)
 * @preserve Copyright (c) 2013 Jak Wings
 */
'use strict';


define('blog.render', function () {
  var window, document, ENV;
  /**
   * Stores the timestamp of AJAX operation to solve asynchronization conflicts.
   * @type {number}
   */
  var ajax_timestamp = 0;
  /**
   * Sets new title for document/tab title.
   * @param {string=} opt_title Page title
   * @default ENV.config.title
   * @return {void}
   */
  var setDocumentTitle = function (opt_title) {
    document.title = opt_title || ENV.config.title;
  };
  /**
   * Sets main title and subtitle.
   * @return {void}
   */
  var setTitles = function () {
    var $title = $('#title:not(.in)');
    if ($title.length > 0) {
      $title.ht('<a href="{{url}}">{{text}}</a>', {
        url: ENV.BASE_URL,
        text: ENV.config.title || 'NO TITLE'
      }).set('$', '+in');
      $('#subtitle').fill(ENV.config.subtitle || '').set('$', '+in');
    }
  };
  /**
   * Sets license information.
   * @return {void}
   */
  var setLicense = function () {
    var $license = $('#license:empty');
    if ($license.length > 0) {
      $license.ht('<a href="{{url}}" class="muted">{{text}}</a>',
          ENV.config.license);
    }
  };
  /**
   * Adds site links
   * @return {void}
   */
  var addSiteLinks = function () {
    var $menu = $('#links');
    if ($menu.trav('nextSibling', '.link-item').length > 0) {
      return;
    }
    /** @type {Array.<{{text, url}}>} */
    var list = ENV.config.links || [];
    for (var i = list.length - 1; i >= 0; i--) {
      $menu.addAfter(HH(ENV.templates_.linkItem, list[i]));
    }
  };
  /**
   * Adds Menu Items
   * @return {void}
   */
  var addMenuItems = function () {
    var $menu = $('#menu');
    if ($menu.trav('nextSibling', '.menu-item').length > 0) {
      return;
    }
    /** @type {Array.<{{text, url, file}}>} */
    var list = ENV.config.menu || [];
    for (var i = list.length - 1; i >= 0; i--) {
      $menu.addAfter(HH(ENV.templates_.menuItem, {
        text: list[i].text,
        url: ENV.HASH_CAP + list[i].url
      }));
    }
  };
  /**
   * Switches menu item.
   * @param {string} hash
   * @return {void}
   */
  var switchMenuItem = function (hash) {
    $('#sidebar-left .menu-item').set('$', '-active').
        select('a[href="' + hash + '"]').
        trav('parentNode', '.menu-item', 1).
        set('$', '+active');
  };
  /**
   * Toggles article navigator
   * @param {string=} opt_url
   * @default undefined
   * @return {void}
   */
  var toggleArticleNavigator = function (opt_url) {
    var $navigator = $('#sidebar-left .navigator.fade');
    var hasPrev;
    var hasNext;
    if (opt_url) {
      hasPrev = getArticleUrlByOffset(opt_url, -1);
      hasNext = getArticleUrlByOffset(opt_url, 1);
      $navigator.select('.previous').
          set('$', hasPrev ? '-disabled' : '+disabled');
      $navigator.select('.next').
          set('$', hasNext ? '-disabled' : '+disabled');
    }
    $navigator.set('$', (hasPrev || hasNext) ? '-shrink +in' : '+shrink -in');
  };
  /**
   * Loads article titles and replace the content.
   * @return {void}
   */
  var loadArticleTitles = function () {
    var list = ENV.config.articles || [];
    var $content = $('#content');
    var $listContainer = EE('ul', {$: 'contents nav nav-tabs nav-stacked'});
    for (var i = 0, l = list.length; i < l; i++) {
      $listContainer.addFront(HH(ENV.templates_.listTitle, {
        title: list[i].title,
        url: ENV.HASH_CAP + list[i].url
      }));
    }
    $content.fill($listContainer);
  };
  /**
   * Loads page content according to hash tags.
   * @param {string} oldHash old hash tag
   * @param {string} newHash new hash tag
   * @return {void}
   */
  var loadPage = function (oldHash, newHash) {
    var url = newHash.substring(ENV.HASH_CAP.length);
    var fileUrl = getArticleFileUrl(url);
    if (fileUrl) {
      $('#content').ht('<p class="muted">loading...</p>');
      var timestamp = Date.now();
      ajax_timestamp = timestamp;
      $.request('get', fileUrl).
          then(function (text) {
            if (timestamp !== ajax_timestamp) {
              return;
            }
            switchMenuItem(newHash);
            loadPageContent(text);
            toggleArticleNavigator(url);
            togglePageComments(url);
          }).
          error(goError.bind(null, oldHash, newHash));
    } else {
      goError(oldHash, newHash);
    }
  };
  /**
   * Replaces the content with page content
   * @param {string} text raw content
   * @return {void}
   */
  var loadPageContent = function (text) {
    marked.setOptions({
      //highlight: function (code, lang, callback) {
      //  callback(null, code);
      //},
      gfm: false,
      tables: false,  //need gfm
      breaks: false,  //need gfm
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false,
      langPrefix: 'lang-'
    });
    var delimiter = /[\r\n]+---[\r\n]+/;
    var pos = text.search(delimiter);
    var metas = yamlminus.parse(text.substring(0, pos));
    metas.content = marked(text.substring(pos).replace(delimiter, ''));
    var $content = $('#content');
    if (metas.created) {
      $content.ht(ENV.templates_.article, metas);
    } else {
      $content.ht(ENV.templates_.page, metas);
    }
    setDocumentTitle(metas.title + ' - ' + ENV.config.title);
  };
  /**
   * Toggles page comments
   * @param {string=} opt_url url as identifier for comment system
   * @default undefined
   * @return {void}
   */
  var togglePageComments = function (opt_url) {
    ENV.DEBUG && opt_url && console.log(opt_url);
    var $comment = $('#main .comments');
    if (opt_url) {
      ENV.config.loadComment(window, $comment[0], opt_url,
          ENV.BASE_URL + ENV.HASH_CAP + opt_url);
      $comment.set('$', '-hide');
    } else {
      $comment.set('$', '+hide').fill();
    }
  };
  /**
   * Returns the page's source file if it exists.
   * @param {string} url
   * @return {string}
   */
  var getArticleFileUrl = function (url) {
    var list = ENV.config.menu.concat(ENV.config.articles);
    for (var i = 0, item; item = list[i]; i++) {
      if (item.url === url) {
        return (item.file || item.url) + '.md';
      }
    }
  };
  /**
   * Returns an article's url from the list by offset
   * @param {string} url
   * @param {number=} opt_offset
   * @default 0
   * @return {?string}
   */
  var getArticleUrlByOffset = function (url, opt_offset) {
    var offset = parseInt(opt_offset, 10) || 0;
    var list = ENV.config.articles;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].url === url) {
        var item = list[i+offset];
        return item && item.url;
      }
    }
  };
  /**
   * Handlers
   */
  var goHome = function (oldHash, newHash) {
    ENV.DEBUG && console.log(arguments);
    setDocumentTitle();
    loadArticleTitles();
    switchMenuItem(newHash);
  };
  var goPage = function (oldHash, newHash) {
    ENV.DEBUG && console.log(arguments);
    loadPage(oldHash, newHash);
  };
  var goShare = function (oldHash, newHash) {
    ENV.DEBUG && console.log(arguments);
  };
  var goNavigator = function (oldHash, newHash) {
    ENV.DEBUG && console.log(arguments);
    var url = oldHash.substr(ENV.HASH_CAP.length);
    var command = newHash.substr(ENV.HASH_ACT.length);
    var newUrl;
    switch (command) {
      case 'prev':
        newUrl = getArticleUrlByOffset(url, -1);
        break;
      case 'next':
        newUrl = getArticleUrlByOffset(url, 1);
        break;
      default: break;
    }
    if (newUrl) {
      goPage(newHash, ENV.HASH_CAP + newUrl);
    } else {
      goError(newHash,  ENV.HASH_CAP + newUrl);
    }
  };
  var goEdit = function (oldHash, newHash) {
    ENV.DEBUG && console.log(arguments);
  };
  var goError = function (oldHash, newHash) {
    ENV.DEBUG && console.log(arguments);
    setDocumentTitle('404 NOT FOUND - ' + ENV.config.title);
    var $button = EE('button', {'$': 'btn btn-link'}, 'click here to go back').
        on('click', function () {
          window.history.back();
        });
    $('#content').ht('<h1 class="muted">404 Not found</h1>').add($button);
  };
  /**
   * Router
   * @param {string} oldHash old hash tag
   * @param {string} newHash new hash tag
   * @return {void}
   */
  var render = function (oldHash, newHash) {
    ENV = this;
    window = ENV.window;
    document = window.document;
    setTitles();
    setLicense();
    addMenuItems();
    addSiteLinks();
    toggleArticleNavigator();
    togglePageComments();
    // first visit with invalid hash tag
    if (oldHash === newHash &&
        newHash.substr(0, ENV.HASH_CAP.length) !== ENV.HASH_CAP &&
        $('#content:empty').length > 0) {
      window.history.replaceState(window.history.state, document.title,
          ENV.BASE_URL);
      goHome(ENV.HASH_CAP, ENV.HASH_CAP);
    }
    // with hash tag of a page
    if (newHash.substr(0, ENV.HASH_CAP.length) === ENV.HASH_CAP) {
      if (newHash === ENV.HASH_CAP) {
        window.history.replaceState(window.history.state, document.title,
            ENV.BASE_URL);
        goHome(oldHash, newHash);
      } else {
        goPage(oldHash, newHash);
      }
    } else if (newHash.substr(0, ENV.HASH_ACT.length) === ENV.HASH_ACT) {
      // with hash tag of an action
      switch (newHash.substr(ENV.HASH_ACT.length)) {
        case 'prev':
        case 'next':
          goNavigator(oldHash, newHash); break;
        case 'share-google':
        case 'share-twitter':
          goShare(oldHash, newHash); break;
        case 'edit':
          goEdit(oldHash, newHash); break;
        default: break;
      }
    }
  };
  return render;
});
