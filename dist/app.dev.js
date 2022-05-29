"use strict";

var express = require('express');

var app = express();
var port = 3000;
var host = '127.0.0.1';

var sqlite = require('sqlite3');

var stringSimilarity = require("string-similarity");

var bodyParser = require('body-parser');

app.use(bodyParser.json()); //<redis>

var session = require('express-session');

var redis = require('redis');

var connectRedis = require('connect-redis');

var RedisStore = connectRedis(session);
var redisClient = redis.createClient({
  port: 6379,
  host: 'localhost'
});
app.use(session({
  store: new RedisStore({
    client: redisClient
  }),
  secret: 'mySecret',
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: false,
    // if true: only transmit cookie over https
    httpOnly: true,
    // if true: prevents client side JS from reading the cookie
    maxAge: 1000 * 60 * 30,
    // session max age in milliseconds
    sameSite: 'lax' // make sure sameSite is not none

  }
}));
console.log(redis['host'], redis['port']); //</redis>

app.use(express["static"](__dirname + '/public/static'));

var nunjucks = require('nunjucks');

var res = require('express/lib/response');

var req = require('express/lib/request');

nunjucks.configure('.', {
  autoescape: true,
  express: app
});
var env = nunjucks.configure(".", {
  autoescape: false
});

function get_data(query, data_query) {
  var db, _i, myIndex, Bsearch, sql_queries, sql, promise, data;

  return regeneratorRuntime.async(function get_data$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          db = new sqlite.Database("recipes.db", function (err) {
            if (err) {
              console.error(err.message);
            } else {// console.log("connect to db complete!");
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
          } // console.log(data_query);


          Bsearch = "SELECT * FROM recipe WHERE category IN('".concat(data_query.join("', '"), "')");
          console.log("SELECT * FROM recipe WHERE category IN('".concat(data_query.join("', '"), "')"));
          sql_queries = {
            all: "SELECT * FROM recipe",
            search: "SELECT * FROM recipe",
            bSearchCheclBx: "".concat(Bsearch),
            //SELECT * FROM recipe WHERE category IN('lunch', 'supper', 'lunch')//`SELECT * FROM recipe WHERE category IN('${data_query.join("', '")}')`
            index: "SELECT * FROM recipe\n        INNER JOIN SeasonTop ON recipe.id=SeasonTop.id\n          INNER JOIN tags\n        ",
            recipe: "SELECT * FROM recipe WHERE ? = id"
          };
          sql = sql_queries[query];
          console.log(sql_queries.bSearchCheclBx); //let sql = "SELECT * FROM users";

          promise = new Promise(function (resolve, reject) {
            db.all(sql, data_query, function (err, rows) {
              if (err) {
                reject(err);
              } else {
                resolve(rows);
              }
            });
          });
          _context.next = 11;
          return regeneratorRuntime.awrap(promise);

        case 11:
          data = _context.sent;
          db.close();
          return _context.abrupt("return", data);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  });
}

app.get('/', function (req, res) {
  l = [];
  get_data("index", []).then(function (resolve) {
    console.log({
      resolve: resolve
    }); // res.send({resolve})

    for (i = 0, l = resolve.length; i < l; i++) {
      var unparsedtag = resolve[i]["tag"];
      var parsedtags = unparsedtag.split(","); // console.log(parsedtags)
      // console.log(resolve[i]["tag"]);
    }

    res.render(__dirname + '/pages/index.html', {
      resolve: resolve
    });
  });
});
app.get('/search', function (request, response) {
  var search = request.query.q;
  var SearchedList = [];
  get_data("search", []).then(function (resolve) {
    // const data = { resolve };
    for (var _i2 = 0, _l = resolve.length; _i2 < _l; _i2++) {
      var obj = resolve[_i2]; // console.log(search, obj.name)

      var similarity = stringSimilarity.compareTwoStrings(String(search == undefined ? "test" : search.toLowerCase()), obj.name.toLowerCase());

      if (similarity >= 0.2) {
        // console.log(obj.name, 'Сходство(name):', similarity)
        SearchedList.push(obj);
      }
    }

    for (var _i3 = 0, _l2 = resolve.length; _i3 < _l2; _i3++) {
      var obj = resolve[_i3]; // console.log(search, obj.name)

      var similarity = stringSimilarity.compareTwoStrings(String(search == undefined ? "test" : search.toLowerCase()), obj.category.toLowerCase());

      if (similarity >= 0.2) {
        // console.log(obj.name, 'Сходство(name):', similarity)
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
});
app.get('/signUp', function (request, response) {
  get_data("all", []).then(function (resolve) {
    response.render(__dirname + '/pages/signUp.html', resolve);
  });
});
app.get('/bettersearch1', function (request, res) {
  var q1 = String(request.query.q1);
  var q2 = String(request.query.q2);
  var q3 = String(request.query.q3);
  get_data("bSearchCheclBx", [q1, q2, q3]).then(function (resolve) {
    res.json(resolve); // res.render(__dirname + '/pages/bsearch.html', resolve);
  });
});
app.get('/recipe', function (req, res) {
  var r = req.query.r;
  console.log(r);
  get_data("recipe", [r]).then(function (resolve) {
    console.log({
      resolve: resolve
    });
    res.render(__dirname + '/pages/recipe.html', {
      resolve: resolve
    });
  });
}); // app.get("/index", (request, response) => {
//     var items = {
//         "cards":
//             [{
//                 "name": "Жаркое",
//                 "image": ".png",
//                 "tags": [{ "tagName": "asd" }, { "tagName": "dsa" }],
//                 "descripton": "Lorem ipsum dolor sit amet.",
//                 "preptime": "1 час",
//                 "ingredients": [{ "name": "морковь", "count": "1шт" }, { "name": "сметана", "count": "1 ст.л." }],
//             },
//             {
//                 "name": "Жаркое",
//                 "image": ".png",
//                 "tags": [{ "tagName": "asd" }, { "tagName": "dsa" }],
//                 "descripton": "Lorem ipsum dolor sit amet.",
//                 "preptime": "1 час",
//                 "ingredients": [{ "name": "морковь", "count": "1шт" }, { "name": "сметана", "count": "1 ст.л." }],
//             }]
//     };
//     switch (request.query.requestName) {
//         case "dishCardImport":
//             response.send();
//         // response.send(items["cards"].find(dish => dish.name === request["dishName"]));
//             response.send("1");
//             break;
//             // response.send(items["cards"].find(dish => dish.name === request["dishName"]));
//         case "logInUser":
//             response.send("2");
//             break;
//         case "findIngrOfType":
//             response.send("3")
//             break
//     }
// })

app.listen(port, function () {
  console.log("Server stated on: http://".concat(host, ":").concat(port));
});