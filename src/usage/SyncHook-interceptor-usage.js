const { SyncHook } = require("../tapable");
const hook = new SyncHook(["name", "age"]);

hook.intercept({
  register: (tapInfo) => {
    console.log("拦截器-1-register", tapInfo);
    tapInfo.name = "gpd-interceptor1";
    return tapInfo;
  },
  call: (...args) => {
    console.log("拦截器-1-call", args);
  },
  tap: (tap) => {
    console.log("拦截器-1-tap", tap);
  },
});

hook.intercept({
  register: (tapInfo) => {
    console.log("拦截器-2-register", tapInfo);
    tapInfo.name = "gpd-interceptor2";
    return tapInfo;
  },
  call: (...args) => {
    console.log("拦截器-2-call", args);
  },
  tap: (tap) => {
    console.log("拦截器-2-tap", tap);
  },
});

hook.tap({ name: "tap1" }, (name, age) => {
  console.log("tap1", name, age);
  return 1; // 无用
});
hook.tap({ name: "tap2" }, (name, age) => {
  console.log("tap2", name, age);
  return 1; // 无用
});
hook.tap({ name: "tap3" }, (name, age) => {
  console.log("tap3", name, age);
  return undefined; // 无用
});

hook.call("gpd", "34");
