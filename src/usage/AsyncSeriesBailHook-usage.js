const { AsyncSeriesBailHook } = require("tapable");
const hook = new AsyncSeriesBailHook(["name", "age"]);
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
// cost-tap: 8.652ms
// tap1 gpd 34
// tap2 gpd 34
// tap3 gpd 34

const hook2 = new AsyncSeriesBailHook(["name", "age"]);
console.time("cost-tapAsync");
hook2.tapAsync({ name: "tapAsync1" }, (name, age, callback) => {
  setTimeout(() => {
    console.log("tapAsync1", name, age);
    callback(null, undefined);
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
// tapAsync2 gpd 34
// null tapAsync2 callback
// cost-tapAsync: 3006.164ms

const hook3 = new AsyncSeriesBailHook(["name", "age"]);
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
      reject("tapPromise2 resolve");
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

hook3.promise("gpd", "34").then(
  (data) => {
    console.log(data);
    console.timeEnd("cost-tapPromise");
  },
  (err) => {
    console.log(err);
    console.timeEnd("cost-tapPromise");
  }
);
// -----output-------
// tapPromise1 gpd 34
// tapPromise2 gpd 34
// tapPromise2 resolve
// cost-tapPromise: 3007.657ms
