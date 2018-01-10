const OPTIONS = {
  gap: 4,
  height: 0,
  testEle: null
}

// TODO
/** compute the min int for using SAA rather than using bisection
 * log N >= N / gap, get the min N
 * @param {*} gap the min step for the step approach algorithm
 */
const computeN = function computeN(gap) {
  if (gap === 4) {
    return 16
  }
  if (gap === 3) {
    return 9
  }
  if (gap <= 2) {
    return 4
  }
}

// TODO 尾递归优化
const bisection = function bisection(val, startIndex, endIndex, judgeFunc, n) {
  if (endIndex - startIndex <= n) {
    return startIndex
  }

  const index = Math.floor((startIndex + endIndex) / 2)
  let s = startIndex
  let e = endIndex

  if (judgeFunc(val.substr(0, index))) {
    // index is less than height
    s = index
  } else {
    e = index
  }

  return bisection(val, s, e, judgeFunc, n)
}

// TODO
const judgeHeight = function judgeHeight(val, options) {
  const ele = options.testEle
  ele.html(val)
  return ele.height() <= options.height
}

const computeAdd = function computeAdd(val, rawVal, index, gap) {
  const i = index === null ? 0 : index
  return {
    v: rawVal.substr(0, i + gap),
    index: i + gap
  }
}

const converText = function convertText(val, options) {
  if (judgeHeight(val)) {
    // need not change
    return
  }
  let v = val

  // bisection
  let index = bisection(v, 0, v.length, judgeHeight, computeN(options.gap))
  // index always less than the true length
  v = val.substr(0, index)

  while (judgeHeight(v)) {
    const tmp = computeAdd(v, val, index, options.gap)
    v = tmp.v
    index = tmp.index
  }
  // TODO 注入自己的substr方法
  v = v.substr(0, index - options.gap)
  // v = `${mySubStr(v.substr(0, index - CONFIG.gap), 6)}...`;

  return v
}

const intercept = function intercept(option) {
  const options = Object.assign({}, option, OPTIONS)
  // const addVirDOM = function addVirDOM() {
  //     $testOutter.show();
  // };
  // const removeVirDOM = function removeVirDOM() {
  //     $testOutter.hide();
  // };

  return {
    init() {},
    // bind new testEle
    bind(testEle) {
      options.testEle = testEle
    },
    /** the core func of the module
     * @param {*} list text list contains all the text that need intercept
     */
    exec(list) {
      const arr = []
      arr.length = list.length
      list.forEach((item, index) => {
        arr[index] = convertText(item, options)
      })
      return arr
    }
  }

  // addVirDOM();
  // TODO add your code here
  // removeVirDOM();
  // return d;
}

module.export = intercept
