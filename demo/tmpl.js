'use strict';

var intercept = require('../src/intercept.js');

intercept.init({
  gap: 1,
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
