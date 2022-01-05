function f() {
  console.log(1 + 1);
}

console.log(f);

let array = [f];
array[0]();

let o = {
  func: f,
  key: "value",
};

o.func();
console.log(o.key);
