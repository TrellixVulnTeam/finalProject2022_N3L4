const express = require('express');
const app = express();
const port = 3000
const host = '127.0.0.1';
app.use(express.static(__dirname + '/public/static'));

const nunjucks = require('nunjucks');
nunjucks.configure('.', {
    autoescape: true,
    express: app
});
var env = nunjucks.configure(".", { autoescape: false });


app.get('/', (req, res) =>{ 
    res.render(__dirname + '/pages/index.html');
});



app.listen(port, function(){
    console.log(`Server stated on: http://${host}:${port}`)
});