let members = ["hyuna", "egoing", "jay"];

console.log(members[1]);
let i = 0;
while (i < members.length) {
  console.log(members[i++]);
}

console.log("--------------object-----------");

let roles = {
  programmer: "jay",
  designer: "egoing",
};

console.log(roles.programmer);

for (let name in roles) {
  console.log("object =>", name, "\tvalue =>", roles[name]);
  console.log("object =>", name, "\tvalue =>", roles.name);
  //   console.log("object =>", name, "\tvalue =>", roles."name");
}

// 이게뭐람
console.log(roles.designer); // O
console.log(roles["designer"]); // O
// console.log(roles[designer]); // X
