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
            var _taps = this.taps;
            var _interceptors = this.interceptors;
         `;
    for (let index = 0; index < this.options.interceptors.length; index++) {
      code += ` _interceptors[${index}].call(${this.args()});\n`;
    }
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

  // TODO
  callTapSeries2(onDone) {
    let code = "";
    let taps = this.options.taps;
    if (taps.length === 0) {
      return code;
    }
    switch (this.options.type) {
      case "async":
        let current_async = onDone;
        for (let i = taps.length - 1; i > -1; i--) {
          let done = current_async;
          code += `function next${i}(){\n`;
          code += this.callTap(i, done) + "\n";
          code += "}\n";
          current_async = `next${i}`;
        }
        code += "next0(); \n";
        break;
      case "promise":
        code += `return new Promise(function (_resolve, _reject) {   
        `;
        let current_promise = "_resolve";
        for (let i = taps.length - 1; i > -1; i--) {
          let done = current_promise;
          code += `function next${i}(){\n`;
          code += this.callTap(i, done) + "\n";
          code += "}\n";
          current_promise = `next${i}`;
        }
        code += "next0(); \n";
        code += `})`;
        break;
      default:
        break;
    }

    return code;
  }

  callTapParallel(onDone) {
    let code = "";
    let taps = this.options.taps;
    if (taps.length === 0) {
      return code;
    }
    switch (this.options.type) {
      case "async":
        code += `let _counter=${taps.length};\n`;
        code += `let _done=function(){if(--_counter===0){${onDone}()}};\n`;
        for (let i = 0; i < taps.length; i++) {
          code += this.callTap(i, "_done");
        }
        break;
      case "promise":
        code += `return new Promise(function (_resolve, _reject) {
            
            `;
        code += `let _counter=${taps.length};\n`;
        code += `let _done=function(){if(--_counter===0){_resolve()}};\n`;
        for (let i = 0; i < taps.length; i++) {
          code += this.callTap(i, "_done");
        }
        code += `\n });`;
        break;
      default:
        break;
    }

    return code;
  }

  callTap(index, onDone) {
    let code = "";
    code += `var _tap${index} = _taps[${index}];\n`;
    for (let i = 0; i < this.options.interceptors.length; i++) {
      code += ` _interceptors[${i}].tap(_tap${i});\n`;
    }
    switch (this.options.type) {
      case "sync":
        code += `var _fn${index}=_x[${index}];\n`;
        code += `_fn${index}(${this.args()});\n`;
        break;
      case "async":
        code += `var _fn${index}=_x[${index}];\n`;
        code += `_fn${index}(${this.args()},function(){
            ${onDone}();
        });\n`;
        break;
      case "promise":
        code += `var _fn${index} = _x[${index}];
        var _promise${index} = _fn${index}(${this.args()});
        _promise${index}.then(
          function (_result${index}) {
            ${onDone}(_result${index});
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
          this.header() + this.content({ onDone: "_callback" })
        );
        break;
      case "promise":
        fn = new Function(
          this.args(),
          this.header() + this.content({ onDone: "_callback" })
        );
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
