const fs = require("fs");
// import fs from "fs"; //=> cannot use import statment outside a module

fs.readFile("sample.txt", "utf8", function (err, data) {
  console.log(data);
});
