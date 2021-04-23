var http = require("http");
var url = require("url");
var topic = require("./lib/topic");
var author = require("./lib/author");

var app = http.createServer(async function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (pathname === "/") {
    if (queryData.id === undefined) {
      /* fs.readdir("./data", function (error, filelist) {
        var title = "Welcome";
        var description = "Hello, Node.js";
        var list = template.list(filelist);
        var html = template.HTML(
          title,
          list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
      }); */
      topic.home(request, response);
    } else {
      /* fs.readdir("./data", function (error, filelist) {
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
          var title = queryData.id;
          var sanitizedTitle = sanitizeHtml(title);
          var sanitizedDescription = sanitizeHtml(description, {
            allowedTags: ["h1"],
          });
          var list = template.list(filelist);
          var html = template.HTML(
            sanitizedTitle,
            list,
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            ` <a href="/create">create</a>
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`
          );
          response.writeHead(200);
          response.end(html);
        });
      }); */
      topic.page(request, response);
    }
  } else if (pathname === "/create") {
    topic.create(request, response);
  } else if (pathname === "/create_process") {
    topic.create_process(request, response);
  } else if (pathname === "/update") {
    topic.update(request, response);
  } else if (pathname === "/update_process") {
    topic.update_process(request, response);
  } else if (pathname === "/delete_process") {
    topic.delete_process(request, response);
  } else if (pathname === "/author") {
    author.home(request, response);
  } else if (pathname === "/author/create_process") {
    author.create_process(request, response);
  } else if (pathname === "/author/update") {
    author.update(request, response);
  } else if (pathname === "/author/update_process") {
    author.update_process(request, response);
  } else if (pathname === "/author/delete_process") {
    author.delete_process(request, response);
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
