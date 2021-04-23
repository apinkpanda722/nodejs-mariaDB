var db = require("./db");
var template = require("./template.js");
var url = require("url");
var qs = require("querystring");
var sanitizeHtml = require("sanitize-html");

exports.home = async function (requst, response) {
  try {
    conn = await db.getConnection();
    topics = await conn.query("SELECT * FROM topic");
    var title = "Welcome";
    var description = "Hello, Node.js";
    var list = template.list(topics);
    var html = template.HTML(
      title,
      list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    );
    response.writeHead(200);
    response.end(html);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) return conn.end();
  }
};

exports.page = async function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  try {
    conn = await db.getConnection();
    topics = await conn.query("SELECT * FROM topic");
    topic = await conn.query(
      `SELECT title, description, name FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,
      [queryData.id]
    );
    var title = topic[0].title;
    var description = topic[0].description;
    var list = template.list(topics);
    var html = template.HTML(
      title,
      list,
      `<h2>${sanitizeHtml(title)}</h2>
          ${sanitizeHtml(description)}
          <p>by ${sanitizeHtml(topic[0].name)}</p>
          `,
      ` <a href="/create">create</a>
                <a href="/update?id=${queryData.id}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${queryData.id}">
                  <input type="submit" value="delete">
                </form>`
    );
    response.writeHead(200);
    response.end(html);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) return conn.end();
  }
};

exports.create = async function (request, response) {
  try {
    conn = await db.getConnection();
    topics = await conn.query("SELECT * FROM topic");
    authors = await conn.query("SELECT * FROM author");
    console.log(authors);
    var title = "Create";
    var list = template.list(topics);
    var html = template.HTML(
      sanitizeHtml(title),
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
              <p>
                <input type="submit">
              </p>
            </form>
          `,
      `<a href="/create">create</a>`
    );
    response.writeHead(200);
    response.end(html);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) return conn.end();
  }
};

exports.create_process = async function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body = body + data;
  });
  request.on("end", async function () {
    var post = qs.parse(body);
    try {
      conn = await db.getConnection();
      topics = await conn.query("SELECT * FROM topic");
      topic = await conn.query(
        `INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
        [post.title, post.description, post.author]
      );
      response.writeHead(302, { Location: `/?id=${topic.insertId}` });
      response.end();
    } catch (err) {
      console.log(err);
    } finally {
      if (conn) return conn.end();
    }
  });
};

exports.update = async function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  try {
    conn = await db.getConnection();
    topics = await conn.query("SELECT * FROM topic");
    topic = await conn.query(`SELECT * FROM topic where id = ?`, [
      queryData.id,
    ]);
    authors = await conn.query(`SELECT * FROM author`);
    console.log(topic);
    var list = template.list(topics);
    var html = template.HTML(
      sanitizeHtml(topic[0].title),
      list,
      `
          <form action="/update_process", method="post">
            <input type="hidden" name="id" value="${topic[0].id}">
            <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(
              topic[0].title
            )}"></p>
            <p>
              <textarea name="description" placeholder="description">${sanitizeHtml(
                topic[0].description
              )}</textarea>
            </p>
            <p>
              ${template.authorSelect(authors, topic[0].author_id)}
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
      `<a href="/create">create</a><a href="/update?id=${topic[0].id}}">update</a>`
    );
    response.writeHead(200);
    response.end(html);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) return conn.end();
  }
};

exports.update_process = async function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body = body + data;
  });
  request.on("end", async function () {
    var post = qs.parse(body);
    try {
      conn = await db.getConnection();
      topics = await conn.query("SELECT * FROM topic");
      topic = await conn.query(
        `UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
        [post.title, post.description, post.author, post.id]
      );
      response.writeHead(302, { Location: `/?id=${post.id}` });
      response.end();
      console.log(topic);
      var list = template.list(topics);
      var html = template.HTML(
        topic[0].title,
        list,
        `
          <form action="/update_process", method="post">
            <input type="hidden" name="id" value="${topic[0].id}">
            <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
            <p>
              <textarea name="description" placeholder="description">${topic[0].description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
        `<a href="/create">create</a><a href="/update?id=${topic[0].id}}">update</a>`
      );
      response.writeHead(200);
      response.end(html);
    } catch (err) {
      console.log(err);
    } finally {
      if (conn) return conn.end();
    }
  });
};

exports.delete_process = async function (request, response) {
  var body = "";
  request.on("data", async function (data) {
    body = body + data;
  });
  request.on("end", async function () {
    var post = qs.parse(body);
    try {
      conn = await db.getConnection();
      await conn.query(`DELETE FROM topic WHERE id = ?`, [post.id]);
      response.writeHead(302, { Location: `/` });
      response.end();
    } catch (err) {
      console.log(err);
    } finally {
      if (conn) return conn.end();
    }
  });
};
