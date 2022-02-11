class HookMap {
  constructor(factory) {
    this._hooks = {};
    this._factory = factory;
  }
  get(key) {
    if (this._hooks[key]) {
      return this._hooks[key];
    }
    return null;
  }
  for(key) {
    if (!this._hooks[key]) {
      this._hooks[key] = this._factory();
    }
    return this._hooks[key];
  }
}

module.exports = HookMap;
