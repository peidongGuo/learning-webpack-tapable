const { SyncHook } = require("tapable");
const hook = new SyncHook(["name", "age"]);

hook.tap({ name: "tap1", stage: 5 }, (name, age) => {
  console.log("tap1", name, age);
  return 1; // 无用
});
hook.tap({ name: "tap2", stage: 3 }, (name, age) => {
  console.log("tap2", name, age);
  return 1; // 无用
});
hook.tap({ name: "tap3", before: ["tap1", "tap2"] }, (name, age) => {
  console.log("tap3", name, age);
  return undefined; // 无用
});

hook.call("gpd", "34");

// tap3 gpd 34
// tap2 gpd 34
// tap1 gpd 34
