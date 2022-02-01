const { SyncWaterfallHook } = require("tapable");
const hook = new SyncWaterfallHook(["name", "age"]);
hook.tap({ name: "tap1" }, (name, age) => {
  console.log("tap1", name, age);
  return 1; // 如果有返回值，且不等于 undefined(无返回值，其实也是 undefined)，就给下一个 tap 的第一个参数。
});
hook.tap({ name: "tap2" }, (name, age) => {
  console.log("tap2", name, age);
  return undefined; // 如果等于 undefined(或无返回值)，就将接受的参数继续给下一个 tap。
});
hook.tap({ name: "tap3" }, (name, age) => {
  console.log("tap3", name, age);
  return null; // 如果有返回值，且不等于 undefined(无返回值，其实也是 undefined)，就给下一个 tap 的第一个参数。
});
hook.tap({ name: "tap4" }, (name, age) => {
  console.log("tap4", name, age);
  return undefined;
});

hook.call("gpd", "34");

// -----output-------
// tap1 gpd 34
// tap2 1 34
// tap3 1 34
// tap4 null 34
