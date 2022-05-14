"use strict";

var express = require('express');

var app = express();
var port = 3000;
var host = '127.0.0.1';

var sqlite = require('sqlite3');

var stringSimilarity = require("string-similarity");

var bodyParser = require('body-parser');

app.use(bodyParser.json()); //<redis>

var redis = require('redis');

var client = redis.createClient(); //</redis>

app.use(express["static"](__dirname + '/public/static'));

var nunjucks = require('nunjucks');

nunjucks.configure('.', {
  autoescape: true,
  express: app
});
var env = nunjucks.configure(".", {
  autoescape: false
});

function get_data(query, data_query) {
  var db, _i, myIndex, sql_queries, sql, promise, data;

  return regeneratorRuntime.async(function get_data$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          db = new sqlite.Database("recipes.db", function (err) {
            if (err) {
              console.error(err.message);
            } else {
              console.log("connect to db complete!");
            }
          }); // let dataex = "";

          for (_i = 0; _i < data_query.length; _i++) {
            if (data_query[_i].indexOf(",") >= 0) {
              data_query[_i] = data_query[_i].split(",").join("', '");
            }
          }

          while (data_query.includes("undefined")) {
            myIndex = data_query.indexOf('undefined');

            if (myIndex !== -1) {
              data_query.splice(myIndex, 1);
            }
          }

          console.log(data_query);
          console.log("SELECT * FROM recipe IN ('".concat(data_query.join("', '"), "')"));
          sql_queries = {
            all: "SELECT * FROM recipe",
            search: "SELECT * FROM recipe",
            bSearchCheclBx: "SELECT * FROM recipe IN ('".concat(data_query.join("', '"), "')")
          };
          sql = sql_queries[query]; //let sql = "SELECT * FROM users";

          promise = new Promise(function (resolve, reject) {
            db.all(sql, data_query, function (err, rows) {
              if (err) {
                reject(err);
              } else {
                resolve(rows);
              }
            });
          });
          _context.next = 10;
          return regeneratorRuntime.awrap(promise);

        case 10:
          data = _context.sent;
          db.close();
          return _context.abrupt("return", data);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  });
}

app.get('/', function (req, res) {
  l = [];
  get_data("all", []).then(function (resolve) {
    for (i = 0; i < resolve.length; i++) {}

    console.log(l); // res.send("hello")

    res.render(__dirname + '/pages/index.html', resolve);
  });
});
app.get('/search', function (request, response) {
  var search = request.query.q;
  var SearchedList = [];
  get_data("search", []).then(function (resolve) {
    // const data = { resolve };
    for (var _i2 = 0, _l = resolve.length; _i2 < _l; _i2++) {
      var obj = resolve[_i2];
      console.log(search, obj.name);
      var similarity = stringSimilarity.compareTwoStrings(String(search == undefined ? "test" : search.toLowerCase()), obj.name.toLowerCase());

      if (similarity >= 0.2) {
        console.log(obj.name, 'Сходство(name):', similarity);
        SearchedList.push(obj);
      }
    }

    for (var _i3 = 0, _l2 = resolve.length; _i3 < _l2; _i3++) {
      var obj = resolve[_i3];
      console.log(search, obj.name);
      var similarity = stringSimilarity.compareTwoStrings(String(search == undefined ? "test" : search.toLowerCase()), obj.category.toLowerCase());

      if (similarity >= 0.2) {
        console.log(obj.name, 'Сходство(name):', similarity);
        SearchedList.push(obj);
      }
    }

    response.render(__dirname + '/pages/search.html', {
      SearchedList: SearchedList
    });
  });
});
app.get('/bettersearch', function (request, response) {
  get_data("all", []).then(function (resolve) {
    response.render(__dirname + '/pages/bsearch.html', resolve);
  });
}); //     let categorybox = request.query.categorycheckbox;
//     let categoryradio = request.query.category;
//     // console.log(categoryradio, categorybox)
//     // var list = []
//     // let composition = request.body.composition;
//     // let type = request.body.type;
//     
//         // for (let i = 0, l = resolve.length; i < l; i++) {
//         //     var obj = resolve[i];
//         //     var similarity = stringSimilarity.compareTwoStrings(String(categorybox), obj.category)
//         //     if (similarity >= 0.2) {
//         //         // console.log(obj.name, 'Сходство(name):', similarity)
//         //         list.push(obj)
//         //     }
//         // }
//         response.render(__dirname + '/pages/bsearch.html', resolve);
//     
// })

app.get('/bettersearch1', function (request, res) {
  var q1 = String(request.query.q1);
  var q2 = String(request.query.q2);
  var q3 = String(request.query.q3);
  get_data("bSearchCheclBx", [q1, q2, q3]).then(function (resolve) {
    res.json(resolve); // res.render(__dirname + '/pages/bsearch.html', resolve);
  });
});
app.listen(port, function () {
  console.log("Server stated on: http://".concat(host, ":").concat(port));
});