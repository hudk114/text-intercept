'use strict';

var intercept = require('../src/intercept.js');

intercept.init({
  gap: 1,
  addDOM: function addDOM() {},
  removeDOM: function removeDOM() {},
  testEle: (function() {
    return document.getElementById('test');
  })(),
  height: 40,
  // judgeHeight(val) {
  //   document.getElementById('test').innerText = val;
  //   return document.getElementById('test').offsetHeight <= 40;
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

const getDOMproperty = function getDOMproperty(id, key) {
  const ele = document.getElementById(id);
  var r = null;
  if (ele && ele[key]) {
    // TODO maybe no need?
    r = JSON.parse(JSON.stringify(ele[key]));
  }
  return r;
};

const bind = function bind() {
  document.getElementById('button').addEventListener('click', () => {
    var text = getDOMproperty('testInput', 'value');
    console.log(text);
  });
};

window.onload = () => {
  bind();
};