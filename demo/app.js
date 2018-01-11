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


var intercept = __webpack_require__(1);

intercept.init({
  addDOM: function addDOM() {},
  removeDOM: function removeDOM() {},
  testEle: (function() {
    return document.getElementById('test');
  })(),
  height: 100
  // judgeHeight: function judgeHeight() {
  //   if (document.getElementById('test').offsetHeight > 44) {
  //     return false;
  //   }
  //   return true;
  // }
});

var test =
  '324523462392734623789065723046789023560678923450678234657823469756987235967823469785236947567892495678236847580267345623495169284915249152491625747123548127346512637496739461234512396746';

var res = intercept.exec([test]);
console.log(res);

// const addDOM = function addDOM() {
//     $testOutter.show();
// };
// const removeDOM = function removeDOM() {
//     $testOutter.hide();
// };


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var OPTIONS = {
  gap: 4,
  height: 0,
  testEle: null
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
var bisection = function bisection(val, startIndex, endIndex, judgeFunc, n, options) {
  // always less than the true value
  if (endIndex - startIndex <= n) {
    return startIndex;
  }

  var s = startIndex;
  var e = endIndex;
  var index = Math.floor((s + e) / 2);

  if (judgeFunc(val.substr(0, index), options)) {
    // index is less than real value
    s = index;
  } else {
    e = index;
  }

  return bisection(val, s, e, judgeFunc, n, options);
};

// TODO can be set
/**
 * core function, for judging height
 * @param {string} val the raw val needed to judge
 * @param {Object} options options
 */
var judgeHeight = function judgeHeight(val, options) {
  var ele = options.testEle;
  ele.innerText = val;
  return ele.offsetHeight <= 30; // options.height;
};

/**
 * core func for step forward algorithm
 * @param {string} rawVal raw val
 * @param {number} index the default index
 * @param {number} gap the gap for step forward
 */
var computeAdd = function computeAdd(rawVal, index, gap) {
  var i = index === null ? 0 : index;
  return {
    v: rawVal.substr(0, i + gap),
    index: i + gap
  };
};

/**
 * convert text
 * @param {string} val raw value
 * @param {Object} options options
 */
var convertText = function convertText(val, options) {
  if (judgeHeight(val, options)) {
    // needn't convert
    return;
  }

  var v = val;

  // bisection
  var index = bisection(v, 0, v.length, judgeHeight, computeN(options.gap), options);
  v = val.substr(0, index);

  // get the real by step forward
  while (judgeHeight(v, options)) {
    var tmp = computeAdd(val, index, options.gap);
    v = tmp.v;
    index = tmp.index;
  }
  // TODO 注入自己的substr方法
  v = v.substr(0, index - options.gap);
  // v = `${mySubStr(v.substr(0, index - CONFIG.gap), 6)}...`;

  return v;
};

var intercept = (function intercept() {
  var options = {};

  return {
    init: function init(option) {
      options = Object.assign({}, OPTIONS, options, option);
    },

    // bind new testEle
    bind: function bind(testEle) {
      options.testEle = testEle;
    },

    /** the core func of the module
     *  @param {Array} list text list contains all the text that need intercept
     */
    exec: function exec(list) {
      if (judgeIfIsFunc(options, 'addDOM')) {
        options.addDOM();
      }

      var arr = [];
      arr.length = list.length;
      list.forEach(function(item, index) {
        arr[index] = convertText(item, options);
      });

      if (judgeIfIsFunc(options, 'removeDOM')) {
        options.removeDOM();
      }

      return arr;
    }
  };
})();

module.exports = intercept;


/***/ })
/******/ ]);