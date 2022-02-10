_x = [
  (name, age) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("tapPromise1", name, age);
        resolve("tapPromise1 resolve");
      }, 1000);
    });
  },
  (name, age) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("tapPromise2", name, age);
        resolve("tapPromise2 resolve");
      }, 2000);
    });
  },
  (name, age) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("tapPromise3", name, age);
        resolve("tapPromise3 resolve");
      }, 3000);
    });
  },
];
function test(name, age) {
  return new Promise((_resolve, _reject) => {
    function next0() {
      let fn0 = this._x[0];
      return fn0(name, age);
    }

    function next1() {
      let fn1 = this._x[1];
      return fn1(name, age);
    }

    function next2() {
      let fn2 = this._x[2];
      return fn2(name, age);
    }

    return next0().then((data) => {
      return next1().then((data) => {
        return next2().then((data) => {
          _resolve(data);
        });
      });
    });
  });
}
console.time("test");
test("gpd", "34").then((data) => {
  console.log(data);
  console.timeEnd("test");
});

// (function anonymous(name, age) {
//   "use strict";
//   var _context;
//   var _x = this._x;
//   return new Promise(function (_resolve, _reject) {
//     function _next1() {
//       var _fn2 = _x[2];
//       var _promise2 = _fn2(name, age);
//       _promise2.then(function (_result2) {
//         _resolve();
//       });
//     }
//     function _next0() {
//       var _fn1 = _x[1];
//       var _promise1 = _fn1(name, age);

//       _promise1.then(function (_result1) {
//         _hasResult1 = true;
//         _next1();
//       });
//     }
//     var _fn0 = _x[0];
//     var _promise0 = _fn0(name, age);
//     _promise0.then(function (_result0) {
//       _next0();
//     });
//   });
// });

(function anonymous(name, age) {
  var _context;
  var _x = this._x;
  return new Promise(function (_resolve, _reject) {
    function next2() {
      var _fn2 = _x[2];
      var _promise2 = _fn2(name, age);
      _promise2.then(function (_result2) {
        _resolve(_result2);
      });
    }
    function next1() {
      var _fn1 = _x[1];
      var _promise1 = _fn1(name, age);
      _promise1.then(function (_result1) {
        next2(_result1);
      });
    }
    function next0() {
      var _fn0 = _x[0];
      var _promise0 = _fn0(name, age);
      _promise0.then(function (_result0) {
        next1(_result0);
      });
    }
    next0();
  });
});
