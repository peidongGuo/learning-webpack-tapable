const Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");

class AsyncSeriesHookCodeFactory extends HookCodeFactory {
  content({ onDone }) {
    return this.callTapSeries2(onDone);
  }
}

let factory = new AsyncSeriesHookCodeFactory();

class AsyncSeriesHook extends Hook {
  compile(options) {
    factory.setup(this, options);
    return factory.create(options);
  }
}

module.exports = AsyncSeriesHook;
