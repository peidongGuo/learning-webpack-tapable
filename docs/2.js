function anonymous(name, age, _callback) {
  var _context;
  var _x = this._x;
  function next2() {
    var _fn2 = _x[2];
    _fn2(name, age, function () {
      if (--_counter === 0) {
        _callback();
      }
    });
  }
  function next1() {
    var _fn1 = _x[1];
    _fn1(name, age, function () {
      if (--_counter === 0) {
        next2();
      }
    });
  }
  function next0() {
    var _fn0 = _x[0];
    _fn0(name, age, function () {
      if (--_counter === 0) {
        next1();
      }
    });
  }
}
