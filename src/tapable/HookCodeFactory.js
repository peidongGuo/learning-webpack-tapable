class HookCodeFactory {
  setup(hookInstance, options) {
    hookInstance._x = options.taps.map((tapInfo) => tapInfo.fn);
  }

  init(options) {
    this.options = options;
  }

  deinit() {
    this.options = null;
  }

  args(options = {}) {
    let { before, after } = options;
    let allArgs = this.options.args || [];
    if (before) allArgs = [before, ...allArgs];
    if (after) allArgs = [...allArgs, after];
    if (allArgs.length > 0) {
      return allArgs.join(",");
    }
    return "";
  }

  header() {
    let code = ``;
    code += ` var _context;
            var _x = this._x;
         `;

    return code;
  }

  callTapSeries() {
    let code = "";
    let taps = this.options.taps;
    for (let i = 0; i < taps.length; i++) {
      code += this.callTap(i);
    }
    return code;
  }

  callTapParallel() {
    let code = "";
    let taps = this.options.taps;
    if (taps.length === 0) {
      return code;
    }
    switch (this.options.type) {
      case "async":
        code += `let _counter=${taps.length};\n`;
        code += `let _done=function(){_callback()};\n`;
        for (let i = 0; i < taps.length; i++) {
          code += this.callTap(i);
        }
        break;
      case "promise":
        code += `return new Promise(function (_resolve, _reject) {
            var _sync = true;
            function _error(_err) {
              if (_sync)
                _resolve(
                  Promise.resolve().then(function () {
                    throw _err;
                  })
                );
              else _reject(_err);
            }`;
        code += `let _counter=${taps.length};\n`;
        code += `let _done=function(){_resolve()};\n`;
        for (let i = 0; i < taps.length; i++) {
          code += this.callTap(i);
        }
        code += `_sync = false; \n });`;
        break;
      default:
        break;
    }

    return code;
  }

  callTap(index) {
    let code = "";
    switch (this.options.type) {
      case "sync":
        code = `var _fn${index}=_x[${index}];\n`;
        code += `_fn${index}(${this.args()});\n`;
        break;
      case "async":
        code = `var _fn${index}=_x[${index}];\n`;
        code += `_fn${index}(${this.args()},function(){
          if(--_counter===0){
            _done();
          }
        });\n`;
        break;
      case "promise":
        code += `var _fn${index} = _x[${index}];
        var _hasResult${index} = false;
        var _promise${index} = _fn${index}(name, age);
        if (!_promise${index} || !_promise${index}.then)
          throw new Error(
            "Tap function (tapPromise) did not return promise (returned " +
              _promise${index} +
              ")"
          );
        _promise${index}.then(
          function (_result${index}) {
            _hasResult${index} = true;
            if (--_counter === 0) _done();
          },
          function (_err${index}) {
            if (_hasResult${index}) throw _err${index};
            if (_counter > ${index}) {
              _error(_err${index});
              _counter = ${index};
            }
          }
        );`;
        break;
      default:
        break;
    }
    return code;
  }
  create(options) {
    this.init(options);
    let fn;
    switch (this.options.type) {
      case "sync":
        fn = new Function(this.args(), this.header() + this.content());
        break;
      case "async":
        fn = new Function(
          this.args({ after: "_callback" }),
          this.header() + this.content()
        );
        break;
      case "promise":
        fn = new Function(this.args(), this.header() + this.content());
        break;
      default:
        break;
    }
    this.deinit();
    return fn;
  }

  content() {
    throw new Error("Abstract: Should be override!");
  }
}

module.exports = HookCodeFactory;
