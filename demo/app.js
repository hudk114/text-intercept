/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Intercept = __webpack_require__(1);
var intercept = new Intercept({
  gap: 1,
  testEle: function () {
    return document.getElementById('test');
  }(),
  height: 70,
  judgeHeight: function judgeHeight(val, ele, height) {
    document.getElementById('test').innerText = val;
    return document.getElementById('test').offsetHeight <= 60;
  }
})

var getDOMproperty = function getDOMproperty(id, key) {
  var ele = document.getElementById(id);
  var r = null;
  if (ele && ele[key]) {
    // TODO maybe no need?
    r = JSON.parse(JSON.stringify(ele[key]));
  }
  return r;
};

var resetSize = function resetSize() {
  var length = getDOMproperty('resultInput', 'style').width;
  console.log(length);
  document.getElementById('test').style.width = length;
};

var bind = function bind() {
  document.getElementById('button').addEventListener('click', function () {
    resetSize();
    var text = getDOMproperty('testInput', 'value');
    console.log(text)
    var res = intercept.exec([text]);

    console.log(res);
    document.getElementById('resultInput').value = res[0];
  });
};

window.onload = function () {
  bind();
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var OPTIONS = {
  gap: 4,
  height: 0,
  testEle: null,
  judgeHeight: function judgeHeight(val, ele, height) {
    ele.innerText = val;
    return ele.offsetHeight <= height;
  }
};

/**
 * judge obj[key] if function or not
 * @param {Object} obj
 * @param {string} key
 * @returns obj[key] is function or not
 */
var judgeIfIsFunc = function judgeIfIsFunc(obj, key) {
  if (!(obj && obj[key] && typeof obj[key] === 'function')) {
    return false;
  }
  return true;
};

// TODO
/**
 * compute the min int for using SAA rather than using bisection
 * log N >= N / gap, get the min N
 * @param {number} gap the min step for the step approach algorithm
 */
var computeN = function computeN(gap) {
  if (gap === 4) {
    return 16;
  }
  if (gap === 3) {
    return 9;
  }
  if (gap <= 2) {
    return 4;
  }
};

// TODO 尾递归优化
/**
 * bisection func for val
 * @param {string} val the raw val needed to get index
 * @param {number} startIndex start index
 * @param {number} endIndex end index
 * @param {Function} judgeFunc the judge callback for judging if val is valid
 * @param {number} n the step
 */
var bisection = function bisection(val, startIndex, endIndex, judgeFunc, n, testEle, height) {
  // always less than the true value
  if (endIndex - startIndex <= n) {
    return startIndex;
  }

  var s = startIndex;
  var e = endIndex;
  var index = Math.floor((s + e) / 2);

  if (judgeFunc(val.substr(0, index), testEle, height)) {
    // index is less than real value
    s = index;
  } else {
    e = index;
  }

  return bisection(val, s, e, judgeFunc, n, testEle, height);
};

/**
 * step forward algorithm
 * @param {string} rawVal raw string
 * @param {number} startIndex start index, always less than the true val
 * @param {function} judgeHeight cb
 * @param {object} options options
 * @returns {number} index
 */
var stepFor = function stepFor(rawVal, startIndex, judgeHeight, testEle, height, gap) {
  var i = startIndex === null ? 0 : null;
  if (i === 0) {
    return i;
  }

  var v = rawVal.substr(0, i);
  while (judgeHeight(v, testEle, height)) {
    i += gap;
    v = rawVal.substr(0, i);
  }
  return i - gap;
};

/**
 * convert text
 * @param {string} val raw value
 * @param {object} options options
 * @param {string} the intercepted txt
 */
var convertText = function convertText(val, options) {
  var jH = options.judgeHeight;

  if (jH(val, options.testEle, options.height)) {
    // needn't convert
    return val;
  }

  var v = val;

  // bisection
  var index = bisection(v, 0, v.length, jH, computeN(options.gap), options.testEle, options.height);
  // v = val.substr(0, index);

  // get the real by step forward
  index = stepFor(val, index, jH, options.testEle, options.height, options.gap);

  // TODO 注入自己的substr方法
  v = v.substr(0, index);
  // v = `${mySubStr(v.substr(0, index - CONFIG.gap), 6)}...`;

  return v;
};

function Intercept(option) {
  this.options = Object.assign({}, OPTIONS, option);
}

Intercept.prototype.bind = function (testEle) {
  this.options.testEle = testEle;
};

Intercept.prototype.exec = function (list) {
  var _this = this;

  if (judgeIfIsFunc(this.options, 'addDOM')) {
    this.options.addDOM();
  }

  var arr = [];
  arr.length = list.length;
  list.forEach(function (item, index) {
    arr[index] = convertText(item, _this.options);
  });

  if (judgeIfIsFunc(this.options, 'removeDOM')) {
    this.options.removeDOM();
  }

  return arr;
};

module.exports = Intercept;


/***/ })
/******/ ]);