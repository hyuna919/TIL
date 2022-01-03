// mysql 적용 전, 파일시스템 사용
// 생활코딩
let http = require("http");
let fs = require("fs");
let url = require("url");
let qs = require("querystring");
let template = require("./lib/template.js");
let path = require("path");
let sanitizeHtml = require("sanitize-html");

let app = http.createServer(function (request, response) {
  let _url = request.url;
  let queryData = url.parse(_url, true).query;
  let pathname = url.parse(_url, true).pathname;
  let title;
  let description = "";

  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", function (err, filelist) {
        title = "welcome";
        description = "Hello, Node.js";
        let list = template.list(filelist);
        let html = template.html(
          title,
          list,
          `<h2>${title}</h2>${description}`,
          `
          <a href="/create">create</a>
          `
        );
        response.writeHead(200);
        response.end(html);
      });
    } else {
      fs.readdir("./data", function (err, filelist) {
        let filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
          title = queryData.id;
          let sanitizedTitle = sanitizeHtml(title);
          let sanitizedDescription = sanitizeHtml(description);
          let list = template.list(filelist);
          let html = template.html(
            sanitizedTitle,
            list,
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            `
                <a href="/create">create</a>
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>
              `
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  } else if (pathname === "/create") {
    fs.readdir("./data", function (err, filelist) {
      title = "WEB - create";
      let list = template.list(filelist);
      let html = template.html(
        title,
        list,
        `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
          <textarea name="description" placeholder="description"></textarea>
          </p>
          <p><input type="submit"></p>
        </form>
        `,
        ``
      );
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === "/create_process") {
    let body = "";
    request.on("data", function (data) {
      body += data;
    });

    request.on("end", function () {
      let post = qs.parse(body);
      let title = post.title;
      let description = post.description;
      let filteredId = path.parse(title).base;
      fs.writeFile(`data/${filteredId}`, description, "utf8", function (err) {
        response.writeHead(301, { Location: `/?id=${title}` });
        response.end("success");
      });
    });
  } else if (pathname === "/update") {
    fs.readdir("./data", function (err, filelist) {
      let filteredTitle = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredTitle}`, "utf8", function (err, description) {
        let list = template.list(filelist);
        let html = template.html(
          title,
          list,
          `
          <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${filteredTitle}">
          <p><input type="text" name="title" placeholder="title" value="${filteredTitle}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
          `,
          `
            <a href="/create">create</a>
            <a href="/update?id=${filteredTitle}">update</a>
          `
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if (pathname === "/update_process") {
    let body = "";
    request.on("data", function (data) {
      body += data;
    });

    request.on("end", function () {
      let post = qs.parse(body);
      let title = post.title;
      let description = post.description;
      let filteredId = path.parse(post.id).base;
      fs.rename(`data/${filteredId}`, `data/${title}`, function (error) {
        fs.writeFile(`data/${title}`, description, "utf8", function (err) {
          response.writeHead(301, { Location: `/?id=${title}` });
          response.end("success");
        });
      });
    });
  } else if (pathname === "/delete_process") {
    let body = "";
    request.on("data", function (data) {
      body += data;
    });

    request.on("end", function () {
      let post = qs.parse(body);
      let filteredId = path.parse(post.id).base;
      fs.unlink(`data/${filteredId}`, function (error) {
        response.writeHead(302, { Location: `/` });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
});

app.listen(3000);
