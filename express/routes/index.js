const express = require("express");
const router = express.Router();
const template = require("../lib/template.js");

// 정적 파일 서비스
router.get("/", (req, res) => {
    let title = "Welcome";
    let description = "Hello, Node.js";
    let list = template.list(req.list);
    let html = template.HTML(
      title,
      list,
      `<h2>${title}</h2>${description}
      <img src="/images/hello.jpg" style="width:300px; display:block; margin:10px">`,
      `<a href="/topic/create">create</a>`
    );
    res.send(html);
});

module.exports = router;