let fs = require("fs");
let res = "";

// readFileSync
// console.log("A");
// res = fs.readFileSync("syntax/sample.txt", "utf8");
// console.log(res);
// console.log('C');

console.log("A");
fs.readFile("syntax/sample.txt", "utf8", function (err, result) {
  console.log(result);
});
console.log("C");
