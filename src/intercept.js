'use strict';

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
const stepFor = function stepFor(rawVal, startIndex, judgeHeight, testEle, height, gap) {
  var i = startIndex === null ? 0 : null;
  if (i === 0) {
    return i;
  }

  let v = rawVal.substr(0, i);
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

Intercept.prototype.bind = function(testEle) {
  this.options.testEle = testEle;
};

Intercept.prototype.exec = function(list) {
  if (judgeIfIsFunc(this.options, 'addDOM')) {
    this.options.addDOM();
  }

  var arr = [];
  arr.length = list.length;
  list.forEach((item, index) => {
    arr[index] = convertText(item, this.options);
  });

  if (judgeIfIsFunc(this.options, 'removeDOM')) {
    this.options.removeDOM();
  }

  return arr;
};

module.exports = Intercept;
