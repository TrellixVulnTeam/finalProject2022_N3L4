const express = require('express');
const app = express();
const port = 3000
const host = '127.0.0.1';
const sqlite = require('sqlite3');
const stringSimilarity = require("string-similarity");
var bodyParser = require('body-parser')
app.use(bodyParser.json())

//<redis>
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');
const RedisStore = connectRedis(session);

const redisClient = redis.createClient({
    port: 6379,
    host: 'localhost'
});

app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: 'mySecret',
    saveUninitialized: false,
    resave: false, 
    cookie: {
        secure: false, // if true: only transmit cookie over https
        httpOnly: true, // if true: prevents client side JS from reading the cookie
        maxAge: 1000 * 60 * 30, // session max age in milliseconds
        sameSite: 'lax' // make sure sameSite is not none
    }
}));
console.log(redis['host'],redis['port'])
//</redis>
app.use(express.static(__dirname + '/public/static'));

const nunjucks = require('nunjucks');
const res = require('express/lib/response');
const req = require('express/lib/request');
nunjucks.configure('.', {
    autoescape: true,
    express: app
});
var env = nunjucks.configure(".", { autoescape: false });

async function get_data(query, data_query) {
    let db = new sqlite.Database("recipes.db", (err) => {
        if (err) {
            console.error(err.message);
        } else {
            // console.log("connect to db complete!");
        }
    });
    // let dataex = "";
    for (let i = 0; i < data_query.length; i++) {
        if (data_query[i].indexOf(",") >= 0) {
            data_query[i] = data_query[i].split(",").join("', '");
        }
    }
    while (data_query.includes("undefined")) {
        let myIndex = data_query.indexOf('undefined');
        if (myIndex !== -1) {
            data_query.splice(myIndex, 1);
        }
    }
    // console.log(data_query);

    console.log(`SELECT * FROM recipe WHERE category IN('${data_query.join("', '")}')`);
    let sql_queries = {
        all: "SELECT * FROM recipe",
        search: "SELECT * FROM recipe",
        bSearchCheclBx: `SELECT * FROM recipe WHERE category IN('${data_query.join("', '")}')`//SELECT * FROM recipe WHERE category IN('lunch', 'supper', 'lunch')//`SELECT * FROM recipe WHERE category IN('${data_query.join("', '")}')`
    }
    let sql = sql_queries[query];
    console.log(sql_queries.bSearchCheclBx);
    //let sql = "SELECT * FROM users";

    let promise = new Promise((resolve, reject) => {
        db.all(sql, data_query, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows)
            }
        });
    })

    let data = await promise;
    db.close();
    return data;
}

app.get('/', (req, res) => {
    l = []
    get_data("all", []).then((resolve) => {
        for (i = 0; i < resolve.length; i++) {
        }
        // console.log(resolve)
        // res.send("hello")
        res.render(__dirname + '/pages/index.html', resolve);
    })
});


app.get('/search', (request, response) => {
    const search = request.query.q;
    let SearchedList = [];
    get_data("search", []).then((resolve) => {
        // const data = { resolve };
        for (let i = 0, l = resolve.length; i < l; i++) {
            var obj = resolve[i];
            // console.log(search, obj.name)
            var similarity = stringSimilarity.compareTwoStrings(String(search == undefined ? "test" : search.toLowerCase()), obj.name.toLowerCase())
            if (similarity >= 0.2) {
                // console.log(obj.name, 'Сходство(name):', similarity)
                SearchedList.push(obj)
            }
        }
        for (let i = 0, l = resolve.length; i < l; i++) {
            var obj = resolve[i];
            // console.log(search, obj.name)
            var similarity = stringSimilarity.compareTwoStrings(String(search == undefined ? "test" : search.toLowerCase()), obj.category.toLowerCase())
            if (similarity >= 0.2) {
                // console.log(obj.name, 'Сходство(name):', similarity)
                SearchedList.push(obj)
            }
        }
        response.render(__dirname + '/pages/search.html', { SearchedList });
    })
})
app.get('/bettersearch', function (request, response) {
    get_data("all", []).then((resolve) => {
        response.render(__dirname + '/pages/bsearch.html', resolve);
    })
})
//     let categorybox = request.query.categorycheckbox;
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
app.get('/bettersearch1', (request, res) => {
    let q1 = String(request.query.q1);
    let q2 = String(request.query.q2);
    let q3 = String(request.query.q3);
    get_data("bSearchCheclBx", [q1, q2, q3]).then((resolve) => {
        res.json(resolve);
        // res.render(__dirname + '/pages/bsearch.html', resolve);
    })
})

app.get("/registration", (request, response) => {
    get_data("all", []).then((resolve) => {
        response.render(__dirname + '/pages/registration.html', resolve);
    })
})
app.get("/index", (request, response) => {

    var items = {
        "cards":
        [{
            "name": "Жаркое",
            "image": ".png",
            "tags": [{ "tagName": "asd" }, { "tagName": "dsa" }],
            "descripton": "Lorem ipsum dolor sit amet.",
            "preptime": "1 час",
            "ingredients": [{ "name": "морковь", "count": "1шт" }, { "name": "сметана", "count": "1 ст.л." }],

        },
        {
            "name": "Жаркое",
            "image": ".png",
            "tags": [{ "tagName": "asd" }, { "tagName": "dsa" }],
            "descripton": "Lorem ipsum dolor sit amet.",
            "preptime": "1 час",
            "ingredients": [{ "name": "морковь", "count": "1шт" }, { "name": "сметана", "count": "1 ст.л." }],
            
        }]
    };
    switch (request.query.requestName) {
        case "dishCardImport":
            response.send("1");
            break;
            // response.send(items["cards"].find(dish => dish.name === request["dishName"]));
        case "logInUser":
            response.send("2");
            break;
        case "findIngrOfType":
            response.send("3")
            break
    }
})

app.listen(port, function () {
    console.log(`Server stated on: http://${host}:${port}`)
});