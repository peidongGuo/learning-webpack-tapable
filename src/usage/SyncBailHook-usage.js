const { SyncBailHook } = require("tapable");
const hook = new SyncBailHook(["name", "age"]);
hook.tap({ name: "tap1" }, (name, age) => {
  console.log("tap1", name, age);
  // return 1; // 如果有返回值，就直接返回了，不再往下执行了。
});
hook.tap({ name: "tap2" }, (name, age) => {
  console.log("tap2", name, age);
  return null; // 如果有返回值，且不等于 undefined(无返回值，其实也是 undefined)，不再往下执行。
});
hook.tap({ name: "tap3" }, (name, age) => {
  console.log("tap3", name, age);
  return undefined;
});

hook.call("gpd", "34");

// -----output-------
// tap1 gpd 34
// tap2 gpd 34
