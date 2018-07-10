'use strict';

var Intercept = require('../src/intercept.js');
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
