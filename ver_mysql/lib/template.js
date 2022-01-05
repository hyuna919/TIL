// let template = {
module.exports = {
  html: function (title, list, body, controll) {
    return `
      <!doctype html>
        <html>
        <head>
          <title>WEB2 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
         ${list}
         ${controll}
         ${body}
        </body>
        </html>
    `;
  },
  list: function (topics) {
    let list = "<ul>";
    let i = 0;
    while (i < topics.length) {
      list += `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i++;
    }
    list += "</ul>";
    return list;
  },
  authorSelect: function (authors, author_id) {
    let tag = "";
    let i = 0;
    let selected = "";
    while (i < authors.length) {
      let selected = "";
      if (authors[i].id === author_id) selected = " selected";
      tag += `<option value="${authors[i].id}" ${selected}>${
        authors[i++].name
      }</option>`;
    }
    return `
    <select name="author">${tag}</select>
    `;
  },
};

// module.exports = template;
