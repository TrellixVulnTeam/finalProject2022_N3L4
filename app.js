const express = require('express');
const app = express();
const port = 3000
const host = '127.0.0.1';
const sqlite = require('sqlite3');
const stringSimilarity = require("string-similarity");
//=)

app.use(express.static(__dirname + '/public/static'));

const nunjucks = require('nunjucks');
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
            console.log("connect to db complete!");
        }
    });

    let sql_queries = {
        all: "SELECT * FROM recipe",
        search: "SELECT * FROM recipe",
        bettersearch: `SELECT * FROM recipe WHERE category = ?`
    }
    let sql = sql_queries[query];

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
        for(i=0;i<resolve.length;i++){
        }
        console.log(l)
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
            console.log(search, obj.name)
            var similarity = stringSimilarity.compareTwoStrings(String(search == undefined ? "test" : search.toLowerCase()), obj.name.toLowerCase())
            if (similarity >= 0.2) {
                console.log(obj.name, 'Сходство(name):', similarity)
                SearchedList.push(obj)
            }
        }
        for (let i = 0, l = resolve.length; i < l; i++) {
            var obj = resolve[i];
            console.log(search, obj.name)
            var similarity = stringSimilarity.compareTwoStrings(String(search == undefined ? "test" : search.toLowerCase()), obj.category.toLowerCase())
            if (similarity >= 0.2) {
                console.log(obj.name, 'Сходство(name):', similarity)
                SearchedList.push(obj)
            }
        }
        response.render(__dirname + '/pages/search.html', { SearchedList });
    })
})
app.get('/bettersearch', function (request, response) {
    let categorybox = request.query.categorycheckbox;
    let categoryradio = request.query.category;
    // console.log(categoryradio, categorybox)
    var list = []
    get_data("all", []).then((resolve) => {
        // let data = { resolve }
        // for (let i = 0, l = resolve.length; i < l; i++) {
        //     let obj = resolve[i]
        //     // console.log({obj})

        //     if (resolve[i].category = categorybox) {
        //         console.log(obj)
        //         break;
        //     }
        // }
        // console.log({ list })
        for (let i = 0, l = resolve.length; i < l; i++) {
            var obj = resolve[i];
            var similarity = stringSimilarity.compareTwoStrings(String(categorybox), obj.category)
            if (similarity >= 0.2) {
                // console.log(obj.name, 'Сходство(name):', similarity)
                list.push(obj)
            }
        }
        response.render(__dirname + '/pages/bettersearch.html', { list });
    })


})


app.listen(port, function () {
    console.log(`Server stated on: http://${host}:${port}`)
});