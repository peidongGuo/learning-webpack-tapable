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
      return this.options.args.join(",");
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

  callTap(index) {
    let code = "";
    switch (this.options.type) {
      case "sync":
        code = `var _fn${index}=_x[${index}];\n`;
        code += `_fn${index}(${this.args()});\n`;
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
