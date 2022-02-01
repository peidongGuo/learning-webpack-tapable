const { AsyncParallelHook } = require("tapable");
const hook = new AsyncParallelHook(["name", "age"]);
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
// tap1 gpd 34
// tap2 gpd 34
// tap3 gpd 34
// undefined undefined
// cost-tap: 5.069ms

const hook2 = new AsyncParallelHook(["name", "age"]);
console.time("cost-tapAsync");
hook2.tapAsync({ name: "tap1" }, (name, age, callback) => {
  setTimeout(() => {
    console.log("tap1", name, age);
    callback();
  }, 1000);
});
hook2.tapAsync({ name: "tap2" }, (name, age, callback) => {
  setTimeout(() => {
    console.log("tap2", name, age);
    callback();
  }, 2000);
});
hook2.tapAsync({ name: "tap3" }, (name, age, callback) => {
  setTimeout(() => {
    console.log("tap3", name, age);
    callback();
  }, 3000);
});

hook2.callAsync("gpd", "34", (err, data) => {
  console.log(err, data);
  console.timeEnd("cost-tapAsync");
});

// -----output-------
// tap1 gpd 34
// tap2 gpd 34
// tap3 gpd 34
// undefined undefined
// cost-tapAsync: 3002.280ms

const hook3 = new AsyncParallelHook(["name", "age"]);
console.time("cost-tapPromise");
hook3.tapPromise({ name: "tap1" }, (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("tap1", name, age);
      resolve();
    }, 1000);
  });
});
hook3.tapPromise({ name: "tap2" }, (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("tap2", name, age);
      resolve();
    }, 2000);
  });
});
hook3.tapPromise({ name: "tap3" }, (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("tap3", name, age);
      resolve();
    }, 3000);
  });
});

hook3.promise("gpd", "34").then((data) => {
  console.log(data);
  console.timeEnd("cost-tapPromise");
});

// -----output-------
// tap1 gpd 34
// tap2 gpd 34
// tap3 gpd 34
// undefined
// cost-tapPromise: 3002.330ms
