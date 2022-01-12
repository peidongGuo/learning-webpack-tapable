// SyncLoopHook 的特点是不停的循环执行回调函数，直到函数结果等于 undefined
// 要注意的是每次循环都是从头开始循环的

const { SyncLoopHook } = require("tapable");

const hook = new SyncLoopHook(["name", "age"]);
let counter1 = (counter2 = counter3 = 0);
hook.tap({ name: "tap1" }, (name, age) => {
  console.log("tap1", name, age, counter1);
  if (counter1 === 1) {
    counter1--;
    return undefined; // 如果等于 undefined(无返回值，其实也是 undefined)，就执行下一个 tap。
  }
  counter1++;
  return true; // 如果不等于 undefined(无返回值，其实也是 undefined)，就重新执行所有 tap。
});
hook.tap({ name: "tap2" }, (name, age) => {
  console.log("tap2", name, age, counter2);
  if (counter2 === 2) {
    counter2 -= 2;
    return undefined;
  }
  counter2++;
  return true;
});
hook.tap({ name: "tap3" }, (name, age) => {
  console.log("tap3", name, age, counter3);
  if (counter3 === 3) {
    counter3 -= 3;
    return undefined;
  }
  counter3++;
  return true;
});

hook.call("gpd", "34");

// -----output-------
// tap1 gpd 34 0
// tap1 gpd 34 1
// tap2 gpd 34 0
// tap1 gpd 34 0
// tap1 gpd 34 1
// tap2 gpd 34 1
// tap1 gpd 34 0
// tap1 gpd 34 1
// tap2 gpd 34 2
// tap3 gpd 34 0
// tap1 gpd 34 0
// tap1 gpd 34 1
// tap2 gpd 34 0
// tap1 gpd 34 0
// tap1 gpd 34 1
// tap2 gpd 34 1
// tap1 gpd 34 0
// tap1 gpd 34 1
// tap2 gpd 34 2
// tap3 gpd 34 1
// tap1 gpd 34 0
// tap1 gpd 34 1
// tap2 gpd 34 0
// tap1 gpd 34 0
// tap1 gpd 34 1
// tap2 gpd 34 1
// tap1 gpd 34 0
// tap1 gpd 34 1
// tap2 gpd 34 2
// tap3 gpd 34 2
// tap1 gpd 34 0
// tap1 gpd 34 1
// tap2 gpd 34 0
// tap1 gpd 34 0
// tap1 gpd 34 1
// tap2 gpd 34 1
// tap1 gpd 34 0
// tap1 gpd 34 1
// tap2 gpd 34 2
// tap3 gpd 34 3
