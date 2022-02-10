(function anonymous(name, age) {
  "use strict";
  var _context;
  var _x = this._x;
  return new Promise(function (_resolve, _reject) {
    var _sync = true;
    function _error(_err) {
      if (_sync)
        _resolve(
          Promise.resolve().then(function () {
            throw _err;
          })
        );
      else _reject(_err);
    }
      var _counter = 3;
      var _done = function () {
        _resolve();
      };
      if (_counter <= 0) break;
      var _fn0 = _x[0];
      var _hasResult0 = false;
      var _promise0 = _fn0(name, age);
      if (!_promise0 || !_promise0.then)
        throw new Error(
          "Tap function (tapPromise) did not return promise (returned " +
            _promise0 +
            ")"
        );
      _promise0.then(
        function (_result0) {
          _hasResult0 = true;
          if (--_counter === 0) _done();
        },
        function (_err0) {
          if (_hasResult0) throw _err0;
          if (_counter > 0) {
            _error(_err0);
            _counter = 0;
          }
        }
      );
      
    _sync = false;
  });
});
