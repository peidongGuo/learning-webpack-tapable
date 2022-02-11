const { HookMap } = require("tapable");
const { SyncHook } = require("tapable");
const hookMap = new HookMap(() => new SyncHook(["name", "age"]));

hookMap.for("key1").tap({ name: "tap1" }, (name, age) => {
  console.log("tap1", name, age);
  return 1; // 无用
});
hookMap.for("key1").tap({ name: "tap2" }, (name, age) => {
  console.log("tap2", name, age);
  return 1; // 无用
});
hookMap.for("key1").tap({ name: "tap3" }, (name, age) => {
  console.log("tap3", name, age);
  return undefined; // 无用
});

hookMap.get("key1").call("gpd", "34");
