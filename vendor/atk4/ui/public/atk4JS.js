(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("atk4JS", [], factory);
	else if(typeof exports === 'object')
		exports["atk4JS"] = factory();
	else
		root["atk4JS"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Handle api server response.
 */

(function ($, window, document, undefined) {

    $.fn.api.settings.onResponse = function (response) {
        if (response.success) {
            try {
                if (response && response.html && response.id) {
                    var result = $('#' + response.id).replaceWith(response.html);
                    if (!result.length) {
                        throw { message: 'Unable to replace element with id: ' + response.id };
                    }
                }
                if (response && response.eval) {
                    var result = function () {
                        eval(response.eval.replace(/<\/?script>/g, ''));
                    }.call(this.obj);
                }
                return { success: true };
            } catch (e) {
                //send our eval or replaceWith error to successTest
                return { success: false, error: 'Error in ajax replace or eval:\n' + e.message };
            }
        } else {
            //catch application error and display them in a new modal window.
            var m = $("<div>").appendTo("body").addClass("ui scrolling modal").html(response.message);
            m.modal({ duration: 100, onHide: function onHide() {
                    m.children().remove();return true;
                } }).modal("show");
            return { success: true };
        }
    };

    $.fn.api.settings.successTest = function (response) {
        if (response.success) {
            this.data = {};
            return true;
        } else if (response.error) {
            alert(response.error);
            return true;
        } else {
            return false;
        }
    };

    $.fn.api.settings.onFailure = function (response) {
        var w = window.open(null, 'Error in JSON response', 'height=1000,width=1100,location=no,menubar=no,scrollbars=yes,status=no,titlebar=no,toolbar=no');
        if (w) {
            w.document.write('<h5>Error in JSON response</h5>');
            w.document.write(response);
            w.document.write('<center><input type=button onclick="window.close()" value="Close"></center>');
        } else {
            alert("Error in ajaxec response" + response);
        }
    };
})(jQuery, window, document);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = plugin;
/* https://gist.github.com/monkeymonk/c08cb040431f89f99928132ca221d647 */

/**
 * Generate a jQuery plugin
 * @param pluginName [string] Plugin name
 * @param className [object] Class of the plugin
 * @param shortHand [bool] Generate a shorthand as $.pluginName
 *
 * @example
 * import plugin from 'plugin';
 *
 * class MyPlugin {
 *     constructor(element, options) {
 *         // ...
 *     }
 * }
 *
 * MyPlugin.DEFAULTS = {};
 *
 * plugin('myPlugin', MyPlugin);
 */
function plugin(pluginName, className) {
    var shortHand = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var dataName = '__' + pluginName;
    var old = $.fn[pluginName];

    $.fn[pluginName] = function (option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data(dataName);
            var options = $.extend({}, className.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object' && option);

            if (!data || $.isEmptyObject(data)) {
                $this.data(dataName, data = new className(this, options));
            }

            if (typeof option === 'string') {
                data[option]();
            }
        });
    };

    // - Short hand
    if (shortHand) {
        $[pluginName] = function (options) {
            return $({})[pluginName](options);
        };
    }

    // - No conflict
    $.fn[pluginName].noConflict = function () {
        return $.fn[pluginName] = old;
    };
}
module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var addParams = function addParams(element, options) {
    _classCallCheck(this, addParams);

    var url = options.url;
    if (!$.isEmptyObject(options.params)) {
        url += (url.indexOf('?') >= 0 ? '&' : '?') + $.param(options.params);
    }

    return url;
};

exports.default = addParams;


addParams.DEFAULTS = {
    url: null,
    params: {}
};
module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ajaxec = function ajaxec(element, options) {
    _classCallCheck(this, ajaxec);

    var $element = $(element);

    // ask for user confirmation just before
    if (options.confirm) {
        if (!confirm(options.confirm)) {
            return;
        }
    }

    $element.api({
        on: 'now',
        url: options.uri,
        data: options.uri_options,
        method: 'POST',
        obj: $element
    });
};

exports.default = ajaxec;


ajaxec.DEFAULTS = {
    uri: null,
    uri_options: {},
    confirm: null
};
module.exports = exports['default'];

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var createModal = function () {
  function createModal(element, options) {
    _classCallCheck(this, createModal);

    var $m = $('<div class="atk-modal ui modal scrolling"/>').appendTo('body').html(this.getDialogHtml(options.title));

    $m.modal($.extend({
      onHide: function onHide(el) {
        return true;
      },
      onHidden: function onHidden() {
        $m.remove();
      },
      onVisible: function onVisible() {
        $.getJSON(options.uri, options.uri_options, function (resp) {
          $m.find('.atk-dialog-content').html(resp.html);
          var result = function () {
            eval(resp.eval.replace(/<\/?script>/g, ''));
          }.call(this.obj);
        }).fail(function () {
          console.log('Error loading modal content.');
        });
        $m.on("close", '.atk-dialog-content', function () {
          $m.modal('hide');
        });
      } }, options.modal)).modal('show');
  }

  _createClass(createModal, [{
    key: 'getDialogHtml',
    value: function getDialogHtml(title) {
      return '<i class="close icon"></i>\n          <div class="header">' + title + '</div>\n          <div class="image content atk-dialog-content">\n            <div class="ui active inverted dimmer">\n              <div class="ui text loader">Loading</div>\n            </div>\n          </div>';
    }
  }]);

  return createModal;
}();

exports.default = createModal;


createModal.DEFAULTS = {
  title: '',
  uri: null,
  uri_options: {},
  modal: {
    duration: 100
  }
};
module.exports = exports['default'];

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var reloadView = function reloadView(element, options) {
    _classCallCheck(this, reloadView);

    var $element = $(element);

    $element.spinner({
        'loaderText': '',
        'active': true,
        'inline': true,
        'centered': true,
        'replace': false });

    if (options.uri) {
        $element.api({
            on: 'now',
            url: options.uri,
            data: options.uri_options,
            method: 'GET',
            obj: $element
        });
    }
};

exports.default = reloadView;


reloadView.DEFAULTS = {
    uri: null,
    uri_options: {}
};
module.exports = exports['default'];

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var spinner = function () {
    function spinner(element, options) {
        _classCallCheck(this, spinner);

        var $element = $(element);

        // Remove any existing dimmers/spinners
        $element.remove('.dimmer');
        $element.remove('.spinner');

        var $baseDimmer = $(options.baseDimmerMarkup);
        var $baseLoader = $(options.baseLoaderMarkup);

        var $finalSpinner = null;

        $baseLoader.toggleClass('active', options.active);
        $baseLoader.toggleClass('indeterminate', options.indeterminate);
        $baseLoader.toggleClass('centered', options.centered);
        $baseLoader.toggleClass('inline', options.inline);

        var isText = !!options.loaderText;
        if (isText) {
            $baseLoader.toggleClass('text', true);
            $baseLoader.text(options.loaderText);
        }

        if (options.dimmed) {
            $baseDimmer.toggleClass('active', options.active);
            $finalSpinner = $baseDimmer.append($baseLoader);
        } else {
            $finalSpinner = $baseLoader;
        }

        // If replace is true we remove the existing content in the $element.
        this.showSpinner($element, $finalSpinner, options.replace);
    }

    _createClass(spinner, [{
        key: 'showSpinner',
        value: function showSpinner($element, $spinner) {
            var replace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            if (replace) $element.empty();

            $element.append($spinner);
        }
    }]);

    return spinner;
}();

exports.default = spinner;


spinner.DEFAULTS = {
    active: false,
    replace: false,
    dimmed: false,
    inline: false,
    indeterminate: false,
    loaderText: 'Loading',
    centered: false,
    baseDimmerMarkup: '<div class="ui dimmer"></div>',
    baseLoaderMarkup: '<div class="ui loader"></div>'
};
module.exports = exports['default'];

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(0);

var _plugin = __webpack_require__(1);

var _plugin2 = _interopRequireDefault(_plugin);

var _spinner = __webpack_require__(6);

var _spinner2 = _interopRequireDefault(_spinner);

var _reloadView = __webpack_require__(5);

var _reloadView2 = _interopRequireDefault(_reloadView);

var _ajaxec = __webpack_require__(3);

var _ajaxec2 = _interopRequireDefault(_ajaxec);

var _addParams = __webpack_require__(2);

var _addParams2 = _interopRequireDefault(_addParams);

var _createModal = __webpack_require__(4);

var _createModal2 = _interopRequireDefault(_createModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Register our plugins
(0, _plugin2.default)('spinner', _spinner2.default);

// Import our plugins

(0, _plugin2.default)('reloadView', _reloadView2.default);
(0, _plugin2.default)('ajaxec', _ajaxec2.default);
(0, _plugin2.default)('addParams', _addParams2.default, true);
(0, _plugin2.default)('createModal', _createModal2.default);

/***/ })
/******/ ]);
});
//# sourceMappingURL=atk4JS.js.map