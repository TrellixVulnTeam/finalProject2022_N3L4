$("").click(function () {
    axios.get('/index', {
        params: {
            "requestName": "dishCardImport",
            "dishName": ""
        }
    })
        .then(function (response) {
            console.log("well done");
        })
        .catch(function (error) {
            console.log(error);
        })
})

$(".enterButton").click(function () {
    console.log(1);
    axios.get('/index', {
        params: {
            "requestName": "logInUser",
            "typeOfImort": $(this).attr("shownUser")
        }
    })
        .then(function (response) {
            console.log(1);
        })
        .catch(function (error) {
            console.log(error);
        })
})