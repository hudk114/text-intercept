'use strict';

var intercept = require('../src/intercept.js');

intercept.init({
  gap: 1,
  // addDOM: function addDOM() {
  //   document.getElementById('test').style = 'block';
  // },
  // removeDOM: function removeDOM() {
  //   document.getElementById('test').style = 'none';
  // },
  testEle: function () {
    return document.getElementById('test');
  }(),
  height: 70,
  judgeHeight: function judgeHeight(val) {
    document.getElementById('test').innerText = val;
    return document.getElementById('test').offsetHeight <= 60;
  }
});

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
    var res = intercept.exec([text]);

    console.log(res);
    document.getElementById('resultInput').value = res[0];
  });
};

window.onload = function () {
  bind();
};
