function a() {
  console.log("A");
}

let b = function () {
  console.log("B");
};

function slowfunc(callback) {
  callback();
}

// a();
// b();
slowfunc(a);
