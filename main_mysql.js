let http = require("http");
let fs = require("fs");
let url = require("url");
let qs = require("querystring");
let template = require("./lib/template.js");
let path = require("path");
let sanitizeHtml = require("sanitize-html");
var mysql = require("mysql");
// 비밀번호는 별도의 파일로 분리해서 버전관리에 포함시키지 않아야 합니다.
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ssafy",
  database: "opentutorials",
});

let list;

db.connect();

let app = http.createServer(function (request, response) {
  let _url = request.url;
  let queryData = url.parse(_url, true).query;
  let pathname = url.parse(_url, true).pathname;
  let title;
  let description = "";

  if (pathname === "/") {
    if (queryData.id === undefined) {
      db.query(`SELECT * FROM topic`, function (err, topics) {
        let title = "welcome";
        let description = "Hello, Node.js";
        list = template.list(topics);
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
      db.query(`SELECT * FROM topic`, function (err, topics) {
        if (err) {
          throw err;
        }
        db.query(
          `SELECT * FROM topic
            LEFT JOIN author
            ON topic.author_id=author.id
            WHERE topic.id=?`,
          [queryData.id],
          function (err2, topic) {
            if (err2) {
              throw err2;
            }
            let title = topic[0].title;
            let description = topic[0].description;
            list = template.list(topics);
            let html = template.html(
              title,
              list,
              `<h2>${title}</h2>
              ${description}
              <p>by ${topic[0].name}<p>`,
              `<a href="/create">create</a>
                <a href="/update?id=${queryData.id}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${queryData.id}">
                  <input type="submit" value="delete">
                </form>
              `
            );
            response.writeHead(200);
            response.end(html);
          }
        );
      });
    }
  } else if (pathname === "/create") {
    db.query(`SELECT * FROM topic`, function (err, topics) {
      db.query(`SELECT * FROM author`, function (err2, authors) {
        let title = "create";
        list = template.list(topics);
        let html = template.html(
          title,
          list,
          `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                ${template.authorSelect(authors)}
            </p>
            <p><input type="submit"></p>
          </form>
          `,
          ``
        );
        response.writeHead(200);
        response.end(html);
      });
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

      db.query(
        `INSERT INTO topic(title, description, created, author_id)
      VALUES(?,?,NOW(),?)`,
        [title, description, post.author],
        function (err, result) {
          if (err) {
            throw err;
          }
          response.writeHead(302, { Location: `/?id=${result.insertId}` });
          response.end("success");
        }
      );
    });
  } else if (pathname === "/update") {
    db.query(`select * from topic`, function (err, topics) {
      if (err) {
        throw err;
      }
      db.query(`SELECT * FROM author`, function (err2, authors) {
        db.query(
          `select * from topic where id=?`,
          [queryData.id],
          function (err3, topic) {
            if (err3) {
              throw err3;
            }
            list = template.list(topics);
            let html = template.html(
              topic[0].title,
              list,
              `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${topic[0].id}">
              <p><input type="text" name="title" placeholder="title" value="${
                topic[0].title
              }"></p>
              <p>
                <textarea name="description" placeholder="description">${
                  topic[0].description
                }</textarea>
              </p>
              <p>
                  ${template.authorSelect(authors, topic[0].author_id)}
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
              ``
            );
            response.writeHead(200);
            response.end(html);
          }
        );
      });
    });
  } else if (pathname === "/update_process") {
    ``;
    let body = "";
    request.on("data", function (data) {
      body += data;
    });

    request.on("end", function () {
      let post = qs.parse(body);

      db.query(
        `UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
        [post.title, post.description, post.author, post.id],
        function (err, result) {
          if (err) throw err;
          response.writeHead(302, { Location: `/?id=${post.id}` });
          response.end();
        }
      );
    });
  } else if (pathname === "/delete_process") {
    let body = "";
    request.on("data", function (data) {
      body += data;
    });

    request.on("end", function () {
      let post = qs.parse(body);
      db.query(
        `DELETE FROM topic WHERE id=?`,
        [post.id],
        function (err, result) {
          if (err) throw err;
          response.writeHead(302, { Location: `/` });
          response.end();
        }
      );
    });
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
});

app.listen(3000);
