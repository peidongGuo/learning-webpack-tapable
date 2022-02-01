const { AsyncSeriesWaterfallHook } = require("tapable");
const hook = new AsyncSeriesWaterfallHook(["name", "age"]);
console.time("cost-tap");
hook.tap({ name: "tap1" }, (name, age) => {
  setTimeout(() => {
    console.log("tap1", name, age);
    return 1; // 无用
  }, 1000);
});
hook.tap({ name: "tap2" }, (name, age) => {
  setTimeout(() => {
    console.log("tap2", name, age);
    return 2; // 无用
  }, 2000);
});
hook.tap({ name: "tap3" }, (name, age) => {
  setTimeout(() => {
    console.log("tap3", name, age);
    return 3; // 无用
  }, 3000);
});

hook.callAsync("gpd", "34", (err, data) => {
  console.log(err, data);
  console.timeEnd("cost-tap");
});

// -----output-------
// null gpd
// cost-tap: 8.464ms
// tap1 gpd 34
// tap2 gpd 34
// tap3 gpd 34

const hook2 = new AsyncSeriesWaterfallHook(["name", "age"]);
console.time("cost-tapAsync");
hook2.tapAsync({ name: "tapAsync1" }, (name, age, callback) => {
  setTimeout(() => {
    console.log("tapAsync1", name, age);
    callback(null, "tapAsync1 callback");
    // callback();
  }, 1000);
});
hook2.tapAsync({ name: "tapAsync2" }, (name, age, callback) => {
  setTimeout(() => {
    console.log("tapAsync2", name, age);
    callback(null, "tapAsync2 callback");
  }, 2000);
});
hook2.tapAsync({ name: "tapAsync3" }, (name, age, callback) => {
  setTimeout(() => {
    console.log("tapAsync3", name, age);
    callback(null, "tapAsync3 callback");
  }, 3000);
});

hook2.callAsync("gpd", "34", (err, data) => {
  console.log(err, data);
  console.timeEnd("cost-tapAsync");
});

// -----output-------
// tapAsync1 gpd 34
// tapAsync2 tapAsync1 callback 34
// tapAsync3 tapAsync2 callback 34
// null tapAsync3 callback
// cost-tapAsync: 6005.751ms

const hook3 = new AsyncSeriesWaterfallHook(["name", "age"]);
console.time("cost-tapPromise");
hook3.tapPromise({ name: "tapPromise1" }, (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("tapPromise1", name, age);
      resolve("tapPromise1 resolve");
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
// -----output-------
// tapPromise1 gpd 34
// tapPromise2 tapPromise1 resolve 34
// tapPromise3 tapPromise2 resolve 34
// tapPromise3 resolve
// cost-tapPromise: 6006.094ms
