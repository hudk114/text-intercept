'use strict';

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
var bisection = function bisection(val, startIndex, endIndex, judgeFunc, n) {
  // always less than the true value
  if (endIndex - startIndex <= n) {
    return startIndex;
  }

  var s = startIndex;
  var e = endIndex;
  var index = Math.floor((s + e) / 2);

  if (judgeFunc(val.substr(0, index))) {
    // index is less than real value
    s = index;
  } else {
    e = index;
  }

  return bisection(val, s, e, judgeFunc, n);
};

// TODO
/**
 * core function, for judging height
 * @param {string} val the raw val needed to judge
 * @param {Object} options options
 */
var judgeHeight = function judgeHeight(val, options) {
  var ele = options.testEle;
  ele.html(val);
  return ele.height() <= options.height;
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
  if (!judgeIfIsFunc(options.judgeHeight)) {
    throw new Error('TypeError: options.judgeHeight is not function!');
  }

  var judgeHeight = options.judgeHeight;

  if (judgeHeight(val)) {
    // needn't convert
    return;
  }

  var v = val;

  // bisection
  var index = bisection(v, 0, v.length, judgeHeight, computeN(options.gap));
  v = val.substr(0, index);

  // get the real by step forward
  while (judgeHeight(v)) {
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
