const { AsyncParallelBailHook } = require("tapable");
const hook = new AsyncParallelBailHook(["name", "age"]);
console.time("cost-tap");
hook.tap({ name: "tap1" }, (name, age) => {
  console.log("tap1", name, age);
  return undefined; // undefined 接着执行
});
hook.tap({ name: "tap2" }, (name, age) => {
  console.log("tap2", name, age);
  return "tap2 return 2"; // 非 undefined ，直接结束，调用 call 里的回调
});
hook.tap({ name: "tap3" }, (name, age) => {
  console.log("tap3", name, age);
  return "tap3 return 3"; // 无用
});

hook.callAsync("gpd", "34", (err, data) => {
  console.log(err, data);
  console.timeEnd("cost-tap");
});

// -----output-------
// tap1 gpd 34
// tap2 gpd 34
// null tap2 return 2
// cost-tap: 14.306ms

const hook2 = new AsyncParallelBailHook(["name", "age"]);
console.time("cost-tapAsync");
hook2.tapAsync({ name: "tapAsync1" }, (name, age, callback) => {
  setTimeout(() => {
    console.log("tapAsync1", name, age);
    callback(undefined);
  }, 1000);
});
hook2.tapAsync({ name: "tapAsync2" }, (name, age, callback) => {
  setTimeout(() => {
    console.log("tapAsync2", name, age);
    callback("tapAsync2 callback");
  }, 2000);
});
hook2.tapAsync({ name: "tapAsync3" }, (name, age, callback) => {
  setTimeout(() => {
    console.log("tapAsync3", name, age);
    callback("tapAsync3 callback");
  }, 3000);
});

hook2.callAsync("gpd", "34", (data) => {
  console.log(data);
  console.timeEnd("cost-tapAsync");
});

// -----output-------
// tapAsync1 gpd 34
// tapAsync2 gpd 34
// tapAsync2 callback
// cost-tapAsync: 2008.790ms
// tapAsync3 gpd 34

const hook3 = new AsyncParallelBailHook(["name", "age"]);
console.time("cost-tapPromise");
hook3.tapPromise({ name: "tapPromise1" }, (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("tapPromise1", name, age);
      resolve(undefined);
    }, 1000);
  });
});
hook3.tapPromise({ name: "tapPromise2" }, (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("tapPromise2", name, age);
      resolve("tapPromise2 resolve");
    }, 2000);
  });
});
hook3.tapPromise({ name: "tapPromise3" }, (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("tapPromise3", name, age);
      resolve("tapPromise3 resolve");
    }, 3000);
  });
});

hook3.promise("gpd", "34").then((data) => {
  console.log(data);
  console.timeEnd("cost-tapPromise");
});

// tapPromise1 gpd 34
// tapPromise2 gpd 34
// tapPromise2 resolve
// cost-tapPromise: 2007.873ms
// tapPromise3 gpd 34
