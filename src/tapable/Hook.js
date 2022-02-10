class Hook {
  constructor(args) {
    if (!Array.isArray(args)) {
      args = [];
    }
    this.args = args;
    this.taps = [];
    this.call = CALL_DELEGATE;
    this.callAsync = CALL_ASYNC_DELEGATE;
    this.promise = PROMISE_DELEGATE;
  }

  tap(options, fn) {
    this._tap("sync", options, fn);
  }
  tapAsync(options, fn) {
    this._tap("async", options, fn);
  }
  tapPromise(options, fn) {
    this._tap("promise", options, fn);
  }
  _tap(type, options, fn) {
    if (typeof options === "string") {
      options = { name: options };
    }
    let tapInfo = { ...options, type, fn };
    this._insert(tapInfo);
  }
  _resetCompilation() {
    this.call = CALL_DELEGATE; // 重置为原始的函数，准备重新编译
    this.callAsync = CALL_ASYNC_DELEGATE;
    this.promise = PROMISE_DELEGATE;
  }
  _insert(tapInfo) {
    this._resetCompilation();
    this.taps.push(tapInfo);
  }
  _createCall(type) {
    return this.compile({
      taps: this.taps, // tapInfo 的数组
      args: this.args, // 形参名称的数组
      type, // 钩子的类型
    });
  }
  compile() {
    throw new Error("Abstract: Should be override!");
  }
}

// 核心是懒的动态编译
const CALL_DELEGATE = function (...args) {
  this.call = this._createCall("sync");
  return this.call(...args);
};

// 核心是懒的动态编译
const CALL_ASYNC_DELEGATE = function (...args) {
  this.callAsync = this._createCall("async");
  return this.callAsync(...args);
};

// 核心是懒的动态编译
const PROMISE_DELEGATE = function (...args) {
  this.promise = this._createCall("promise");
  return this.promise(...args);
};

module.exports = Hook;
