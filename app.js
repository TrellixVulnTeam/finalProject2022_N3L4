const express = require('express');
const app = express();
const port = 3000
const host = '127.0.0.1';
const sqlite = require('sqlite3');
const stringSimilarity = require("string-similarity");
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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
    store: new RedisStore({ client: redisClient }),
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
console.log(redis['host'], redis['port'])
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
    // for (let i = 0; i < data_query.length; i++) {
    //     if (data_query[i].indexOf(",") >= 0) {
    //         data_query[i] = data_query[i].split(",").join("', '");
    //     }
    // }
    while (data_query.includes("undefined")) {
        let myIndex = data_query.indexOf('undefined');
        if (myIndex !== -1) {
            data_query.splice(myIndex, 1);
        }
    }
    // console.log(data_query);
    const Bsearch = `SELECT * FROM recipe WHERE category IN('${data_query.join("', '")}')`
    console.log(`SELECT * FROM recipe WHERE category IN('${data_query.join("', '")}')`);
    let sql_queries = {
        all: "SELECT * FROM recipe",
        search: "SELECT * FROM recipe",
        bSearchCheclBx: `${Bsearch}`,//SELECT * FROM recipe WHERE category IN('lunch', 'supper', 'lunch')//`SELECT * FROM recipe WHERE category IN('${data_query.join("', '")}')`
        index: `SELECT * FROM recipe
        FULL OUTER JOIN SeasonTop ON recipe.id=SeasonTop.id
        FULL OUTER JOIN tags
        FULL OUTER JOIN recsteps ON recsteps.id = recipe.id
        `,
        recipe: `SELECT * FROM recipe WHERE ? LIKE id`,
        test: `SELECT * FROM recipe JOIN recsteps ON recsteps.id = recipe.id`,
        test2: `SELECT * FROM recipe 
        JOIN recsteps ON recsteps.id = recipe.id ORDER BY id`,
        topdishes: `SELECT * FROM recipe ORDER BY ID`,
        ingridients: `SELECT * FROM ingridients`,
        likedplus: `INSERT INTO liked(id,name,time,image,category,type,description) VALUES(?,?,?,?,?,?,?)`,
        liked: `SELECT * FROM liked`,
        new:`SELECT * FROM recipe WHERE id LIKE ?`
    }
    let sql = sql_queries[query];
    console.log(sql_queries.bSearchCheclBx);
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
    get_data("topdishes", []).then((resolve) => {
        // console.log({resolve})
        // for(i = 0, l = resolve.length; i < l; i++){
        //     let unparsedtag = resolve[i]["tag"]
        //     console.log( resolve[i]["tag"])
        //     // let tags= unparsedtag.split(",")
        // }
        get_data("ingridients", []).then((ingridients) => {
            res.render(__dirname + '/pages/index.html', { resolve, ingridients });
        })
    })
});


app.get('/search', (request, response) => {
    const search = request.query.q;
    let SearchedList = [];
    get_data("search", []).then((resolve) => {
        // const data = { resolve };
        for (let i = 0, l = resolve.length; i < l; i++) {
            var obj = resolve[i];
            var similarity = stringSimilarity.compareTwoStrings(String(search == undefined ? "test" : search.toLowerCase()), obj.name.toLowerCase())
            if (similarity >= 0.2) {
                SearchedList.push(obj)
            }
        }
        for (let i = 0, l = resolve.length; i < l; i++) {
            var obj = resolve[i];
            var similarity = stringSimilarity.compareTwoStrings(String(search == undefined ? "test" : search.toLowerCase()), obj.category.toLowerCase())
            if (similarity >= 0.2) {
                SearchedList.push(obj)
            }
        }
        for (let i = 0, l = resolve.length; i < l; i++) {
            var obj = resolve[i];
            var similarity = stringSimilarity.compareTwoStrings(String(search == undefined ? "test" : search.toLowerCase()), obj.tag.toLowerCase())
            if (similarity >= 0.2) {
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
app.get('/signUp', function (request, response) {
    get_data("all", []).then((resolve) => {
        response.render(__dirname + '/pages/signUp.html', resolve);
    })
})

app.get('/bettersearch1', (request, res) => {
    let q1 = String(request.query.q1);
    let q2 = String(request.query.q2);
    let q3 = String(request.query.q3);
    get_data("bSearchCheclBx", [q1, q2, q3]).then((resolve) => {
        res.json(resolve);
    })
})
app.get('/Liked', function (req, res) {
    get_data("liked", []).then((resolve) => {
        res.render(__dirname + '/pages/Liked.html', { resolve });
    })
})
app.post('/like', function (req, res) {
    let q1 = req.body.id
    // let q2 = req.body.name
    // let q3 = req.body.time
    // let q4 = req.body.image
    // let q5 = req.body.category
    // let q6 = req.body.type
    // let q7 = req.body.description//id,name,time,image,category,type,description
    // let test = req.body.firstName
    get_data("new", [q1]).then(({resolve}) => {//likedplus
        // console.log(Aname)
        let q2=resolve.id
        console.log(q2)

        // res.render(__dirname + '/pages/Liked.html', { resolve });
    })
})
app.get('/recipe', (req, res) => {
    let r = req.query.r;
    console.log(r)

    get_data("recipe", [r]).then((resolve) => {
        res.render(__dirname + '/pages/recipe.html', { resolve });
    })
})
app.listen(port, function () {
    console.log(`Server stated on: http://${host}:${port}`)
});
