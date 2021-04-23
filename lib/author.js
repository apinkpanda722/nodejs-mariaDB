var db = require("./db");
var url = require("url");
var qs = require("querystring");
const template = require("./template");
var sanitizeHtml = require("sanitize-html");

exports.home = async function (requset, response) {
  try {
    conn = await db.getConnection();
    topics = await conn.query("SELECT * FROM topic");
    authors = await conn.query("SELECT * FROM author");
    var title = "author";
    var list = template.list(topics);
    var html = template.HTML(
      title,
      list,
      `
        ${template.authorTable(authors)}
            <style>
                table {
                    border-collapse: collapse;
                }
                td {
                    border: 1px solid black;
                }          
            </style>
            <form action="/author/create_process" method="post">
                <p>
                    <input type="text" name="name" placeholder="name">
                </p>
                <p>
                    <textarea name="profile" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit" value="create">
                </p>
            </form>
            `,
      `
      `
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
        `INSERT INTO author (name, profile) VALUES(?, ?)`,
        [post.name, post.profile]
      );
      response.writeHead(302, { Location: `/author` });
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
    authors = await conn.query("SELECT * FROM author");
    author = await conn.query("SELECT * FROM author WHERE id=?", [
      queryData.id,
    ]);
    var title = "author";
    var list = template.list(topics);
    var html = template.HTML(
      title,
      list,
      `
        ${template.authorTable(authors)}
            <style>
                table {
                    border-collapse: collapse;
                }
                td {
                    border: 1px solid black;
                }          
            </style>
            <form action="/author/update_process" method="post">
                <p>
                  <input type="hidden" name="id" value="${queryData.id}">
                </p>
                <p>
                    <input type="text" name="name" value=${sanitizeHtml(
                      author[0].name
                    )} placeholder="name">
                </p>
                <p>
                    <textarea name="profile" placeholder="description">${sanitizeHtml(
                      author[0].profile
                    )}</textarea>
                </p>
                <p>
                    <input type="submit" value="update">
                </p>
            </form>
            `,
      `
      `
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
        `UPDATE author SET name=?, profile=? WHERE id=?`,
        [post.name, post.profile, post.id]
      );
      response.writeHead(302, { Location: `/author` });
      response.end();
    } catch (err) {
      console.log(err);
    } finally {
      if (conn) return conn.end();
    }
  });
};

exports.delete_process = async function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body = body + data;
  });
  request.on("end", async function () {
    var post = qs.parse(body);
    try {
      conn = await db.getConnection();
      topics = await conn.query("SELECT * FROM topic");
      delete_topic = await conn.query("DELETE FROM topic WHERE author_id=?", [
        post.id,
      ]);
      topic = await conn.query(`DELETE FROM author WHERE id=?`, [post.id]);
      response.writeHead(302, { Location: `/author` });
      response.end();
    } catch (err) {
      console.log(err);
    } finally {
      if (conn) return conn.end();
    }
  });
};
